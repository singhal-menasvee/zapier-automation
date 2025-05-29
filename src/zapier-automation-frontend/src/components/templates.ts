// templates.ts
export const templates = [
  {
    name: "Mint NFT on Transfer",
    description: "Mints an NFT when a token is transferred",
    trigger: { OnChainEvent: { event_type: "Transfer" } },
    actions: [
      {
        MintNft: {
          to: "__recipient__",
          metadata: "__meta__"
        }
      }
    ],
    conditions: []
  },
  {
    name: "Send Email on Transfer",
    description: "Sends an email when a token is transferred",
    trigger: { OnChainEvent: { event_type: "Transfer" } },
    actions: [
      {
        SendEmail: {
          to: "someone@example.com",
          subject: "Token Moved",
          body: "A token was just transferred."
        }
      }
    ],
    conditions: []
  }
];
