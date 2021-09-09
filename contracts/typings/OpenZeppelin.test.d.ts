declare module '@openzeppelin/test-helpers' {
    export function expectRevert(promise: Promise, message: string): Promise<void>;
}