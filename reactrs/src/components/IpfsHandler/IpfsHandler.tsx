import React from 'react';

import ButtonUpload from '../ButtonUpload/ButtonUpload';
import ButtonDownload from '../ButtonDownload/ButtonDownload';

export default function IpfsHandling() {
    return (
        <div className="ipfs-handling">
            <div className="margins">
                <h2>Research Paper</h2>
                <ButtonUpload/>
                <br/><br/>
                <ButtonDownload/>
            </div>
        </div>
    );
}