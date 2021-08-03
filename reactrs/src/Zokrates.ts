import { initialize, ZoKratesProvider, CompilationArtifacts, ComputationResult, SetupKeypair, Proof } from 'zokrates-js';

export const zokrates = initialize();

declare global {
    interface Window { progress: number; statusMessage: string }
}

window.progress = 0;
window.statusMessage = "Initialization...";

export async function zokratesCompile(zokrates: ZoKratesProvider): Promise<CompilationArtifacts> {
    const request = await fetch("reviewer.zok");
    if (request.ok === false)
        throw new Error(request.statusText);
    const program = await request.text();
    const encoder = new TextEncoder().encode(program);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    if (hashHex !== "242b3ca12d88c4d5fa428520e49a5a3af7f82331474dca943d52b9816050b9d8")
        throw new Error("Corruped or invalid data.");
    const artifacts = zokrates.compile(program);
    return artifacts
}

export async function zokratesCompute(zokrates: ZoKratesProvider, artifacts: CompilationArtifacts, reviewers: Array<string>, computeArguments: Array<string>): Promise<ComputationResult> {
    const reviewersHashes = []; 
    const argumentsHashes = [];
    for (const reviewer of reviewers) {
        const encoder = new TextEncoder().encode(reviewer);
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16))
        const finalHashHex = [];
        for (let i = 0; i < 32; i += 4)
            finalHashHex.push(hashHex[i] + hashHex[i + 1] + hashHex[i + 2] + hashHex[i + 3]);
        reviewersHashes.push(finalHashHex);
    }
    for (const argument of computeArguments) {
        const encoder = new TextEncoder().encode(argument);
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16))
        const finalHashHex = [];
        for (let i = 0; i < 32; i += 4)
            finalHashHex.push(hashHex[i] + hashHex[i + 1] + hashHex[i + 2] + hashHex[i + 3]);
        argumentsHashes.push(finalHashHex);
    }
    const result = zokrates.computeWitness(artifacts, [reviewersHashes, argumentsHashes]);
    return result;
}

export function zokratesKeypair(zokrates: ZoKratesProvider, artifacts: CompilationArtifacts): SetupKeypair {
    const keypair = zokrates.setup(artifacts.program);
    return keypair;
}

export function zokratesProof(zokrates: ZoKratesProvider, artifacts: CompilationArtifacts, result: ComputationResult, keypair: SetupKeypair): Proof {
    const proof = zokrates.generateProof(artifacts.program, result.witness, keypair.pk);
    return proof;
}

export function zokratesVerifier(zokrates: ZoKratesProvider, keypair: SetupKeypair): string {
    const verifier = zokrates.exportSolidityVerifier(keypair.vk, "v2");
    return verifier;
}

zokrates.then(async zokratesProvider => {
    console.log("Compiling...");
    window.statusMessage = "Compiling...";
    const artifacts = await zokratesCompile(zokratesProvider);
    window.progress = 20;
    console.log("Done!");
    console.log("Computing...")
    window.statusMessage = "Computing...";
    const result = await zokratesCompute(zokratesProvider, artifacts,
        Array(32).fill("61be55a8e2f6b4e172338bddf184d6dbee29c98853e0a0485ecee7f27b9af0b4"),
        Array(4).fill("ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"));
    window.progress = 40;
    console.log("Done!");
    console.log("Generating keypair...");
    window.statusMessage = "Generating keypair...";
    const keypair = zokratesKeypair(zokratesProvider, artifacts);
    window.progress = 60;
    console.log("Done!");
    console.log("Generating proof...");
    window.statusMessage = "Generating proof...";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const proof = zokratesProof(zokratesProvider, artifacts, result, keypair);
    window.progress = 80;
    console.log("Done!");
    console.log("Generating verifier...");
    window.statusMessage = "Generating verifier...";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const verifier = zokratesVerifier(zokratesProvider, keypair);
    window.progress = 100;
    window.statusMessage = "Done!";
    console.log("Done!");
    console.log(result);
});