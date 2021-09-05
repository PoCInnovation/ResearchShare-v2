/*
import { expect } from "chai";
import { accounts, contract } from "@openzeppelin/test-environment";
// import {
//   BN, // Big Number support
//   constants, // Common constants, like the zero address and largest integers
//   expectEvent, // Assertions for emitted events
//   expectRevert, // Assertions for transactions that should fail
// } from "@openzeppelin/test-helpers";

const RSAuth = contract.fromArtifact("RSAuth");
const researchCenterRole = "RESEARCH_CENTER_ROLE";
const researcherRole = "RESEARCHER_ROLE";

// Start test block
describe("RSAuth", function () {
  const [univ1, univ2, researcher, other] = accounts;

  beforeEach(async function () {
    this.contract = await RSAuth.new({ from: univ1 });

    this.hasRole = async function (role: string, address: string) {
      return await this.contract.hasRole(await this.contract[role](), address);
    };

    this.isCenter = (address: string) => this.hasRole(researchCenterRole, address);
    this.isResearcher = (address: string) => this.hasRole(researcherRole, address);

    this.grantRole = async function (role: string, address: string, config: any) {
      return await this.contract.grantRole(
        await this.contract[role](),
        address,
        config
      );
    };
  });

  it("grants research center role to creator", async function () {
    expect(await this.isCenter(univ1)).to.be.true;
  });

  it("does not grant role to other people", async function () {
    expect(await this.isCenter(other)).to.not.be.true;
  });

  it("allow centers to manage other centers", async function () {
    expect(await this.isCenter(univ2)).to.not.be.true;
    await this.grantRole(researchCenterRole, univ2, { from: univ1 });
    expect(await this.isCenter(univ2)).to.be.true;
  });

  it("allow centers to register researchers", async function () {
    expect(await this.isResearcher(researcher)).to.not.be.true;
    await this.grantRole(researcherRole, researcher, { from: univ1 });
    expect(await this.isResearcher(researcher)).to.be.true;
    expect(await this.contract.getResearchersCenter(researcher)).to.be.equal(
      univ1
    );
  });

});
*/