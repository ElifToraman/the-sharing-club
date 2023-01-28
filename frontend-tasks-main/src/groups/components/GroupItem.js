import React, {useContext} from 'react';
import Card from "../../shared/components/UIElements/Card";

import './GroupItem.css';

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {useHttpClient} from "../../shared/hooks/http-hook";
import Button from "../../shared/components/FormElements/Button";
import { UilAirplay } from '@iconscout/react-unicons'
import {AuthContext} from "../../shared/context/auth-context";
import {Link, useHistory} from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const GroupItem = props => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const history = useHistory();

    const joinToGroupHandler  = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:5000/api/groups/user`,
                'POST',
                JSON.stringify({
                    groupId: props.id,
                    userId: auth.userId
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            history.push('/my-groups');

        } catch (err) {}
    };
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <div className="group-item">
                <Card className="group-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    {props.users.find((userId) => auth.userId === userId) ?
                    <Link to={`/groups/${props.id}/details`}>
                        <div className="group-item__info">
                            <h2>{props.name}</h2>
                        </div>
                       {!props.users.find((userId) => auth.userId === userId) ?
                        <div className="group-item__actions">
                           <a onClick={joinToGroupHandler}><UilAirplay />JOIN</a>
                        </div> : null
                       }
                    </Link> :
                        <div className="group-item__info">
                            <h2>{props.name}</h2>
                        </div>}
                        {!props.users.find((userId) => auth.userId === userId) ?
                        <div className="group-item__actions">
                            <a onClick={joinToGroupHandler}><UilAirplay />JOIN</a>
                        </div> : null
                        }
                </Card>
            </div>
        </React.Fragment>
    );
};

export default GroupItem;
