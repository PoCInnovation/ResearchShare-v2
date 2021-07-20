const { initialize } = require('zokrates-js/node');
const fs = require('fs');

initialize().then((zokratesProvider) => {
    const source = fs.readFileSync("zokrates/reviewer.zok").toString();

    // compilation
    const artifacts = zokratesProvider.compile(source);

    console.log(artifacts)
    return;

    // computation
    const { witness, output } = zokratesProvider.computeWitness(artifacts, ["4"]);

    // run setup
    const keypair = zokratesProvider.setup(artifacts.program);

    // generate proof
    const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);

    // fs.writeFileSync("zokrates/zokrates.json", proof);
    
    // export solidity verifier
    const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk, "v2");

    fs.writeFileSync("zokrates/zokrates.sol", verifier);
});