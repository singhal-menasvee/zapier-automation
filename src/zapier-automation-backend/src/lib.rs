use candid::{CandidType, Deserialize};
use ic_cdk::caller;
use std::cell::RefCell;
use std::collections::HashMap;

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

// Use HashMap for better lookup performance
thread_local! {
    static WORKFLOW_STORE: RefCell<HashMap<String, Workflow>> = RefCell::new(HashMap::new());
}

// Helper function to generate a unique ID
fn generate_id() -> String {
    use ic_cdk::api::time;
    format!("{}-{}", time(), caller().to_text())
}

#[ic_cdk::update]
fn create_workflow(input: WorkflowInput) -> String {
    let id = generate_id();
    let now = ic_cdk::api::time();
    
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
fn list_workflows() -> Vec<Workflow> {
    WORKFLOW_STORE.with(|store| {
        store.borrow().values().cloned().collect()
    })
}

#[ic_cdk::query]
fn get_workflow(id: String) -> Option<Workflow> {
    WORKFLOW_STORE.with(|store| {
        store.borrow().get(&id).cloned()
    })
}

#[ic_cdk::update]
fn update_workflow_status(id: String, status: WorkflowStatus) -> Result<(), String> {
    WORKFLOW_STORE.with(|store| {
        let mut store = store.borrow_mut();
        if let Some(workflow) = store.get_mut(&id) {
            // Check if caller is the owner
            if workflow.owner != caller().to_text() {
                return Err("Not authorized".to_string());
            }
            workflow.status = status;
            workflow.updated_at = ic_cdk::api::time();
            Ok(())
        } else {
            Err("Workflow not found".to_string())
        }
    })
}

#[ic_cdk::update]
fn delete_workflow(id: String) -> Result<(), String> {
    WORKFLOW_STORE.with(|store| {
        let mut store = store.borrow_mut();
        if let Some(workflow) = store.get(&id) {
            // Check if caller is the owner
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