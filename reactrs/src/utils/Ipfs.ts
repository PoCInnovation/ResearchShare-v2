import { useContext, createContext } from 'react';
import create from 'ipfs-http-client';

const IPFSContext = createContext(create({
    host : 'ipfs.infura.io',
    port : 5001,
    protocol : 'https'
}));

export default function useIPFS() {
    const IPFS = useContext(IPFSContext);
    return IPFS;
}