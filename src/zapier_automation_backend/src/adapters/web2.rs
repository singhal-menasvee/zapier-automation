use std::collections::HashMap;
use candid::{CandidType, Nat, Principal};
use serde::{Serialize, Deserialize};
use ic_cdk::api::management_canister::http_request::{
    CanisterHttpRequestArgument, HttpHeader, HttpMethod,
};
use ic_cdk_macros::{update, query};
use ic_cdk::api::call::call;
use std::cell::RefCell;

// =================== STATE ===================

#[derive(Serialize, Deserialize, Debug, CandidType, Clone, Default)]
pub struct GoogleTokenUserState {
    pub token: GoogleTokenResponse,
    pub last_event_timestamp: Option<String>,
}

thread_local! {
    static GOOGLE_TOKEN_STORE: RefCell<HashMap<Principal, GoogleTokenUserState>> = Default::default();
}

// =================== TOKEN ===================

#[derive(Serialize, Deserialize, Debug, CandidType, Clone, Default)]
pub struct GoogleTokenResponse {
    pub access_token: String,
    pub expires_in: Nat,
    pub refresh_token: Option<String>,
    pub scope: String,
    pub token_type: String,
    pub id_token: Option<String>,
}

// =================== CALENDAR ===================

#[derive(Serialize, Deserialize, Debug, CandidType, Clone)]
pub struct GoogleCalendar {
    pub id: String,
    pub summary: String,
    pub description: Option<String>,
    pub access_role: String,
}

#[derive(Serialize, Deserialize, Debug, CandidType, Clone)]
pub struct GoogleCalendarEvent {
    pub id: String,
    pub summary: Option<String>,
    pub start: Option<GoogleDateTime>,
    pub end: Option<GoogleDateTime>,
}

#[derive(Serialize, Deserialize, Debug, CandidType, Clone)]
pub struct GoogleDateTime {
    pub date_time: Option<String>,
    pub date: Option<String>,
}

// =================== GMAIL ===================

#[derive(Serialize, Deserialize, Debug, CandidType, Clone)]
pub struct GoogleGmailProfile {
    pub email_address: String,
}

// =================== CONSTANTS ===================

const MAX_RESPONSE_BYTES: Option<u64> = Some(5000);
const CYCLES: u128 = 2_000_000_000;

// ⚡ CHANGE THESE for your project
const GOOGLE_CLIENT_ID: &str = "548274771061-rpqt1l6i19hucmpar07nis5obr5.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET: &str = "YOUR_GOOGLE_CLIENT_SECRET"; 
const REDIRECT_URI: &str = "http://localhost:3000/oauth2/callback"; // must match React + GCP console
const GOOGLE_SCOPE: &str = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/spreadsheets.readonly";

// =================== OAUTH URL GENERATOR ===================

#[query]
pub fn get_google_auth_url() -> String {
    format!(
        "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id={}&redirect_uri={}&scope={}&access_type=offline&prompt=consent",
        GOOGLE_CLIENT_ID,
        REDIRECT_URI,
        urlencoding::encode(GOOGLE_SCOPE),
    )
}

// =================== GMAIL PROFILE FETCH ===================

pub async fn get_google_gmail_profile_with_token(access_token: &str) -> Result<GoogleGmailProfile, String> {
    let request = CanisterHttpRequestArgument {
        url: "https://gmail.googleapis.com/gmail/v1/users/me/profile".to_string(),
        method: HttpMethod::GET,
        headers: vec![
            HttpHeader {
                name: "Authorization".to_string(),
                value: format!("Bearer {}", access_token),
            }
        ],
        body: None,
        max_response_bytes: MAX_RESPONSE_BYTES,
        transform: None,
    };

    let (response,) = ic_cdk::api::management_canister::http_request::http_request(request, CYCLES)
        .await
        .map_err(|e| format!("Failed Gmail profile HTTP call: {:?}", e))?;

    if response.status != Nat::from(200u32) {
        return Err(format!("Gmail profile HTTP returned status: {}", response.status));
    }

    let profile: GoogleGmailProfile = serde_json::from_slice(&response.body)
        .map_err(|e| format!("Failed parsing Gmail profile JSON: {:?}", e))?;

    Ok(profile)
}
