import { create } from 'ipfs-http-client';

export const IPFS = create({
    host : 'ipfs.infura.io',
    port : 5001,
    protocol : 'https'
});