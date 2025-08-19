use candid::CandidType;
use serde::{Deserialize, Serialize};
use ic_cdk::update;
use crate::adapters::web2::exchange_google_code;

#[derive(Serialize, Deserialize, CandidType, Debug)]
pub struct AuthUrlResponse {
    pub url: String,
}

/// Frontend calls this from /OAuth2Callback page with the `code` query param.
/// Returns the access_token for now (you can later change this to store tokens).
#[update]
pub async fn google_oauth_callback(code: String) -> Result<String, String> {
    if code.trim().is_empty() {
        return Err("Missing `code`".into());
    }

    match exchange_google_code(code).await {
        Ok(token_response) => Ok(token_response.access_token),
        Err(e) => Err(format!("Failed to exchange code: {:?}", e)),
    }
}
