# Decentralized Voting System using Solidity

This project implements a decentralized voting system using Solidity, designed to ensure transparency, security, and immutability. The system runs on the Ethereum blockchain, allowing voters to cast their votes in a trustless and tamper-proof environment.

---

## Table of Contents
1. [Overview](#overview)
2. [System Flow](#system-flow)
3. [Smart Contract Design](#smart-contract-design)
4. [How It Works](#how-it-works)
5. [Installation and Usage](#installation-and-usage)
6. [Future Enhancements](#future-enhancements)
7. [License](#license)

---

## Overview

The decentralized voting system is built on the Ethereum blockchain using Solidity. It ensures:
- **Transparency**: All votes are recorded on the blockchain and can be publicly verified.
- **Security**: Votes are tamper-proof and immutable.
- **Anonymity**: Voters' identities are kept confidential.
- **Decentralization**: No single entity controls the voting process.

---

## System Flow

1. **Setup Phase**:
   - Deploy the smart contract to the blockchain.
   - Define voting parameters (e.g., candidates, voting duration, eligible voters).
   - Register voters by their Ethereum addresses.

2. **Voting Phase**:
   - Voters cast their votes by interacting with the smart contract.
   - Each vote is recorded on the blockchain.

3. **Tallying Phase**:
   - After the voting period ends, the votes are tallied.
   - Results are computed and made publicly available.

4. **Verification Phase**:
   - Anyone can verify the results by inspecting the blockchain.

---

## Smart Contract Design

The core of the system is a Solidity smart contract. Below are its key components:

### State Variables
- `candidates`: A list of candidates (e.g., their names or IDs).
- `votesReceived`: A mapping to store the number of votes each candidate receives.
- `voters`: A mapping to track whether an address has voted.
- `votingEndTime`: The timestamp when voting ends.

### Functions
- `addCandidate(string memory name)`: Allows the admin to add candidates (restricted to the contract owner).
- `vote(uint candidateId)`: Allows a voter to cast a vote for a candidate.
- `getVotes(uint candidateId)`: Returns the number of votes a candidate has received.
- `endVoting()`: Ends the voting process (restricted to the contract owner).

### Modifiers
- `onlyOwner`: Restricts certain functions to the contract owner.
- `votingOpen`: Ensures votes can only be cast during the voting period.

### Events
- `Voted(address voter, uint candidateId)`: Emitted when a vote is cast.
- `VotingEnded()`: Emitted when voting ends.

---

## How It Works

1. **Deploy the Contract**:
   - The contract is deployed to the Ethereum blockchain with a specified voting duration.

2. **Add Candidates**:
   - The contract owner adds candidates to the voting system.

3. **Cast Votes**:
   - Voters interact with the `vote` function to cast their votes.
   - Each vote is recorded on the blockchain, and the voter's address is marked as having voted.

4. **End Voting**:
   - The contract owner can manually end the voting process by calling the `endVoting` function.

5. **View Results**:
   - Anyone can call the `getVotes` function to view the number of votes each candidate has received.

---

## Installation and Usage

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Truffle](https://trufflesuite.com/)
- [Ganache](https://trufflesuite.com/ganache/) (for local testing)
- [MetaMask](https://metamask.io/) (for interacting with the blockchain)

### Steps
1. **Clone the repository**:
  - `git clone https://github.com/mua2022/decentralized-voting-system.git`
  - `cd decentralized-voting-system`
2. **Install dependencies**:
   `npm install`
3. **Compile the smart contract**:
  `truffle compile`
4. **Deploy the contract to a local blockchain (e.g., Ganache)**:
    `truffle migrate`
5. **Interact with the contract using Truffle Console or a frontend application**:
  `truffle console`
6. **Run tests**:
  `truffle test`
---
 ## Future Enhancements
 
 ### 1. Quadratic Voting:
  
  Implement quadratic voting to allow voters to express the intensity of their preferences.
  
### 2. Delegated Voting:
  
  Allow voters to delegate their votes to trusted representatives.
  
### 3. Multi-Chain Support:
  
  Extend the system to work on multiple blockchains for increased decentralization.
  
### 4. Identity Verification:

  Integrate with decentralized identity solutions (e.g., DID) to ensure only eligible voters can participate.
  
---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Contact

For any issues or compliments reach out to me [here](muaemmanuel2022@gmail.com)
