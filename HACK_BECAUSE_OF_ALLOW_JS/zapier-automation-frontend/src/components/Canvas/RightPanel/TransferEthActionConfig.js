import React, { useState, useEffect } from 'react';
const TransferEthActionConfig = ({ nodeId, initialConfig, onConfigChange }) => {
    const [recipientAddress, setRecipientAddress] = useState(initialConfig?.recipientAddress || '');
    const [amount, setAmount] = useState(initialConfig?.amount || '');
    const [gasLimit, setGasLimit] = useState(initialConfig?.gasLimit || '21000'); // Standard gas limit for simple ETH transfer
    const [isConnectingWallet, setIsConnectingWallet] = useState(false);
    useEffect(() => {
        // Call onConfigChange whenever local state changes
        if (onConfigChange) {
            onConfigChange({
                recipientAddress,
                amount,
                gasLimit,
            });
        }
    }, [recipientAddress, amount, gasLimit, onConfigChange]);
    const handleConnectWallet = () => {
        setIsConnectingWallet(true);
        // In a real application, this would trigger a wallet connection (e.g., MetaMask, Plug Wallet)
        // You would use a library like ethers.js or web3.js for this.
        console.log("Initiating wallet connection for ETH transfer...");
        // Simulate a connection attempt
        setTimeout(() => {
            setIsConnectingWallet(false);
            alert("Wallet connection process initiated. Please confirm in your wallet."); // Use a Bootstrap modal later
        }, 2000);
    };
    return (<div className="card bg-secondary text-white p-3 mb-3 border border-dark rounded">
      <div className="card-body">
        <h4 className="card-title h5 fw-semibold mb-3">Transfer ETH Action Settings</h4>

        <div className="mb-3">
          <label htmlFor="recipientAddress" className="form-label text-muted small mb-1">
            Recipient Ethereum Address:
          </label>
          <input type="text" id="recipientAddress" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} placeholder="0x..." className="form-control form-control-sm bg-dark text-white border-secondary"/>
        </div>

        <div className="mb-3">
          <label htmlFor="amount" className="form-label text-muted small mb-1">
            Amount (ETH):
          </label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.01" step="any" min="0" className="form-control form-control-sm bg-dark text-white border-secondary"/>
        </div>

        <div className="mb-3">
          <label htmlFor="gasLimit" className="form-label text-muted small mb-1">
            Gas Limit (Optional, default 21000):
          </label>
          <input type="number" id="gasLimit" value={gasLimit} onChange={(e) => setGasLimit(e.target.value)} placeholder="21000" min="0" className="form-control form-control-sm bg-dark text-white border-secondary"/>
        </div>

        <button onClick={handleConnectWallet} disabled={isConnectingWallet} className="btn btn-primary w-100 mt-3">
          {isConnectingWallet ? 'Connecting Wallet...' : 'Connect Wallet'}
        </button>
      </div>
    </div>);
};
export default TransferEthActionConfig;
