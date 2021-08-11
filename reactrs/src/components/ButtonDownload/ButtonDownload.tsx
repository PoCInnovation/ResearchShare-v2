import React from 'react';
import Button from '@material-ui/core/Button';
import './ButtonDownload.css';

import fileDownload from 'js-file-download';
import all from 'it-all';
import concat from 'it-concat';

/**
 * Download the content of a file from IPFS via the client & hash, then extract it via the setter.
 * @param ipfs - IPFS Client.
 * @param hash {string} - Hash of a file on IPFS.
 * @param setContent - Setter from `React.useState` to retrieve the content of the file.
 * @returns {Promise<void>}
 */
async function downloadFromIPFS(ipfs: any, hash: string) {
    const result: Array<any> = await all(ipfs.get(hash));
    const fileContent = await concat(result[0].content);
    return (fileContent);
}

/**
 * Component Function used to retrieve a file from IPFS based on user's input.
 * Test hash: QmPKby2sr2fxeEpxeGVuevGsvSVd1Hs37JBR9QSuWrvzuV -- my_world file from Alex & Theo
 * @param ipfs - IPFS Client.
 * @returns {JSX.Element}
 * @constructor
 */
export function DownloadButton({ipfs}: {ipfs: any}) {
    const [hash, setHash] = React.useState("");

    const handleClick = async () => {
        if (!hash)
            return;
        const data = await downloadFromIPFS(ipfs, hash);
        const blob = new Blob([data]);
        fileDownload(blob, 'test.txt');
    }
    const inputOnChange = (event: any) => setHash(event.target.value);

    return (
        <div>
            <div id="download">
                <input id="download_input" onChange={inputOnChange} type="text" name="HashField"/>
                <Button id="download_button" onClick={handleClick} variant="contained" color="primary">
                    Download
                </Button>
            </div>
        </div>
    );
}
