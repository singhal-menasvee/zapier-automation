
# 🔁DecentralFlow: Decentralized Automation Platform on ICP

Welcome to **Zapier-Automation**, a Web3-native alternative to platforms like Zapier or IFTTT , designed for **event-driven automation between smart contracts, web2 APIs, and personal apps**, powered entirely by the **Internet Computer (ICP)**.

## 🧠 What Is This Project?
Imagine connecting your smart contract, Google Calendar, and Telegram Bot to automate tasks like:

- If a new event is added in Google Calendar → call a smart contract method.
- If a contract emits an event → send a webhook to your app.
- If a timer triggers → mint an NFT or notify your Discord.

Traditional platforms like **Zapier** rely on centralized infrastructure and often don’t support **on-chain triggers or smart contract workflows**.  
**Zapier-Automation** is built **entirely on decentralized infrastructure** using **ICP canisters**, meaning:

- No central servers
- Real HTTPS outcalls from chain
- Fully composable workflows
- On-chain logic + off-chain API triggers

## 🏗️ Tech Stack

- 💻 **Frontend**: React + Figma
- 🔗 **Backend**: Rust Canisters via [dfx](https://internetcomputer.org/docs/current/developer-docs/cli-reference/dfx/)
- 🔐 **Auth**: NFID (Web3 Identity), Google OAuth2
- 🔁 **Triggers**: HTTP, Google Calendar, Smart Contract Events, Cron
- 📦 ICP Ecosystem: `@dfinity/agent`, `ic-cdk`, HTTPS outcalls

## 🚀 Getting Started (Fork & Run Locally)

Follow these steps to fork and run the project on your own machine:

### 1. Clone the Repo

```bash
git clone https://github.com/singhal-menasvee/zapier-automation.git
cd zapier-automation
```

### 2. Set Up the ICP Environment
You’ll need the DFINITY SDK (dfx) and Node.js installed.

Install DFX (Internet Computer SDK):
```bash
sh -ci "$(curl -fsSL https://smartcontracts.org/install.sh)"
```
   ℹ️ After installation, restart your terminal and run dfx --version to verify.

###  3. Install Frontend Dependencies
```bash
cd src/zapier-automation-frontend
npm install
```
  If you face any ERESOLVE errors, use:
```bash
npm install --legacy-peer-deps
```

### 4. Build Canisters (Rust Backend)
Go back to project root and run:
```bash
dfx start --background
dfx deploy
```
 This will:

 -Start the local Internet Computer replica

 -Deploy the Rust-based automation engine and event system

### 5. Start the React Frontend
```bash
cd src/zapier-automation-frontend
npm run dev
```
 The app will open on: http://localhost:3000

## 💡Examples
Here are some workflows you can create in the UI:
<img width="779" height="268" alt="image" src="https://github.com/user-attachments/assets/41c07d95-ed37-4566-90f0-cad90363e8ef" />


### 🙌 Credits
Built with 💙 by Manasvi Singhal, Dhruv pryag ,Shubh Pandey  Ramesh Kumar 
Inspired by the simplicity of Zapier, but reimagined for the decentralized future.

### ✨ Want to Contribute?
If you'd like to help improve trigger sources (Discord, Telegram, Slack, etc.), enhance UI, or add more chain support — open an issue or submit a PR!

                          🧡 Built on the Internet Computer (ICP) — fully on-chain, fully unstoppable.

