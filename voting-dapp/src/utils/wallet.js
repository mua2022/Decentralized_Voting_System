export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        return accounts[0]; // Return the connected wallet address
      } catch (error) {
        console.error("Error connecting wallet:", error);
        return null;
      }
    } else {
      alert("Please install MetaMask!");
      return null;
    }
  };