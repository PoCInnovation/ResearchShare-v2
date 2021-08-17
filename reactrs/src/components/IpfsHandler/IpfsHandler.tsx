import React from 'react';

import "./IpfsHandler.css";
import ButtonUpload from '../ButtonUpload/ButtonUpload';
import ButtonDownload from '../ButtonDownload/ButtonDownload';

export default function IpfsHandling() {
    return (
        <div className="ipfs-handling">
            <div className="ipfs-margins">
                <h2>Research Paper</h2>
                <ButtonUpload/>
                <br/><br/>
                <ButtonDownload/>
            </div>
        </div>
    );
}