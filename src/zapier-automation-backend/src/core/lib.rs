use ic_cdk_macros::*;
use ic_cdk::export_candid;
use candid::CandidType;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use ic_cdk::api::management_canister::http_request::{
    http_request as call_http_request_func,
    CanisterHttpRequestArgument,
    HttpMethod,
    HttpHeader,
    HttpResponse,
};

// === Query Example ===

#[derive(CandidType, Serialize, Deserialize)]
struct MyResponse {
    message: String,
}

#[query]
fn get_message() -> MyResponse {
    MyResponse {
        message: "Hello from Internet Computer!".to_string(),
    }
}

// === Data Structures ===

#[derive(Debug, Serialize, Deserialize, CandidType)]
pub struct GoogleTokenResponse {
    pub access_token: String,
    pub expires_in: u32,
    pub refresh_token: Option<String>,
    pub scope: String,
    pub token_type: String,
    pub id_token: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, CandidType)]
pub struct GoogleUserInfo {
    pub id: String,
    pub email: String,
    pub verified_email: bool,
    pub name: String,
    pub given_name: String,
    pub family_name: String,
    pub picture: String,
    pub locale: String,
}

// === Update Method ===

#[update]
async fn exchange_google_auth_code(auth_code: String) -> Result<String, String> {
    let client_id = std::env::var("GOOGLE_CLIENT_ID")
        .map_err(|e| format!("GOOGLE_CLIENT_ID not found: {}", e))?;
    let client_secret = std::env::var("GOOGLE_CLIENT_SECRET")
        .map_err(|e| format!("GOOGLE_CLIENT_SECRET not found: {}", e))?;
    let redirect_uri = std::env::var("GOOGLE_REDIRECT_URI")
        .map_err(|e| format!("GOOGLE_REDIRECT_URI not found: {}", e))?;

    let token_endpoint = "https://oauth2.googleapis.com/token";

    let mut params = HashMap::new();
    params.insert("code", auth_code);
    params.insert("client_id", client_id);
    params.insert("client_secret", client_secret);
    params.insert("redirect_uri", redirect_uri);
    params.insert("grant_type", "authorization_code".to_string());

    let request_body = serde_urlencoded::to_string(&params)
        .map_err(|e| format!("Failed to encode request body: {}", e))?;

    let request_headers = vec![
        HttpHeader {
            name: "Content-Type".to_string(),
            value: "application/x-www-form-urlencoded".to_string(),
        },
        HttpHeader {
            name: "Accept".to_string(),
            value: "application/json".to_string(),
        },
    ];

    let cycles = 10_000_000_000;

    let token_request_arg = CanisterHttpRequestArgument {
        url: token_endpoint.to_string(),
        method: HttpMethod::POST,
        headers: request_headers,
        body: Some(request_body.as_bytes().to_vec()),
        transform: None,
        max_response_bytes: None,
    };

    let (token_response_result,) =
        call_http_request_func(token_request_arg, cycles)
            .await
            .map_err(|e| format!("HTTPS outcall failed: {:?}", e))?;

    let response_str = String::from_utf8(token_response_result.body)
        .map_err(|e| format!("Failed to parse response as UTF-8: {}", e))?;

    let token_response: GoogleTokenResponse = serde_json::from_str(&response_str)
        .map_err(|e| format!("Failed to parse Google token response JSON: {}", e))?;

    // === Fetch User Info ===

    let userinfo_endpoint = "https://www.googleapis.com/oauth2/v2/userinfo";
    let userinfo_headers = vec![
        HttpHeader {
            name: "Authorization".to_string(),
            value: format!("Bearer {}", token_response.access_token),
        },
        HttpHeader {
            name: "Accept".to_string(),
            value: "application/json".to_string(),
        },
    ];

    let userinfo_request_arg = CanisterHttpRequestArgument {
        url: userinfo_endpoint.to_string(),
        method: HttpMethod::GET,
        headers: userinfo_headers,
        body: None,
        transform: None,
        max_response_bytes: None,
    };

    let (userinfo_response_result,) =
        call_http_request_func(userinfo_request_arg, cycles)
            .await
            .map_err(|e| format!("User info HTTPS outcall failed: {:?}", e))?;

    let userinfo_str = String::from_utf8(userinfo_response_result.body)
        .map_err(|e| format!("Failed to parse user info response as UTF-8: {}", e))?;

    let user_info: GoogleUserInfo = serde_json::from_str(&userinfo_str)
        .map_err(|e| format!("Failed to parse Google user info JSON: {}", e))?;

    Ok(format!("Successfully authenticated Google user: {}", user_info.email))
}

// === Export Candid Interface ===

export_candid!();