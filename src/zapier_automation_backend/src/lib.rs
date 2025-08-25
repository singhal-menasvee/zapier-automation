pub mod adapters;
pub mod core;

pub use crate::core::lib::*;
pub use crate::adapters::web2::{GoogleTokenResponse, GoogleCalendar};
pub use crate::adapters::web2;



#[ic_cdk::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    use candid::export_service;
    export_service!();
    __export_service()
}
