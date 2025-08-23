// src/zapier_automation_backend/src/lib.rs
use crate::core::lib::{WorkflowInput, Workflow, WorkflowLog, WorkflowStatus};
use crate::adapters::web2;
pub mod adapters;
pub mod api;
pub mod core; 

// Re-export types so frontends generated candid bindings can see them
pub use crate::adapters::web2::{
    GoogleAuthUrlResponse, GoogleTokenResponse, GoogleCalendar, GoogleGmailProfile,
};
pub use crate::api::*;

// Export candid interface for the canister
use candid::export_service;

#[ic_cdk::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}
