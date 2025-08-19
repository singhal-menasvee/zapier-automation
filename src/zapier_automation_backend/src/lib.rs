pub mod adapters;
pub mod core;

pub use crate::core::lib::*;
use crate::adapters::web2;

use crate::adapters::webhook as wh;
use ic_cdk::api::management_canister::http_request::{
    CanisterHttpRequestArgument, HttpHeader, HttpResponse,HttpMethod
};
use std::cell::RefCell;
use std::collections::HashMap;

thread_local! {
    static WORKFLOW_INPUTS: RefCell<HashMap<String, String>> = RefCell::new(HashMap::new());
    static WEBHOOKS: RefCell<HashMap<String, wh::WebhookTrigger>> = RefCell::new(HashMap::new());
}

#[ic_cdk::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    use candid::export_service;
    export_service!();
    "__export_service".to_string()
}

#[ic_cdk::update]
pub fn create_webhook_for_workflow(workflow_id: String) -> (String, String) {
    let caller = ic_cdk::caller();
    let w = wh::create_webhook_trigger(workflow_id, caller);
    WEBHOOKS.with(|hooks| hooks.borrow_mut().insert(w.id.clone(), w.clone()));
    (w.id.clone(), format!("/webhook/{}?sig={}", w.id, w.secret))
}

#[ic_cdk::update]
pub fn delete_webhook(id: String) -> bool {
    WEBHOOKS.with(|hooks| hooks.borrow_mut().remove(&id));
    wh::delete_webhook_trigger(&id)
}

#[ic_cdk::query]
pub fn list_webhooks() -> Vec<wh::WebhookTrigger> {
    wh::all_webhooks()
}

#[ic_cdk::update]
pub async fn webhook_action(
    url: String,
    body_json: String,
    headers: Vec<(String, String)>
) -> Result<u16, String> {
    wh::send_webhook_action(url, body_json.into_bytes(), headers)
        .await
        .map(|resp| resp.status_code)
}

#[ic_cdk::query]
fn http_request(req: CanisterHttpRequestArgument) -> HttpResponse {
    if req.url.starts_with("/webhook/") {
        if let Some(webhook_id) = req.url.split('/').nth(2).and_then(|s| s.split('?').next()) {
            if let Some(webhook) = WEBHOOKS.with(|hooks| hooks.borrow().get(webhook_id).cloned()) {
                if req.method == HttpMethod::POST {
                    let payload = String::from_utf8(req.body.unwrap_or_default()).unwrap_or_default();
                    WORKFLOW_INPUTS.with(|inputs| inputs.borrow_mut().insert(webhook.workflow_id, payload));

                    return HttpResponse {
                        status: 200u64.into(),
                        headers: vec![HttpHeader {
                            name: "Content-Type".to_string(),
                            value: "text/plain".to_string(),
                        }],
                        body: b"Webhook received".to_vec(),
                    };
                } else {
                    return HttpResponse {
                        status: 405u64.into(),
                        headers: vec![HttpHeader {
                            name: "Allow".to_string(),
                            value: "POST".to_string(),
                        }],
                        body: b"Method not allowed".to_vec(),
                    };
                }
            }
        }
        return HttpResponse {
            status: 404u64.into(),
            headers: vec![HttpHeader {
                name: "Content-Type".to_string(),
                value: "text/plain".to_string(),
            }],
            body: b"Webhook not found".to_vec(),
        };
    }

    HttpResponse {
        status: 404u64.into(),
        headers: vec![HttpHeader {
            name: "Content-Type".to_string(),
            value: "text/plain".to_string(),
        }],
        body: b"Not found".to_vec(),
    }
}