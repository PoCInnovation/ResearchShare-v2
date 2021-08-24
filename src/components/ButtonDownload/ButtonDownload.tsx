import { ChangeEvent, useState } from 'react';
import Button from '@material-ui/core/Button';
import { IPFS } from '../../utils/Ipfs';
import './ButtonDownload.css';

import fileDownload from 'js-file-download';
import all from 'it-all';

export default function ButtonDownload() {
    const [cid, setCID] = useState("");

    async function handleClick() {
        if (cid !== "") {
            for await (const file of IPFS.ls(cid)) {
                const buffer = IPFS.cat(file.cid);
                const data = await all(buffer);
                const blob = new Blob(data);
                fileDownload(blob, file.name);
            }
        }
    }

    function changeInput(event: ChangeEvent<HTMLInputElement>) {
        setCID(event.target.value);
    }

    return (
        <div id="download">
            <input className="download-input" onChange={changeInput} type="text" name="HashField"/>
            <Button className="download-button" onClick={handleClick} variant="contained" color="primary">
                Download
            </Button>
        </div>
    )
}
