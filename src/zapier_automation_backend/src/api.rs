// src/zapier_automation_backend/src/api.rs
use ic_cdk_macros::{query, update};
use crate::adapters::web2;

/// Return `{ auth_url }` object to frontend
#[query]
fn get_google_auth_url() -> web2::GoogleAuthUrlResponse {
    web2::get_google_auth_url()
}

/// Exchange code (from OAuth redirect) for tokens.
/// This is an `update` because it may result in side-effects (store tokens later).
#[update]
async fn exchange_google_code_v2(code: String, _state: String) -> Result<web2::GoogleTokenResponse, String> {
    // For now we ignore _state server-side (frontend stores and verifies it).
    web2::exchange_google_code(code).await
}

/// Get calendar list using an access token (frontend may pass token from localStorage)
#[update]
async fn get_google_calendars(access_token: String) -> Result<Vec<web2::GoogleCalendar>, String> {
    web2::get_google_calendars_with_token(&access_token).await
}

/// Get Gmail profile using an access token
#[update]
async fn get_google_gmail_profile(access_token: String) -> Result<web2::GoogleGmailProfile, String> {
    web2::get_google_gmail_profile_with_token(&access_token).await
}
