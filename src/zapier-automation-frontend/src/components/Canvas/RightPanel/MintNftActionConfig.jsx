import React, { useState, useEffect } from 'react';

const MintNftActionConfig = ({ nodeId, initialConfig, onConfigChange }) => {
  const [recipientAddress, setRecipientAddress] = useState(initialConfig?.recipientAddress || '');
  const [tokenUri, setTokenUri] = useState(initialConfig?.tokenUri || '');
  const [tokenId, setTokenId] = useState(initialConfig?.tokenId || ''); // Optional, if NFT contract allows specific token IDs
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  useEffect(() => {
    // Call onConfigChange whenever local state changes
    if (onConfigChange) {
      onConfigChange({
        recipientAddress,
        tokenUri,
        tokenId,
      });
    }
  }, [recipientAddress, tokenUri, tokenId, onConfigChange]);

  const handleConnectWallet = () => {
    setIsConnectingWallet(true);
    // In a real application, this would trigger a wallet connection (e.g., MetaMask, Plug Wallet)
    // and then interaction with an ERC-721 contract.
    console.log("Initiating wallet connection for NFT minting...");

    // Simulate a connection attempt
    setTimeout(() => {
      setIsConnectingWallet(false);
      alert("Wallet connection process initiated. Please confirm in your wallet."); // Use a Bootstrap modal later
    }, 2000);
  };

  return (
    <div className="card bg-secondary text-white p-3 mb-3 border border-dark rounded">
      <div className="card-body">
        <h4 className="card-title h5 fw-semibold mb-3">Mint NFT Action Settings</h4>

        <div className="mb-3">
          <label htmlFor="nftRecipientAddress" className="form-label text-muted small mb-1">
            Recipient Ethereum Address:
          </label>
          <input
            type="text"
            id="nftRecipientAddress"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x..."
            className="form-control form-control-sm bg-dark text-white border-secondary"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tokenUri" className="form-label text-muted small mb-1">
            Token URI (Metadata URL):
          </label>
          <input
            type="url" // Use type="url" for URIs
            id="tokenUri"
            value={tokenUri}
            onChange={(e) => setTokenUri(e.target.value)}
            placeholder="https://example.com/nft/metadata/1"
            className="form-control form-control-sm bg-dark text-white border-secondary"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tokenId" className="form-label text-muted small mb-1">
            Token ID (Optional, if contract allows):
          </label>
          <input
            type="number"
            id="tokenId"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="e.g., 123"
            min="0"
            className="form-control form-control-sm bg-dark text-white border-secondary"
          />
        </div>

        <button
          onClick={handleConnectWallet}
          disabled={isConnectingWallet}
          className="btn btn-primary w-100 mt-3"
        >
          {isConnectingWallet ? 'Connecting Wallet...' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
};

export default MintNftActionConfig;
