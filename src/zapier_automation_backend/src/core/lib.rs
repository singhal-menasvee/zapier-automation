use candid::{CandidType, Deserialize};
use ic_cdk::{caller, api::time};
use std::cell::RefCell;
use std::collections::HashMap;
use std::time::Duration;
use crate::adapters::web2;

// Explicit Result type for Candid compatibility
use std::result::Result;

const GOOGLE_CLIENT_ID: &str = "548274771061-rpqt1l6i19hucmpar07nis5obr5shm0j.apps.googleusercontent.com";
const REDIRECT_URI: &str = "http://localhost:3000/OAuth2Callback";

thread_local! {
    static GOOGLE_TOKENS: RefCell<HashMap<String, web2::GoogleTokenResponse>> = RefCell::new(HashMap::new());
}
thread_local! {
    static WORKFLOW_INPUTS: std::cell::RefCell<HashMap<String, String>> = std::cell::RefCell::new(HashMap::new());
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum Trigger {
    ContractEvent {
        contract_address: String,
        event_name: String,
        poll_interval_sec: u64,
    },
    HttpRequest {
        url: String,
        method: String,
    },
    TimeBased {
        cron: String,
    },
    GoogleCalendar {
        calendar_id: String,
        event_type: String,
    },
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum Action {
    SendHttpRequest {
        url: String,
        method: String,
        body: String,
    },
    NotifyUser {
        user_id: String,
        message: String,
    },
    ExecuteContractMethod {
        contract_address: String,
        method: String,
        args: Vec<String>,
    },
    MintNft {
        to_principal: String,
        metadata: String,
    },
    UpdateCanisterState {
        canister_id: String,
        state_key: String,
        state_value: String,
    },
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct Condition {
    pub field: String,
    pub operator: String,
    pub value: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum WorkflowStatus {
    Active,
    Paused,
    Disabled,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct Workflow {
    pub id: String,
    pub name: String,
    pub trigger: Trigger,
    pub actions: Vec<Action>,
    pub conditions: Option<Vec<Condition>>,
    pub status: WorkflowStatus,
    pub owner: String,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct WorkflowInput {
    pub name: String,
    pub trigger: Trigger,
    pub actions: Vec<Action>,
    pub conditions: Option<Vec<Condition>>,
}

thread_local! {
    static WORKFLOW_STORE: RefCell<HashMap<String, Workflow>> = RefCell::new(HashMap::new());
}

thread_local! {
    static WORKFLOW_LOGS: RefCell<HashMap<String, Vec<WorkflowLog>>> = RefCell::new(HashMap::new());
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct WorkflowLog {
    pub timestamp: u64,
    pub message: String,
}

pub fn generate_id() -> String {
    format!("{}-{}", time(), caller().to_text())
}

#[ic_cdk::update]
pub fn create_workflow(input: WorkflowInput) -> String {
    let id = generate_id();
    let now = time();

    let workflow = Workflow {
        id: id.clone(),
        name: input.name,
        trigger: input.trigger,
        actions: input.actions,
        conditions: input.conditions,
        status: WorkflowStatus::Active,
        owner: caller().to_text(),
        created_at: now,
        updated_at: now,
    };

    WORKFLOW_STORE.with(|store| {
        store.borrow_mut().insert(id.clone(), workflow);
    });

    id
}

#[ic_cdk::query]
pub fn list_workflows() -> Vec<Workflow> {
    WORKFLOW_STORE.with(|store| store.borrow().values().cloned().collect())
}

#[ic_cdk::query]
pub fn get_workflow(id: String) -> Option<Workflow> {
    WORKFLOW_STORE.with(|store| store.borrow().get(&id).cloned())
}

#[ic_cdk::update]
pub fn update_workflow_status(id: String, status: WorkflowStatus) -> Result<(), String> {
    WORKFLOW_STORE.with(|store| {
        let mut store = store.borrow_mut();
        if let Some(workflow) = store.get_mut(&id) {
            if workflow.owner != caller().to_text() {
                return Err("Not authorized".to_string());
            }
            workflow.status = status;
            workflow.updated_at = time();
            Ok(())
        } else {
            Err("Workflow not found".to_string())
        }
    })
}

#[ic_cdk::update]
pub fn delete_workflow(id: String) -> Result<(), String> {
    WORKFLOW_STORE.with(|store| {
        let mut store = store.borrow_mut();
        if let Some(workflow) = store.get(&id) {
            if workflow.owner != caller().to_text() {
                return Err("Not authorized".to_string());
            }
            store.remove(&id);
            Ok(())
        } else {
            Err("Workflow not found".to_string())
        }
    })
}

#[ic_cdk::update]
pub fn log_workflow_event(workflow_id: String, message: String) {
    let log = WorkflowLog {
        timestamp: time(),
        message,
    };

    WORKFLOW_LOGS.with(|logs| {
        logs.borrow_mut()
            .entry(workflow_id)
            .or_insert_with(Vec::new)
            .push(log);
    });
}

#[ic_cdk::query]
pub fn get_workflow_logs(workflow_id: String) -> Vec<WorkflowLog> {
    WORKFLOW_LOGS.with(|logs| {
        logs.borrow()
            .get(&workflow_id)
            .cloned()
            .unwrap_or_default()
    })
}

#[ic_cdk::update]
pub fn execute_workflow(id: String) -> Result<(), String> {
    WORKFLOW_STORE.with(|store| {
        let mut store = store.borrow_mut();
        if let Some(workflow) = store.get_mut(&id) {
            ic_cdk::print(format!("Executing workflow: {}", workflow.name));

            match &workflow.trigger {
                Trigger::TimeBased { cron } => {
                    ic_cdk::print(format!("Triggering workflow at schedule: {}", cron));
                }
                Trigger::HttpRequest { url, method } => {
                    ic_cdk::print(format!("Triggering workflow via HTTP request: {} {}", method, url));
                }
                Trigger::ContractEvent {
                    contract_address,
                    event_name,
                    poll_interval_sec,
                } => {
                    ic_cdk::print(format!(
                        "Triggering workflow for contract {} event '{}' every {} seconds",
                        contract_address, event_name, poll_interval_sec
                    ));
                }
                Trigger::GoogleCalendar { calendar_id, event_type } => {
                    ic_cdk::print(format!(
                        "Triggering workflow for Google Calendar {} event type '{}'",
                        calendar_id, event_type
                    ));
                }
            }

            for action in &workflow.actions {
                match action {
                    Action::NotifyUser { user_id, message } => {
                        ic_cdk::print(format!("Sending notification to {}: {}", user_id, message));
                    }
                    Action::SendHttpRequest { url, method, body } => {
                        ic_cdk::print(format!("Sending request to {} via {} with body {}", url, method, body));
                    }
                    Action::ExecuteContractMethod { contract_address, method, args } => {
                        ic_cdk::print(format!(
                            "Executing contract method '{}' on {} with args {:?}",
                            method, contract_address, args
                        ));
                    }
                    Action::MintNft { to_principal, metadata } => {
                        ic_cdk::print(format!("Minting NFT to {} with metadata: {}", to_principal, metadata));
                    }
                    Action::UpdateCanisterState { canister_id, state_key, state_value } => {
                        ic_cdk::print(format!("Updating canister {} state: {} = {}", canister_id, state_key, state_value));
                    }
                }
            }

            log_workflow_event(id.clone(), format!("Workflow '{}' executed successfully", workflow.name));
            Ok(())
        } else {
            Err("Workflow not found".to_string())
        }
    })
}

#[ic_cdk::update]
pub fn execute_workflow_with_payload(workflow_id: String, payload: String) -> Result<(), String> {
    WORKFLOW_INPUTS.with(|inputs| {
        inputs.borrow_mut().insert(workflow_id.clone(), payload.clone());
    });

    execute_workflow(workflow_id)
}

#[ic_cdk::update]
pub fn run_scheduled_workflows() {
    WORKFLOW_STORE.with(|store| {
        let store = store.borrow();

        for workflow in store.values() {
            if let Trigger::TimeBased { cron } = &workflow.trigger {
                ic_cdk::print(format!("Checking scheduled workflow: {} at {}", workflow.name, cron));
                let id = workflow.id.clone();
                execute_workflow(id).ok();
            }

            if let Trigger::ContractEvent { contract_address, event_name, poll_interval_sec } = &workflow.trigger {
                ic_cdk::print(format!("Polling event '{}' on {} every {}s", event_name, contract_address, poll_interval_sec));
            }
        }
    });
}

#[ic_cdk::update]
pub async fn exchange_google_code_flat(code: String, state: String) -> web2::GoogleTokenResponse {
    exchange_google_code_v2(code, state).await.expect("Failed to exchange code")
}

// ... [previous code remains the same until line 310] ...

#[ic_cdk::update]
#[candid::candid_method(update)]
pub async fn exchange_google_code_v2(code: String, state: String) -> Result<web2::GoogleTokenResponse, String> {
    let token_response = web2::exchange_google_code(code.clone()).await
        .map_err(|e| format!("Failed to exchange code: {}", e))?;
    
    // Store the token
    GOOGLE_TOKENS.with(|tokens| {
        tokens.borrow_mut().insert(state, token_response.clone());
    });
    
    Ok(token_response)
}

#[ic_cdk::query]
#[candid::candid_method(query)]
pub fn has_google_token(state: String) -> bool {
    GOOGLE_TOKENS.with(|tokens| tokens.borrow().contains_key(&state))
}

#[ic_cdk::update]
#[candid::candid_method(update)]
pub async fn get_google_calendars(state: String) -> Result<Vec<web2::GoogleCalendar>, String> {
    let token = GOOGLE_TOKENS.with(|tokens| tokens.borrow().get(&state).cloned())
        .ok_or("No Google token found. Please authenticate first.")?;

    web2::get_google_calendars_with_token(&token.access_token).await
}

#[ic_cdk::query]
#[candid::candid_method(query)]
pub fn get_google_auth_url(state: String) -> String {
    let scope = "https://www.googleapis.com/auth/calendar.readonly";
    format!(
        "https://accounts.google.com/o/oauth2/v2/auth?client_id={}&redirect_uri={}&response_type=code&scope={}&access_type=offline&state={}&prompt=consent",
        GOOGLE_CLIENT_ID, REDIRECT_URI, scope, state
    )
}

#[ic_cdk::init]
pub fn schedule_recurring_execution() {
    ic_cdk_timers::set_timer_interval(Duration::from_secs(600), || {
        run_scheduled_workflows();
    });
}

#[ic_cdk_macros::query]
fn get_workflow_input(workflow_id: String) -> Option<String> {
    WORKFLOW_INPUTS.with(|inputs| inputs.borrow().get(&workflow_id).cloned())
}

pub use crate::adapters::web2::{GoogleTokenResponse, GoogleCalendar};