import { initialize, ZoKratesProvider, CompilationArtifacts, ComputationResult, SetupKeypair, Proof } from 'zokrates-js';

export const zokrates = initialize();

export async function compile(zokrates: ZoKratesProvider): Promise<CompilationArtifacts> {
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

export async function compute(zokrates: ZoKratesProvider, artifacts: CompilationArtifacts, reviewers: Array<string>, computeArguments: Array<string>): Promise<ComputationResult> {
    const reviewersHashes = []; 
    const argumentsHashes = [];
    for (const reviewer of reviewers) {
        const encoder = new TextEncoder().encode(reviewer);
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16))
        reviewersHashes.push(hashHex);
    }
    for (const argument of computeArguments) {
        const encoder = new TextEncoder().encode(argument);
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16))
        argumentsHashes.push(hashHex);
    }
    const args = [reviewersHashes, ...argumentsHashes];
    const result = zokrates.computeWitness(artifacts, args);
    return result;
}

export function keypair(zokrates: ZoKratesProvider, artifacts: CompilationArtifacts): SetupKeypair {
    const keypair = zokrates.setup(artifacts.program);
    return keypair;
}

export function proof(zokrates: ZoKratesProvider, artifacts: CompilationArtifacts, result: ComputationResult, keypair: SetupKeypair): Proof {
    const proof = zokrates.generateProof(artifacts.program, result.witness, keypair.pk);
    return proof;
}

export function verifier(zokrates: ZoKratesProvider, keypair: SetupKeypair): string {
    const verifier = zokrates.exportSolidityVerifier(keypair.vk, "v2");
    return verifier;
}