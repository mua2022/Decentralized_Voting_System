// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DecentralizedVoting is ReentrancyGuard {
    address public owner;
    bool public votingStarted;
    uint public votingEndTime;
    uint public totalVotes;
    uint public totalVoters;
    uint public totalCandidates;

    struct Candidate {
        string name;
        uint voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public voters;
    mapping(address => bool) public candidatesAddress;
    mapping(address => bool) public admins;

    event Voted(address indexed voter, uint indexed candidateId);
    event VotingStarted(uint indexed votingStartTime);
    event VotingEnded(uint indexed votingEndTime);
    event CandidateAdded(address indexed candidateAddress, string indexed candidateName);
    event VoterAdded(address indexed voterAddress);
    event AdminAdded(address indexed adminAddress);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin can call this function");
        _;
    }

    modifier onlyVoter() {
        require(voters[msg.sender], "Only voter can call this function");
        _;
    }

    modifier votingOpen() {
        require(votingStarted, "Voting has not started");
        require(block.timestamp < votingEndTime, "Voting period has ended");
        _;
    }

    modifier votingClosed() {
        require(votingStarted, "Voting has not started");
        require(block.timestamp >= votingEndTime, "Voting period has not ended");
        _;
    }

    constructor() {
        owner = msg.sender;
        admins[owner] = true; // Owner is also an admin by default
    }

    function addCandidate(address _candidateAddress, string memory _candidateName) public onlyAdmin {
        require(!votingStarted, "Voting has already started");
        require(!candidatesAddress[_candidateAddress], "Candidate already exists");

        candidates.push(Candidate(_candidateName, 0));
        candidatesAddress[_candidateAddress] = true;
        totalCandidates++;

        emit CandidateAdded(_candidateAddress, _candidateName);
    }

    function startVoting(uint _votingDuration) public onlyOwner {
        require(!votingStarted, "Voting has already started");

        votingStarted = true;
        votingEndTime = block.timestamp + _votingDuration;

        emit VotingStarted(block.timestamp);
    }

    function endVoting() public onlyOwner votingClosed {
        votingStarted = false;
        emit VotingEnded(block.timestamp);
    }

    function addVoter(address _voterAddress) public onlyAdmin {
        require(!votingStarted, "Voting has already started");
        require(!voters[_voterAddress], "Voter already exists");

        voters[_voterAddress] = true;
        totalVoters++;

        emit VoterAdded(_voterAddress);
    }

    function addAdmin(address _adminAddress) public onlyOwner {
        require(!admins[_adminAddress], "Admin already exists");

        admins[_adminAddress] = true;
        emit AdminAdded(_adminAddress);
    }

    function vote(uint _candidateId) public onlyVoter votingOpen nonReentrant {
        require(_candidateId < candidates.length, "Invalid candidate ID");

        // Mark the voter as having voted
        voters[msg.sender] = false; // Prevent double voting

        // Update candidate's vote count
        candidates[_candidateId].voteCount++;
        totalVotes++;

        emit Voted(msg.sender, _candidateId);
    }

    function getVotingTime() public view returns (uint startTime, uint endTime) {
        return (votingStarted ? block.timestamp : 0, votingEndTime);
    }

    function getVotingResult() public view returns (uint votes, uint votersCount, uint candidatesCount) {
        return (totalVotes, totalVoters, totalCandidates);
    }

    function getCandidateResult(uint _candidateId) public view returns (string memory name, uint voteCount) {
        require(_candidateId < candidates.length, "Invalid candidate ID");
        return (candidates[_candidateId].name, candidates[_candidateId].voteCount);
    }

    function getVoterStatus(address _voterAddress) public view returns (bool) {
        return voters[_voterAddress];
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVotingStatus() public view returns (string memory) {
        if (!votingStarted) {
            return "Voting has not started";
        } else if (block.timestamp >= votingEndTime) {
            return "Voting has ended";
        } else {
            return "Voting is ongoing";
        }
    }
}