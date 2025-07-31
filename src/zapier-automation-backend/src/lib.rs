use candid::Principal;
use ic_cdk::api;

pub mod adapters {
    pub mod web2;
    pub mod web3;
}

pub mod core {
    pub mod lib;
    pub mod types;
}

// Re-export public interface
pub use crate::core::lib::*;
pub use crate::adapters::web2::{GoogleTokenResponse, GoogleCalendar};

#[ic_cdk::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    use candid::export_service;  // Import inside function
    export_service!();
    __export_service()
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn generate_did_file() {
        use candid::export_service;
        export_service!();
        std::fs::write("zapier_automation_backend.did", __export_service()).unwrap();
    }
}