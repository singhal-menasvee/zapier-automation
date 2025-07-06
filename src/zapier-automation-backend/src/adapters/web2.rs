use ic_cdk::api::management_canister::http_request::{
    CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse, TransformArgs,
};
use ic_cdk::{query, update};
use serde::{Deserialize, Serialize};
use std::str;

#[derive(Serialize, Deserialize, Debug)]
struct GoogleTokenResponse {
    access_token: String,
    expires_in: u32,
    refresh_token: Option<String>,
    scope: String,
    token_type: String,
}

#[update]
pub async fn exchange_google_code(code: String) -> Result<GoogleTokenResponse, String> {
    let body = format!(
        "code={}&client_id={}&client_secret={}&redirect_uri={}&grant_type=authorization_code",
        let client_id = std::env::var("GOOGLE_CLIENT_ID").unwrap_or_default();
let client_secret = std::env::var("GOOGLE_CLIENT_SECRET").unwrap_or_default();

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

    let (response,): (HttpResponse,) =
        ic_cdk::api::management_canister::http_request::http_request(request)
            .await
            .map_err(|e| format!("HTTPS outcall failed: {:?}", e))?;

    if response.status != 200 {
        return Err(format!(
            "Token exchange failed: {}",
            String::from_utf8_lossy(&response.body)
        ));
    }

    let token_response: GoogleTokenResponse = serde_json::from_slice(&response.body)
        .map_err(|e| format!("Failed to parse token JSON: {:?}", e))?;

    Ok(token_response)
}
