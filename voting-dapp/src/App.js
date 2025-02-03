import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { connectWallet } from "./utils/wallet";
import contractABI from "././contracts/DecentralizedVoting.json"; 

const contractAddress = "0x8a6A8F395B18D06E16d2FF7d0484c8e9821EF79f"; 

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const votingContract = new ethers.Contract(contractAddress, contractABI.abi, signer);
        setContract(votingContract);

        // Load candidates
        const candidateCount = await votingContract.totalCandidates();
        const candidates = [];
        for (let i = 0; i < candidateCount; i++) {
          const candidate = await votingContract.getCandidateResult(i);
          candidates.push(candidate);
        }
        setCandidates(candidates);
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
      await contract.vote(candidateId);
      alert("Vote cast successfully!");
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
            {candidate.name} - Votes: {candidate.voteCount.toString()}
            <button onClick={() => vote(index)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;