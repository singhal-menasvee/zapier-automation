import React from "react";

export function Web3ActionConfig({ action, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...action, [field]: value });
  };

  switch (action.type) {
    case "MintNft":
      return (
        <div className="space-y-2">
          <label className="block">
            To Principal:
            <input
              type="text"
              value={action.to_principal || ""}
              onChange={(e) => handleChange("to_principal", e.target.value)}
              className="border p-2 w-full"
              placeholder="Principal to receive NFT"
            />
          </label>

          <label className="block">
            Metadata:
            <textarea
              value={action.metadata || ""}
              onChange={(e) => handleChange("metadata", e.target.value)}
              className="border p-2 w-full"
              placeholder="NFT metadata (JSON string)"
            />
          </label>
        </div>
      );

    // 🧩 Add more Web3 actions here in the future

    default:
      return <div className="text-gray-500">Unsupported Web3 action type</div>;
  }
}
