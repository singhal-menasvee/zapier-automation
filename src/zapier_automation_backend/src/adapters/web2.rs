// src/zapier_automation_backend/src/adapters/web2.rs
//! Adapters for talking to Google (auth URL builder, token exchange, calendar/gmail fetch)

use candid::{CandidType, Nat};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use ic_cdk::api::management_canister::http_request::{
    CanisterHttpRequestArgument, HttpHeader, HttpMethod,
};

thread_local! {
    /// Very small counter to generate a short per-canister state token for the auth URL.
    /// This avoids pulling external randomness in the canister and is sufficient for dev.
    static STATE_COUNTER: RefCell<u64> = RefCell::new(0);
}

/// Types exposed to the rest of the canister / to the frontend
#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct GoogleAuthUrlResponse {
    pub auth_url: String,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct GoogleTokenResponse {
    pub access_token: String,
    pub expires_in: Nat,
    pub refresh_token: Option<String>,
    pub scope: String,
    pub token_type: String,
    pub id_token: Option<String>,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct GoogleCalendar {
    pub id: String,
    pub summary: String,
    pub description: Option<String>,
    #[serde(rename = "accessRole")]
    pub access_role: String,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct GoogleGmailProfile {
    pub email_address: String,
}

// Constants (replace CLIENT_SECRET with secure config for production)
const MAX_RESPONSE_BYTES: Option<u64> = Some(50_000);
const CYCLES: u128 = 2_000_000_000;

const GOOGLE_AUTH_ENDPOINT: &str = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT: &str = "https://oauth2.googleapis.com/token";
const GOOGLE_CAL_LIST_ENDPOINT: &str =
    "https://www.googleapis.com/calendar/v3/users/me/calendarList";
const GMAIL_PROFILE_ENDPOINT: &str = "https://gmail.googleapis.com/gmail/v1/users/me/profile";

// Update these with your dev credentials
const GOOGLE_CLIENT_ID: &str =
    "548274771061-rpqt1l6i19hucmpar07nis5obr5shm0j.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET: &str = "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"; // local dev only
const GOOGLE_REDIRECT_URI: &str = "http://localhost:3000/OAuth2Callback";

/// Build Google OAuth URL and return the object with an `auth_url` field.
/// A tiny per-canister counter is used to create a `state` param so frontend can store/verify it.
pub fn get_google_auth_url() -> GoogleAuthUrlResponse {
    // scopes you need
    let scopes = [
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/spreadsheets.readonly",
        "openid",
        "email",
        "profile",
    ]
    .join(" ");

    // generate a short state token
    let state = STATE_COUNTER.with(|c| {
        let mut v = c.borrow_mut();
        *v += 1;
        format!("st{}", *v)
    });

    let url = format!(
        "{}?response_type=code&client_id={}&redirect_uri={}&scope={}&state={}&access_type=offline&prompt=consent",
        GOOGLE_AUTH_ENDPOINT,
        urlencoding::encode(GOOGLE_CLIENT_ID),
        urlencoding::encode(GOOGLE_REDIRECT_URI),
        urlencoding::encode(&scopes),
        urlencoding::encode(&state),
    );

    GoogleAuthUrlResponse { auth_url: url }
}

/// Exchange authorization code for tokens via management canister HTTP (POST to Google token endpoint).
pub async fn exchange_google_code(code: String) -> Result<GoogleTokenResponse, String> {
    #[derive(Deserialize)]
    struct TokenResponseRaw {
        access_token: String,
        expires_in: u64,
        #[serde(default)]
        refresh_token: Option<String>,
        #[serde(default)]
        scope: Option<String>,
        #[serde(default)]
        token_type: Option<String>,
        #[serde(default)]
        id_token: Option<String>,
    }

    let body_str = format!(
        "code={}&client_id={}&client_secret={}&redirect_uri={}&grant_type=authorization_code",
        urlencoding::encode(&code),
        urlencoding::encode(GOOGLE_CLIENT_ID),
        urlencoding::encode(GOOGLE_CLIENT_SECRET),
        urlencoding::encode(GOOGLE_REDIRECT_URI),
    );

    let request = CanisterHttpRequestArgument {
        url: GOOGLE_TOKEN_ENDPOINT.to_string(),
        method: HttpMethod::POST,
        headers: vec![HttpHeader {
            name: "Content-Type".to_string(),
            value: "application/x-www-form-urlencoded".to_string(),
        }],
        body: Some(body_str.into_bytes()),
        max_response_bytes: MAX_RESPONSE_BYTES,
        transform: None,
    };

    let (response,) = ic_cdk::api::management_canister::http_request::http_request(request, CYCLES)
        .await
        .map_err(|e| format!("Token HTTP request failed: {:?}", e))?;

    if response.status != Nat::from(200u32) {
        return Err(format!(
            "Google token endpoint returned status {} body: {}",
            response.status,
            String::from_utf8_lossy(&response.body)
        ));
    }

    let raw: TokenResponseRaw = serde_json::from_slice(&response.body)
        .map_err(|e| format!("Failed to parse token JSON: {:?}", e))?;

    Ok(GoogleTokenResponse {
        access_token: raw.access_token,
        expires_in: Nat::from(raw.expires_in),
        refresh_token: raw.refresh_token,
        scope: raw.scope.unwrap_or_default(),
        token_type: raw.token_type.unwrap_or_else(|| "Bearer".to_string()),
        id_token: raw.id_token,
    })
}

/// Fetch calendar list using an access token (returns Vec<GoogleCalendar>)
pub async fn get_google_calendars_with_token(
    access_token: &str,
) -> Result<Vec<GoogleCalendar>, String> {
    #[derive(Deserialize)]
    struct CalendarList {
        items: Vec<GoogleCalendar>,
    }

    let request = CanisterHttpRequestArgument {
        url: GOOGLE_CAL_LIST_ENDPOINT.to_string(),
        method: HttpMethod::GET,
        headers: vec![HttpHeader {
            name: "Authorization".to_string(),
            value: format!("Bearer {}", access_token),
        }],
        body: None,
        max_response_bytes: MAX_RESPONSE_BYTES,
        transform: None,
    };

    let (response,) = ic_cdk::api::management_canister::http_request::http_request(request, CYCLES)
        .await
        .map_err(|e| format!("Calendar HTTP request failed: {:?}", e))?;

    if response.status != Nat::from(200u32) {
        return Err(format!(
            "Calendar API returned status {} body: {}",
            response.status,
            String::from_utf8_lossy(&response.body)
        ));
    }

    let calendars: CalendarList = serde_json::from_slice(&response.body)
        .map_err(|e| format!("Failed to parse calendar list JSON: {:?}", e))?;

    Ok(calendars.items)
}

/// Fetch Gmail profile using access token
pub async fn get_google_gmail_profile_with_token(
    access_token: &str,
) -> Result<GoogleGmailProfile, String> {
    #[derive(Deserialize)]
    struct GmailProfileRaw {
        #[serde(rename = "emailAddress")]
        email_address: String,
    }

    let request = CanisterHttpRequestArgument {
        url: GMAIL_PROFILE_ENDPOINT.to_string(),
        method: HttpMethod::GET,
        headers: vec![HttpHeader {
            name: "Authorization".to_string(),
            value: format!("Bearer {}", access_token),
        }],
        body: None,
        max_response_bytes: MAX_RESPONSE_BYTES,
        transform: None,
    };

    let (response,) = ic_cdk::api::management_canister::http_request::http_request(request, CYCLES)
        .await
        .map_err(|e| format!("Gmail profile HTTP call failed: {:?}", e))?;

    if response.status != Nat::from(200u32) {
        return Err(format!(
            "Gmail profile HTTP returned status {} body: {}",
            response.status,
            String::from_utf8_lossy(&response.body)
        ));
    }

    let raw: GmailProfileRaw = serde_json::from_slice(&response.body)
        .map_err(|e| format!("Failed parsing Gmail profile JSON: {:?}", e))?;

    Ok(GoogleGmailProfile {
        email_address: raw.email_address,
    })
}
