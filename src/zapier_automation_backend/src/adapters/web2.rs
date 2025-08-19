use std::collections::HashMap;
use candid::{CandidType, Nat, Principal};
use serde::{Serialize, Deserialize};
use ic_cdk::api::management_canister::http_request::{
    CanisterHttpRequestArgument, HttpHeader, HttpMethod,
};
use ic_cdk_macros::{update, query};
use ic_cdk::api::call::call;
use std::cell::RefCell;

// State structures as before...

#[derive(Serialize, Deserialize, Debug, CandidType, Clone, Default)]
pub struct GoogleTokenUserState {
    pub token: GoogleTokenResponse,
    pub last_event_timestamp: Option<String>,
}

thread_local! {
    static GOOGLE_TOKEN_STORE: RefCell<HashMap<Principal, GoogleTokenUserState>> = Default::default();
}

// OAuth token response as before...

#[derive(Serialize, Deserialize, Debug, CandidType, Clone, Default)]
pub struct GoogleTokenResponse {
    pub access_token: String,
    pub expires_in: Nat,
    pub refresh_token: Option<String>,
    pub scope: String,
    pub token_type: String,
    pub id_token: Option<String>,
}

// Google Calendar structs as before...

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

// New: Gmail profile struct

#[derive(Serialize, Deserialize, Debug, CandidType, Clone)]
pub struct GoogleGmailProfile {
    pub email_address: String,
}

// Constants, URLs, cycles same as before...

const MAX_RESPONSE_BYTES: Option<u64> = Some(5000);
const CYCLES: u128 = 2_000_000_000;

// Existing functions for exchange, calendar fetching, events fetching unchanged...

// New: Fetch Gmail profile with token

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
