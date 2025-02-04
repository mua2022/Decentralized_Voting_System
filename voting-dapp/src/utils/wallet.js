import { BrowserProvider } from "ethers";

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer.address;
};
