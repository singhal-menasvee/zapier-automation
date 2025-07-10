use ic_cdk::api::management_canister::http_request::{
    CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse,
};
use ic_cdk::update;
use serde::{Deserialize, Serialize};
use candid::CandidType;
use std::str;

// Add CandidType derive and make struct public
#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct GoogleTokenResponse {
    pub access_token: String,
    pub expires_in: u32,
    pub refresh_token: Option<String>,
    pub scope: String,
    pub token_type: String,
}

#[update]
pub async fn exchange_google_code(code: String) -> Result<GoogleTokenResponse, String> {
    let client_id = std::env::var("GOOGLE_CLIENT_ID").unwrap_or_default();
    let client_secret = std::env::var("GOOGLE_CLIENT_SECRET").unwrap_or_default();
    let redirect_uri = std::env::var("GOOGLE_REDIRECT_URI").unwrap_or_else(|_| {
        "http://localhost:3000/OAuth2Callback".to_string()
    });

    let body = format!(
        "code={}&client_id={}&client_secret={}&redirect_uri={}&grant_type=authorization_code",
        code, client_id, client_secret, redirect_uri
    );

    let request = CanisterHttpRequestArgument {
        url: "https://oauth2.googleapis.com/token".to_string(),
        method: HttpMethod::POST,
        headers: vec![
            HttpHeader {
                name: "Content-Type".to_string(),
                value: "application/x-www-form-urlencoded".to_string(),
            },
        ],
        body: Some(body.as_bytes().to_vec()),
        max_response_bytes: Some(5000),
        transform: None,
    };

    // Fix: Add max_response_bytes parameter
    let (response,): (HttpResponse,) =
        ic_cdk::api::management_canister::http_request::http_request(request, 2_000_000_000)
            .await
            .map_err(|e| format!("HTTPS outcall failed: {:?}", e))?;

    if response.status != 200u16 {
        return Err(format!(
            "Token exchange failed: {}",
            String::from_utf8_lossy(&response.body)
        ));
    }

    let token_response: GoogleTokenResponse = serde_json::from_slice(&response.body)
        .map_err(|e| format!("Failed to parse token JSON: {:?}", e))?;

    Ok(token_response)
}