use reqwest::blocking::Client;
use std::error::Error;

pub fn http_request(url: &str) -> Result<String, Box<dyn Error>> {
    let client = Client::new();
    let response = client.get(url).send()?.text()?;
    Ok(response)
}