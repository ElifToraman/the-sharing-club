import React, {useContext, useEffect, useState} from "react";
import TaskList from "../../tasks/components/TaskList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {useHttpClient} from "../../shared/hooks/http-hook";
import {useParams, useHistory} from "react-router-dom";
import {AuthContext} from "../../shared/context/auth-context";
import UsersList from "../../user/components/UsersList";

const GroupDetails = () => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [groupDetails, setGroupDetails] = useState();
    const groupId = useParams().groupId;
    const history = useHistory();

    const refreshPage = () => {
        history.go(0);
    }

    useEffect(()=> {
        const fetchTasks = async () => {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/groups/' + groupId,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    });
                setGroupDetails(responseData);
            } catch (err) {}
        };
        fetchTasks();
    }, [sendRequest, auth.token, groupId]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && groupDetails && <UsersList items={groupDetails.users} groupId={groupId}/>}
            {!isLoading && groupDetails && <TaskList items={groupDetails.tasks} groupId={groupId} refreshPage={refreshPage} />}
        </React.Fragment>
    );
};

export default GroupDetails;