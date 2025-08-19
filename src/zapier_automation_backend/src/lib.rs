pub mod adapters;
pub mod core;
pub mod api;

pub use crate::core::lib::*;
pub use crate::adapters::web2::{GoogleTokenResponse, GoogleCalendar};
pub use crate::adapters::web2;
pub use crate::api::AuthUrlResponse;  // <-- bring this type into scope

// Import candid macro
use candid::export_service;

#[ic_cdk::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();   // generates candid interface
    __export_service()
}
