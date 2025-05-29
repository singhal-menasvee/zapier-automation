import React, { useState } from "react";

export default function TemplateSection({ onCreateWorkflow }) {
  const [nftWorkflow, setNftWorkflow] = useState({
    name: "",
    actionType: "Mint NFT",
    toPrincipal: "",
    metadata: "",
  });

  const handleNftCreate = () => {
    onCreateWorkflow(nftWorkflow);
    setNftWorkflow({ name: "", actionType: "Mint NFT", toPrincipal: "", metadata: "" });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans p-6">
      <h1 className="text-3xl font-bold mb-6">Workflow Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Start from a Template</h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Template 1: Mint NFT on Transfer */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-2">Mint NFT on Transfer</h3>
            <p className="text-gray-300 mb-4">
              Mints an NFT when a token is transferred
            </p>

            <input
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
              placeholder="Workflow name"
              value={nftWorkflow.name}
              onChange={(e) =>
                setNftWorkflow({ ...nftWorkflow, name: e.target.value })
              }
            />

            <select
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
              value={nftWorkflow.actionType}
              disabled
            >
              <option>Mint NFT</option>
            </select>

            <input
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
              placeholder="Principal to receive NFT"
              value={nftWorkflow.toPrincipal}
              onChange={(e) =>
                setNftWorkflow({ ...nftWorkflow, toPrincipal: e.target.value })
              }
            />

            <textarea
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              placeholder='NFT metadata (JSON string)'
              value={nftWorkflow.metadata}
              onChange={(e) =>
                setNftWorkflow({ ...nftWorkflow, metadata: e.target.value })
              }
            />

            <button
              onClick={handleNftCreate}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
            >
              Create Workflow
            </button>
          </div>

          {/* Template 2: Send Email on Transfer */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-2">Send Email on Transfer</h3>
            <p className="text-gray-300 mb-4">
              Sends an email when a token is transferred
            </p>

            {/* Placeholder fields — implement as needed */}
            <input
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
              placeholder="Email recipient"
              disabled
            />
            <textarea
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              placeholder="Email content"
              disabled
            />

            <button
              disabled
              className="bg-gray-600 px-4 py-2 rounded text-white cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
