import React from 'react';

import "./IpfsHandler.css";
import ButtonUpload from '../ButtonUpload/ButtonUpload';
import ButtonDownload from '../ButtonDownload/ButtonDownload';

export default function IpfsHandling() {
    return (
        <section className="ipfs-handling">
            <div className="ipfs-margins">
                <h2 className="ipfs-title">Research Paper</h2>
                <ButtonUpload/>
                <ButtonDownload/>
            </div>
        </section>
    );
}