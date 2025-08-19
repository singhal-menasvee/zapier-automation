use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod
};
use serde::Serialize;
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct GoogleTokenResponse {
    pub access_token: String,
    pub expires_in: u64,
    pub refresh_token: Option<String>,
    pub scope: Option<String>,
    pub token_type: String,
    pub id_token: Option<String>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct GoogleCalendar {
    pub id: String,
    pub summary: String,
    pub description: Option<String>,
    pub time_zone: Option<String>,
}

const GOOGLE_CLIENT_ID: &str = "548274771061-rpqt1l6i19hucmpar07nis5obr5shm0j.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET: &str = "your-client-secret-here";
const REDIRECT_URI: &str = "http://localhost:3000/OAuth2Callback";

thread_local! {
    static GOOGLE_TOKEN_STORE: RefCell<HashMap<Principal, GoogleTokenResponse>> = RefCell::new(HashMap::new());
}

pub async fn exchange_google_code(code: String) -> Result<GoogleTokenResponse, String> {
    let token_url = "https://oauth2.googleapis.com/token";
    
    let body = format!(
        "client_id={}&client_secret={}&code={}&grant_type=authorization_code&redirect_uri={}",
        urlencoding::encode(GOOGLE_CLIENT_ID),
        urlencoding::encode(GOOGLE_CLIENT_SECRET),
        urlencoding::encode(&code),
        urlencoding::encode(REDIRECT_URI)
    );

    let request_arg = CanisterHttpRequestArgument {
        url: token_url.to_string(),
        method: HttpMethod::POST,
        body: Some(body.into_bytes()),
        max_response_bytes: Some(4096),
        transform: None,
        headers: vec![
            HttpHeader {
                name: "Content-Type".to_string(),
                value: "application/x-www-form-urlencoded".to_string(),
            }
        ],
    };

    match http_request(request_arg, 100_000_000).await { // Added cycles parameter
        Ok((response,)) => {
            if response.status != 200u64 {
                return Err(format!("Google token exchange failed with status: {}", response.status));
            }

            let response_text = String::from_utf8(response.body)
                .map_err(|_| "Invalid UTF-8 response from Google".to_string())?;

            serde_json::from_str(&response_text)
                .map_err(|e| format!("Failed to parse Google token response: {}", e))
        },
        Err((code, msg)) => Err(format!("HTTP request failed {:?}: {}", code, msg)),
    }
}

pub async fn get_google_calendars_with_token(access_token: &str) -> Result<Vec<GoogleCalendar>, String> {
    let calendar_url = "https://www.googleapis.com/calendar/v3/users/me/calendarList";

    let request_arg = CanisterHttpRequestArgument {
        url: calendar_url.to_string(),
        method: HttpMethod::GET,
        body: None,
        max_response_bytes: Some(8192),
        transform: None,
        headers: vec![
            HttpHeader {
                name: "Authorization".to_string(),
                value: format!("Bearer {}", access_token),
            }
        ],
    };

    match http_request(request_arg, 100_000_000).await { // Added cycles parameter
        Ok((response,)) => {
            if response.status != 200u64 {
                return Err(format!("Google Calendar API failed with status: {}", response.status));
            }

            let response_text = String::from_utf8(response.body)
                .map_err(|_| "Invalid UTF-8 response from Google Calendar API".to_string())?;

            let calendar_list: serde_json::Value = serde_json::from_str(&response_text)
                .map_err(|e| format!("Failed to parse calendar response: {}", e))?;

            Ok(calendar_list["items"]
                .as_array()
                .ok_or("No calendars found in response")?
                .iter()
                .filter_map(|item| {
                    Some(GoogleCalendar {
                        id: item["id"].as_str()?.to_string(),
                        summary: item["summary"].as_str()?.to_string(),
                        description: item["description"].as_str().map(|s| s.to_string()),
                        time_zone: item["timeZone"].as_str().map(|s| s.to_string()),
                    })
                })
                .collect())
        },
        Err((code, msg)) => Err(format!("HTTP request failed {:?}: {}", code, msg)),
    }
}

pub fn store_google_token(user: Principal, token: GoogleTokenResponse) {
    GOOGLE_TOKEN_STORE.with(|store| store.borrow_mut().insert(user, token));
}

pub fn has_google_token(user: Principal) -> bool {
    GOOGLE_TOKEN_STORE.with(|store| store.borrow().contains_key(&user))
}

pub fn get_google_token(user: Principal) -> Option<GoogleTokenResponse> {
    GOOGLE_TOKEN_STORE.with(|store| store.borrow().get(&user).cloned())
}