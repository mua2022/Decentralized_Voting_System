const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentralizedVoting", function () {
    let VotingContract, voting, owner, admin, voter1, voter2, candidate1, candidate2;
    
    beforeEach(async function () {
        [owner, admin, voter1, voter2, candidate1, candidate2] = await ethers.getSigners();
        VotingContract = await ethers.getContractFactory("DecentralizedVoting");
        voting = await VotingContract.deploy();
    });
    
    it("Should set the deployer as owner and admin", async function () {
        expect(await voting.owner()).to.equal(owner.address);
        expect(await voting.admins(owner.address)).to.equal(true);
    });

    it("Should allow owner to add an admin", async function () {
        await voting.addAdmin(admin.address);
        expect(await voting.admins(admin.address)).to.equal(true);
    });

    it("Should allow admin to add a candidate", async function () {
        await voting.addAdmin(admin.address);
        await voting.connect(admin).addCandidate(candidate1.address, "Alice");
        const candidate = await voting.getCandidateResult(0);
        expect(candidate[0]).to.equal("Alice");
    });

    it("Should allow admin to add a voter", async function () {
        await voting.addAdmin(admin.address);
        await voting.connect(admin).addVoter(voter1.address);
        expect(await voting.getVoterStatus(voter1.address)).to.equal(true);
    });

    it("Should start voting successfully", async function () {
        await voting.startVoting(3600); // 1 hour voting duration
        // expect(await voting.getVotingStatus()).to.equal("Voting has not started");
        expect(await voting.getVotingStatus()).to.equal("Voting is ongoing");
    });

    it("Should allow a voter to vote and prevent double voting", async function () {
        await voting.addAdmin(admin.address);
        await voting.connect(admin).addCandidate(candidate1.address, "Alice");
        await voting.connect(admin).addVoter(voter1.address);
        await voting.startVoting(3600);
        await voting.connect(voter1).vote(0);

        const candidate = await voting.getCandidateResult(0);
        expect(candidate[1]).to.equal(1);
        expect(await voting.getVoterStatus(voter1.address)).to.equal(false);
    });

    it("Should prevent voting before start or after end", async function () {
        await voting.addAdmin(admin.address);
        await voting.connect(admin).addCandidate(candidate1.address, "Alice");
        await voting.connect(admin).addVoter(voter1.address);
        
        await expect(voting.connect(voter1).vote(0)).to.be.revertedWith("Voting has not started");

        await voting.startVoting(1); // 1 second voting period
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for voting to end

        await expect(voting.connect(voter1).vote(0)).to.be.revertedWith("Voting period has ended");
    });

    it("Should allow the owner to end voting", async function () {
        await voting.connect(owner).startVoting(3600); // Start voting
        await voting.connect(owner).endVoting(); // End voting
        expect(await voting.getVotingStatus()).to.equal("Voting has ended");
    });

    it("Should update status to 'Voting has ended' after endVoting", async function () {
        await voting.connect(owner).startVoting(3600);
        expect(await voting.getVotingStatus()).to.equal("Voting is ongoing");
        
        await voting.connect(owner).endVoting();
        expect(await voting.getVotingStatus()).to.equal("Voting has ended");
    });
    
});
