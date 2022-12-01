
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Crowdfunding", async () => {

    // contract
    let sut

    // accounts
    let alice
    let bob
    let charlie
    let david

    let amountToFund = BigNumber.from("10000000000000000")

    beforeEach(async () => {
        [alice, bob, charlie, david] = await ethers.getSigners()
        const Crowdfunding = await ethers.getContractFactory("Crowdfunding")
        sut = await Crowdfunding.deploy()
    })

    describe("Deploy", async () => {
        it('should work correctly', async () => {
            expect(sut.address).to.be.properAddress
        })
    
        it('should set alice as the owner', async () => {
            // TODO: Zadanie 1
        })
    })

    describe("Funding by bob", async () => {

        beforeEach(async () => {
            sut = sut.connect(bob)
        })

        it('should accept funding from bob', async () => {
            await expect(sut.fund({value: amountToFund})).not.to.be.reverted
        })

        it('should not accept too small amount of eth', async () => {
            await expect(sut.fund({value: "100"})).to.be.revertedWith("Not enough ETH")
        })

        it('should increase balance of contract', async () => {
            await expect(sut.fund({value: amountToFund})).to.changeEtherBalance(sut, amountToFund)
        })

        context("when funded", async () => {
            
            beforeEach(async () => {
                await sut.fund({value: amountToFund})
            })

            it('should add bob to funders', async () => {
                expect(await sut.funders(0)).to.equal(bob.address)
            })
        })
    })

    describe("Withdrawing", async () => {
        beforeEach(async () => {
            await sut.connect(bob).fund({value: amountToFund})
            await sut.connect(charlie).fund({value: amountToFund})
            await sut.connect(david).fund({value: amountToFund})
        })

        it('should have correct balance', async () => {
            expect(await ethers.provider.getBalance(sut.address)).to.equal(amountToFund.mul(3))
        })

        it('should revert when withdraw called by bob', async () => {
            await expect(sut.connect(bob).withdraw()).to.be.revertedWith("Only owner can withdraw")
        })

        it('should not revert when withdraw called by alice', async () => {
            await expect(sut.connect(alice).withdraw()).to.not.be.reverted
        })

        xit('should remove balance from contract', async () => {
            // TODO: Zadanie 2
        })

        xit('should add balance for alice', async () => {
            // TODO: Zadanie 2
        })
    })

})