use ic_cdk::api::management_canister::http_request::{
    CanisterHttpRequestArgument, HttpHeader, HttpMethod,
};
use serde::{Deserialize, Serialize};
use candid::{CandidType, Nat}; 
use ic_cdk::println;

#[derive(Serialize, Deserialize, Debug, CandidType, Clone)]
pub struct GoogleTokenResponse {
    pub access_token: String,
    pub expires_in: Nat,
    pub refresh_token: Option<String>,
    pub scope: String,
    pub token_type: String,
    pub id_token: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, CandidType, Clone)]
pub struct GoogleCalendar {
    pub id: String,
    pub summary: String,
    pub description: Option<String>,
    pub access_role: String,
}

const GOOGLE_CLIENT_ID: &str = "548274771061-rpqt1l6i19hucmpar07nis5obr5shm0j.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET: &str = "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";
const REDIRECT_URI: &str = "http://localhost:3000/OAuth2Callback";
const GOOGLE_TOKEN_URL: &str = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_API: &str = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
const MAX_RESPONSE_BYTES: Option<u64> = Some(5000);
const CYCLES: u128 = 2_000_000_000;

pub async fn exchange_google_code(code: String) -> Result<GoogleTokenResponse, String> {
    if code.is_empty() {
        return Err("Empty authorization code".to_string());
    }

    use urlencoding::encode;

let body = format!(
    "code={}&client_id={}&client_secret={}&redirect_uri={}&grant_type=authorization_code",
    encode(&code),
    encode(GOOGLE_CLIENT_ID),
    encode(GOOGLE_CLIENT_SECRET),
    encode(REDIRECT_URI)
);


    let request = CanisterHttpRequestArgument {
        url: GOOGLE_TOKEN_URL.to_string(),
        method: HttpMethod::POST,
        headers: vec![
            HttpHeader {
                name: "Content-Type".to_string(),
                value: "application/x-www-form-urlencoded".to_string(),
            },
            HttpHeader {
                name: "Accept".to_string(),
                value: "application/json".to_string(),
            },
        ],
        body: Some(body.into_bytes()),
        max_response_bytes: MAX_RESPONSE_BYTES,
        transform: None,
    };

   #[cfg(debug_assertions)]
println!("🔄 Request body: {}", body);


    let (response,) = ic_cdk::api::management_canister::http_request::http_request(request, CYCLES)
        .await
        .map_err(|e| format!("HTTPS outcall failed: {:?}", e))?;
    
    #[cfg(debug_assertions)]
    println!("🔍 Raw response: {}", String::from_utf8_lossy(&response.body));

    if response.status != Nat::from(200u32) {
        let error_body = String::from_utf8_lossy(&response.body);
        return Err(format!("Token exchange failed ({}):  {}", response.status, error_body));
    }

    let token_response: GoogleTokenResponse = serde_json::from_slice(&response.body)
        .map_err(|e| {
            let body_str = String::from_utf8_lossy(&response.body);
            format!("Failed to parse token response: {:?}. Body: {}", e, body_str)
        })?;

    Ok(token_response)
}

pub async fn get_google_calendars_with_token(access_token: &str) -> Result<Vec<GoogleCalendar>, String> {
    let request = CanisterHttpRequestArgument {
        url: GOOGLE_CALENDAR_API.to_string(),
        method: HttpMethod::GET,
        headers: vec![
            HttpHeader {
                name: "Authorization".to_string(),
                value: format!("Bearer {}", access_token),
            },
        ],
        body: None,
        max_response_bytes: MAX_RESPONSE_BYTES,
        transform: None,
    };

    let (response,) = ic_cdk::api::management_canister::http_request::http_request(request, CYCLES)
        .await
        .map_err(|e| format!("Failed to fetch calendars: {:?}", e))?;

    if response.status != Nat::from(200u32) {
        return Err(format!("Calendar API error: {}", String::from_utf8_lossy(&response.body)));
    }

    #[derive(Deserialize)]
    struct CalendarList {
        items: Vec<GoogleCalendar>,
    }

    let calendars: CalendarList = serde_json::from_slice(&response.body)
        .map_err(|e| format!("Failed to parse calendar response: {:?}", e))?;

    Ok(calendars.items)
}

fn validate_token_response(token: &GoogleTokenResponse) -> Result<(), String> {
    if token.access_token.is_empty() {
        return Err("Empty access token".to_string());
    }
    if token.token_type.is_empty() {
        return Err("Empty token type".to_string());
    }
    if token.expires_in == Nat::from(0u32) {
        return Err("Invalid expiration time".to_string());
    }
    Ok(())
}