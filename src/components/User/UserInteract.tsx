import React, {useState, Dispatch, SetStateAction, Fragment} from 'react';
import './UserInteract.css';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Input from '@material-ui/core/Input';

interface UserInfo {
    firstName: string;
    familyName: string;
    fields: Array<string>;
}

interface UserInfoItem {
    0: string;
    1: string;
    2: Array<string>;
}

export function UserInteract({contract, setSpinner}: {
    contract: null, setSpinner: Dispatch<SetStateAction<boolean>>
}) {
    const [userInfos, setUserInfos] = useState<UserInfo>({firstName: '', familyName: '', fields: []});
    const [field, setField] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, setUser] = useState<UserInfoItem | null>(null);

    function handleClickRegisterUser() {
        setUserInfos({firstName: '', familyName: '', fields: []});
    }

    function handleClickGetUser() {
        
    }

    function handleClickAddField() {
        setUserInfos({...userInfos, fields: [...userInfos.fields, field]});
        setField('');
    }

    return (
        <Fragment>
            <br/>
            <div className="formInputsForUsersRegister">
                <div>
                    <p>First Name:</p>
                    <Input className="stringInputs" type="text" value={userInfos.firstName}
                           onChange={(e) => setUserInfos({...userInfos, firstName: e.target.value})}/>
                </div>
                <br/>
                <div>
                    <p>Family Name:</p>
                    <Input className="stringInputs" type="text" value={userInfos.familyName}
                           onChange={(e) => setUserInfos({...userInfos, familyName: e.target.value})}/>
                </div>
                <br/>
                <div>
                    <p>Fields:</p>
                    <div className="user-fields">
                        <Input className="user-input-field" type="text" value={field}
                               onChange={(e) => setField(e.target.value)}/>
                        <Button className="user-button-field" color="primary" variant="contained"
                                onClick={handleClickAddField}>
                            <AddIcon/>
                        </Button>
                    </div>
                    <br/>
                    {userInfos.fields.length !== 0 ?
                        <ul id="user-list">
                            {userInfos.fields.map((value, index) => {
                                return <li key={index}>{value}</li>
                            })}
                        </ul>
                        : null}
                </div>
                <br/>
                <br/>
                <Button className="button" color="primary" variant="contained"
                        onClick={handleClickRegisterUser}>
                    Sign Up
                </Button>
            </div>
            <br/><br/>
            <div>
                {!user ?
                    <Button className="button" color="primary" variant="contained"
                            onClick={handleClickGetUser}>
                        GET USER
                    </Button>
                    :
                    <Fragment>
                        <p>FirstName: {user[0]}</p>
                        <p>FamilyName: {user[1]}</p>
                        <p>Fields:&nbsp;
                            {user[2].map((value, index) => {
                                return value.concat(index !== user[2].length - 1 ? ', ' : '')
                            })}
                        </p>
                    </Fragment>
                }
            </div>
        </Fragment>
    );
}