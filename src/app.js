import React, { useState, useEffect } from "react";
import { sepoliaContract, liskSepoliaContract } from "./contract";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [votingStatus, setVotingStatus] = useState("");
  const [network, setNetwork] = useState("sepolia"); // Default to Sepolia

  const contract = network === "sepolia" ? sepoliaContract : liskSepoliaContract;

  useEffect(() => {
    loadCandidates();
    loadVotingStatus();
  }, [network]);

  const loadCandidates = async () => {
    const count = await contract.totalCandidates();
    const candidates = [];
    for (let i = 0; i < count; i++) {
      const candidate = await contract.getCandidateResult(i);
      candidates.push(candidate);
    }
    setCandidates(candidates);
  };

  const loadVotingStatus = async () => {
    const status = await contract.getVotingStatus();
    setVotingStatus(status);
  };

  const vote = async (candidateId) => {
    await contract.vote(candidateId);
    alert("Vote cast successfully!");
    loadCandidates();
  };

  const switchNetwork = async (newNetwork) => {
    setNetwork(newNetwork);
  };

  return (
    <div>
      <h1>Decentralized Voting DApp</h1>
      <p>Voting Status: {votingStatus}</p>
      <button onClick={() => switchNetwork("sepolia")}>Switch to Sepolia</button>
      <button onClick={() => switchNetwork("liskSepolia")}>Switch to Lisk Sepolia</button>
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