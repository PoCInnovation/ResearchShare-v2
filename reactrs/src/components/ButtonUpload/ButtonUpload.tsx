import React, { ChangeEvent } from 'react';
import { CID } from "ipfs-http-client";
import { IPFS } from '../../utils/Ipfs';
import './ButtonUpload.css';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

export default function ButtonUpload() {
    const [filename, setFileName] = React.useState("");
    const [fileContent, setFileContent] = React.useState<File | null>(null);
    const [fileHash, setFileHash] = React.useState<CID | null>(null);
    const [paperField, setPaperField] = React.useState("");

    function changeField(event: ChangeEvent<HTMLInputElement>) {
        setPaperField(event.target.value);
    }

    function changeFile(event: ChangeEvent<HTMLInputElement>) {
        setFileContent(event.target.files?.[0] ?? null);
        setFileName(event.target.files?.[0].name ?? "");
    }

    async function submitPaper() {
        if (filename && fileContent) {
            const ext = filename.split('.').pop() ?? ".txt";
            await IPFS.files.mkdir("/reactrs-paper");
            await IPFS.files.write(`/reactrs-paper/${paperField}${ext}`, fileContent, { create: true });
            const direntry = await IPFS.files.stat("/reactrs-paper");
            setFileHash(direntry.cid);
        }
    };

    return (
        <div>
            <div id="upload">
                <Input placeholder='Field' onChange={changeField} />
                <input id="upload-input" onChange={changeFile} type="file"/>
                <Button id="upload-button" onClick={submitPaper} variant="contained" color="primary">
                    Upload
                </Button>
            </div>
            <br/>
            {fileHash ? <div id="upload-success">{`Success: ${fileHash.toString()}`}</div> : null}
        </div>
    );
}