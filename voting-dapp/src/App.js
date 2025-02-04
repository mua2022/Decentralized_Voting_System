import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { Button } from "./components/ui/button"; // ShadCN UI button
import { Card, CardContent } from "./components/ui/card"; // ShadCN card component
import { connectWallet } from "./utils/wallet"; // Utility for connecting wallet
import contractABI from "./contracts/DecentralizedVoting.json";

const contractAddress = "0x8a6A8F395B18D06E16d2FF7d0484c8e9821EF79f";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
        const tx = await contract.vote(candidateId);
        await tx.wait(); // Wait for transaction confirmation
        alert("Vote cast successfully!");
        setLoading(false);
      } catch (error) {
        console.error("Voting failed:", error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Header */}
      <header className="w-full max-w-4xl bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">MUA | VOTING DAPP</h1>
        {walletAddress ? (
          <p className="text-green-600 font-medium">Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
        ) : (
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        )}
      </header>

      {/* Candidates List */}
      <section className="w-full max-w-4xl mt-6">
        <h2 className="text-xl font-semibold mb-4">Candidates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidates.length === 0 ? (
            <p className="text-gray-600">Loading candidates...</p>
          ) : (
            candidates.map((candidate, index) => (
              <Card key={index} className="p-4">
                <CardContent className="flex flex-col">
                  <h3 className="text-lg font-semibold">{candidate.name}</h3>
                  <p className="text-gray-600">Votes: {candidate.voteCount}</p>
                  <Button 
                    className="mt-3 bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => vote(index)}
                    disabled={loading}
                  >
                    {loading ? "Voting..." : "Vote"}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
