import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { connectWallet } from "./utils/wallet";
import contractABI from "./contracts/DecentralizedVoting.json";

const contractAddress = "0x8a6A8F395B18D06E16d2FF7d0484c8e9821EF79f";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const votingContract = new Contract(contractAddress, contractABI.abi, signer);
        setContract(votingContract);

        // Load candidates
        const candidateCount = Number(await votingContract.totalCandidates());
        const candidatesList = [];
        for (let i = 0; i < candidateCount; i++) {
          const candidate = await votingContract.getCandidateResult(i);
          candidatesList.push({
            name: candidate.name,
            voteCount: candidate.voteCount.toString(), // Convert BigInt to string
          });
        }
        setCandidates(candidatesList);
      }
    };

    init();
  }, [walletAddress]);

  const handleConnectWallet = async () => {
    const address = await connectWallet();
    if (address) {
      setWalletAddress(address);
    }
  };

  const vote = async (candidateId) => {
    if (contract) {
      try {
        const tx = await contract.vote(candidateId);
        await tx.wait(); // Wait for transaction confirmation
        alert("Vote cast successfully!");
      } catch (error) {
        console.error("Voting failed:", error);
      }
    }
  };

  return (
    <div>
      <h1>Decentralized Voting DApp</h1>
      {walletAddress ? (
        <p>Connected Wallet: {walletAddress}</p>
      ) : (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      )}

      <h2>Candidates</h2>
      <ul>
        {candidates.map((candidate, index) => (
          <li key={index}>
            {candidate.name} - Votes: {candidate.voteCount}
            <button onClick={() => vote(index)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
