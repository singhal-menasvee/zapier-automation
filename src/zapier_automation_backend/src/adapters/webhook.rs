use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod
};
use ic_cdk::api::time;
use rand::{RngCore, SeedableRng};
use rand_chacha::ChaCha20Rng;
use std::cell::RefCell;
use std::collections::HashMap;
use num_traits::ToPrimitive; 


#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct WebhookTrigger {
    pub id: String,
    pub workflow_id: String,
    pub secret: String,
    pub created_by: Principal,
    pub created_at: u64,
}

#[derive(Clone, Debug)]
pub struct WebhookHttpResponse {
    pub status_code: u16,
    pub headers: Vec<(String, String)>,
    pub body: Vec<u8>,
}

thread_local! {
    static WEBHOOKS: RefCell<HashMap<String, WebhookTrigger>> = RefCell::new(HashMap::new());
}

fn random_hex(len: usize) -> String {
    let mut rng = ChaCha20Rng::seed_from_u64(time());
    let mut bytes = vec![0_u8; len];
    rng.fill_bytes(&mut bytes);
    bytes.into_iter().map(|b| format!("{:02x}", b)).collect()
}

pub fn create_webhook_trigger(workflow_id: String, creator: Principal) -> WebhookTrigger {
    let id = random_hex(12);
    let secret = random_hex(48);
    let wh = WebhookTrigger {
        id: id.clone(),
        workflow_id,
        secret,
        created_by: creator,
        created_at: time(),
    };
    WEBHOOKS.with(|m| m.borrow_mut().insert(id, wh.clone()));
    wh
}

pub fn delete_webhook_trigger(id: &str) -> bool {
    WEBHOOKS.with(|m| m.borrow_mut().remove(id).is_some())
}

pub fn get_webhook_trigger(id: &str) -> Option<WebhookTrigger> {
    WEBHOOKS.with(|m| m.borrow().get(id).cloned())
}

pub fn all_webhooks() -> Vec<WebhookTrigger> {
    WEBHOOKS.with(|m| m.borrow().values().cloned().collect())
}

pub async fn send_webhook_action(
    url: String,
    body: Vec<u8>,
    headers: Vec<(String, String)>
) -> Result<WebhookHttpResponse, String> {
    let mut http_headers = headers.into_iter()
        .map(|(name, value)| HttpHeader { name, value })
        .collect::<Vec<_>>();
    
    if !http_headers.iter().any(|h| h.name.eq_ignore_ascii_case("content-type")) {
        http_headers.push(HttpHeader {
            name: "Content-Type".to_string(),
            value: "application/json".to_string(),
        });
    }

    let request_arg = CanisterHttpRequestArgument {
        url,
        method: HttpMethod::POST,
        body: Some(body),
        max_response_bytes: Some(64 * 1024),
        transform: None,
        headers: http_headers,
    };

    match http_request(request_arg, 100_000_000).await { // Added cycles parameter
        Ok((response,)) => Ok(WebhookHttpResponse {
            status_code: response.status.0.to_u16().unwrap_or(500),
            headers: response.headers.into_iter()
                .map(|h| (h.name, h.value))
                .collect(),
            body: response.body,
        }),
        Err((code, msg)) => Err(format!("HTTP request failed {:?}: {}", code, msg)),

    }
}

pub fn validate_incoming(secret: &str, headers: &[(String, String)]) -> bool {
    headers.iter()
        .find(|(k, _)| k.eq_ignore_ascii_case("x-webhook-signature"))
        .map_or(true, |(_, value)| value == secret)
}