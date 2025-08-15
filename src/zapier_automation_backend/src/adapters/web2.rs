use std::collections::HashMap;
use candid::{CandidType, Nat, Principal};
use serde::{Serialize, Deserialize};
use ic_cdk::api::management_canister::http_request::{
    CanisterHttpRequestArgument, HttpHeader, HttpMethod,
};
use ic_cdk_macros::{update, query};
use ic_cdk::api::call::call;


// ---------- State ----------
#[derive(Serialize, Deserialize, Debug, CandidType, Clone, Default)]
pub struct GoogleTokenUserState {
    pub token: GoogleTokenResponse,
    pub last_event_timestamp: Option<String>,
}

thread_local! {
    static GOOGLE_TOKEN_STORE: std::cell::RefCell<HashMap<Principal, GoogleTokenUserState>> = Default::default();
}

// ---------- Google Token Exchange Structures ----------
#[derive(Serialize, Deserialize, Debug, CandidType, Clone, Default)]
pub struct GoogleTokenResponse {
    pub access_token: String,
    pub expires_in: Nat,
    pub refresh_token: Option<String>,
    pub scope: String,
    pub token_type: String,
    pub id_token: Option<String>,
}

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

// ---------- Constants ----------
const GOOGLE_CLIENT_ID: &str = "548274771061-rpqt1l6i19hucmpar07nis5obr5shm0j.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET: &str = "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";
const REDIRECT_URI: &str = "http://localhost:3000/OAuth2Callback";
const GOOGLE_TOKEN_URL: &str = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_API: &str = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
const MAX_RESPONSE_BYTES: Option<u64> = Some(5000);
const CYCLES: u128 = 2_000_000_000;

// ---------- Canister Methods ----------

#[update]
pub async fn exchange_and_store_google_code(code: String) -> Result<(), String> {
    let token = exchange_google_code(code).await?;
    let caller = ic_cdk::api::caller();
    GOOGLE_TOKEN_STORE.with(|store| {
        store.borrow_mut().insert(caller, GoogleTokenUserState {
            token,
            last_event_timestamp: None,
        });
    });
    Ok(())
}

#[query]
pub fn has_token() -> bool {
    let caller = ic_cdk::api::caller();
    GOOGLE_TOKEN_STORE.with(|store| store.borrow().contains_key(&caller))
}

#[query]
pub fn get_my_token() -> Option<GoogleTokenResponse> {
    let caller = ic_cdk::api::caller();
    GOOGLE_TOKEN_STORE.with(|store| {
        store.borrow().get(&caller).map(|s| s.token.clone())
    })
}

#[update]
pub async fn get_google_calendars_for_user() -> Result<Vec<GoogleCalendar>, String> {
    let caller = ic_cdk::api::caller();
    let token = GOOGLE_TOKEN_STORE.with(|store| {
        store.borrow().get(&caller).map(|s| s.token.clone())
    }).ok_or("No token for user. Authenticate first.")?;

    validate_token_response(&token)?;
    get_google_calendars_with_token(&token.access_token).await
}

#[update]
pub async fn poll_and_emit_new_events() -> Result<(), String> {
    let user_tokens = GOOGLE_TOKEN_STORE.with(|store| store.borrow().clone());

    for (user, mut user_state) in user_tokens {
        let token = &user_state.token;

        let calendars = match get_google_calendars_with_token(&token.access_token).await {
            Ok(cals) => cals,
            Err(e) => {
                ic_cdk::println!("Error fetching calendars for user {:?}: {}", user, e);
                continue;
            }
        };

        for cal in calendars {
            let since = user_state.last_event_timestamp.clone();
            let events = match get_calendar_events(&token.access_token, &cal.id, since.clone()).await {
                Ok(ev) => ev,
                Err(e) => {
                    ic_cdk::println!("Error fetching events for calendar {}: {}", cal.id, e);
                    continue;
                }
            };

            for event in &events {
                let event_time = event.start.as_ref()
                    .and_then(|dt| dt.date_time.clone())
                    .or_else(|| event.start.as_ref().and_then(|dt| dt.date.clone()));

                if let (Some(event_time), Some(last_time)) = (event_time.clone(), since.clone()) {
                    if event_time <= last_time {
                        continue; // Not a new event
                    }
                }

                let event_metadata = serde_json::to_string(&event).unwrap_or_else(|_| "{}".to_string());

                ic_cdk::spawn(trigger_workflow_for_event(user, cal.id.clone(), event_metadata));
            }

            let latest_time = events.iter()
                .filter_map(|e| e.start.as_ref()
                    .and_then(|dt| dt.date_time.clone())
                    .or_else(|| e.start.as_ref().and_then(|dt| dt.date.clone())))
                .max();

            if let Some(latest) = latest_time {
                GOOGLE_TOKEN_STORE.with(|store| {
                    if let Some(state) = store.borrow_mut().get_mut(&user) {
                        state.last_event_timestamp = Some(latest);
                    }
                });
            }
        }
    }
    Ok(())
}

async fn trigger_workflow_for_event(user: Principal, calendar_id: String, event_metadata: String) {
    let workflow_engine_principal: Principal = "rrkah-fqaaa-aaaaa-aaaaq-cai".parse().unwrap();

    match call::<(Principal, String, String), ()>(
        workflow_engine_principal,
        "trigger_event",
        (user, calendar_id, event_metadata)
    ).await {
        Ok(_) => ic_cdk::println!("Triggered workflow for user {:?}", user),
        Err(e) => ic_cdk::println!("Failed to trigger workflow for user {:?}: {:?}", user, e),
    }
}

// ---------- Existing helper functions ----------

pub async fn exchange_google_code(code: String) -> Result<GoogleTokenResponse, String> {
    if code.is_empty() {
        return Err("Empty authorization code".to_string());
    }
    use urlencoding::encode;

    let body = format!(
        "code={}&client_id={}&client_secret={}&redirect_uri={}&grant_type=authorization_code",
        encode(&code),
        encode(GOOGLE_CLIENT_ID),
        encode(GOOGLE_CLIENT_SECRET),
        encode(REDIRECT_URI)
    );

    let request = CanisterHttpRequestArgument {
        url: GOOGLE_TOKEN_URL.to_string(),
        method: HttpMethod::POST,
        headers: vec![
            HttpHeader {
                name: "Content-Type".to_string(),
                value: "application/x-www-form-urlencoded".to_string(),
            },
            HttpHeader {
                name: "Accept".to_string(),
                value: "application/json".to_string(),
            },
        ],
        body: Some(body.into_bytes()),
        max_response_bytes: MAX_RESPONSE_BYTES,
        transform: None,
    };

    let (response,) = ic_cdk::api::management_canister::http_request::http_request(request, CYCLES)
        .await
        .map_err(|e| format!("HTTPS outcall failed: {:?}", e))?;

    if response.status != Nat::from(200u32) {
        let error_body = String::from_utf8_lossy(&response.body);
        return Err(format!("Token exchange failed ({}):  {}", response.status, error_body));
    }

    let token_response: GoogleTokenResponse = serde_json::from_slice(&response.body)
        .map_err(|e| {
            let body_str = String::from_utf8_lossy(&response.body);
            format!("Failed to parse token response: {:?}. Body: {}", e, body_str)
        })?;
    validate_token_response(&token_response)?;
    Ok(token_response)
}

pub async fn get_google_calendars_with_token(access_token: &str) -> Result<Vec<GoogleCalendar>, String> {
    let request = CanisterHttpRequestArgument {
        url: GOOGLE_CALENDAR_API.to_string(),
        method: HttpMethod::GET,
        headers: vec![
            HttpHeader {
                name: "Authorization".to_string(),
                value: format!("Bearer {}", access_token),
            },
        ],
        body: None,
        max_response_bytes: MAX_RESPONSE_BYTES,
        transform: None,
    };

    let (response,) = ic_cdk::api::management_canister::http_request::http_request(request, CYCLES)
        .await
        .map_err(|e| format!("Failed to fetch calendars: {:?}", e))?;

    if response.status != Nat::from(200u32) {
        return Err(format!("Calendar API error: {}", String::from_utf8_lossy(&response.body)));
    }

    #[derive(Deserialize)]
    struct CalendarList {
        items: Vec<GoogleCalendar>,
    }

    let calendars: CalendarList = serde_json::from_slice(&response.body)
        .map_err(|e| format!("Failed to parse calendar response: {:?}", e))?;

    Ok(calendars.items)
}

pub async fn get_calendar_events(access_token: &str, calendar_id: &str, time_min: Option<String>) -> Result<Vec<GoogleCalendarEvent>, String> {
    let mut url = format!(
        "https://www.googleapis.com/calendar/v3/calendars/{}/events",
        urlencoding::encode(calendar_id)
    );
    if let Some(t) = time_min {
        url.push_str(&format!("?timeMin={}", urlencoding::encode(&t)));
    }

    let request = CanisterHttpRequestArgument {
        url,
        method: HttpMethod::GET,
        headers: vec![
            HttpHeader {
                name: "Authorization".to_string(),
                value: format!("Bearer {}", access_token),
            },
        ],
        body: None,
        max_response_bytes: MAX_RESPONSE_BYTES,
        transform: None,
    };

    let (response,) = ic_cdk::api::management_canister::http_request::http_request(request, CYCLES)
        .await
        .map_err(|e| format!("Failed to fetch calendar events: {:?}", e))?;

    if response.status != Nat::from(200u32) {
        return Err(format!("Calendar Events API error: {}", String::from_utf8_lossy(&response.body)));
    }

    #[derive(Deserialize)]
    struct EventList { items: Vec<GoogleCalendarEvent> }

    let events: EventList = serde_json::from_slice(&response.body)
        .map_err(|e| format!("Failed to parse events response: {:?}", e))?;

    Ok(events.items)
}

fn validate_token_response(token: &GoogleTokenResponse) -> Result<(), String> {
    if token.access_token.is_empty() {
        return Err("Empty access token".to_string());
    }
    if token.token_type.is_empty() {
        return Err("Empty token type".to_string());
    }
    if token.expires_in == Nat::from(0u32) {
        return Err("Invalid expiration time".to_string());
    }
    Ok(())
}
