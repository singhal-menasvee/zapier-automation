// import { HttpAgent, Actor } from "@dfinity/agent";
// import type { IDL } from "@dfinity/candid";


// import { idlFactory as zapierAutomationBackendIDL } from "../declarations/zapier-automation-backend/zapier-automation-backend.did.js";


// if (!zapierAutomationBackendID) {
//   console.error("zapierAutomationBackendID is undefined! Check DFX_NETWORK and dfx deploy.");
  
// }


// const agent = new HttpAgent({ host: "http://127.0.0.1:8000" });

// // Only fetch root key in development for local replica, not production
// // This is good practice.
// if (process.env.NODE_ENV === "development" || process.env.DFX_NETWORK === "local") {
//   agent.fetchRootKey().catch(e => {
//     console.warn("Unable to fetch root key. Check if dfx start is running.");
//     console.error(e);
//   });
// }

// export const zapierAutomationBackend = Actor.createActor(
//   zapierAutomationBackendIDL as IDL.InterfaceFactory,
//   {
//     agent,
//     canisterId: zapierAutomationBackendID,
//   }
// );