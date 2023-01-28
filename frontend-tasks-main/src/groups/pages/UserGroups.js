import React, {useContext, useEffect, useState} from "react";

import GroupList from "../components/GroupList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {useHttpClient} from "../../shared/hooks/http-hook";
import {AuthContext} from "../../shared/context/auth-context";

const UserGroups = () => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedGroups, setLoadedGroups] = useState();

    const userId = auth.userId;

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/groups/user/${userId}`,
                    'GET',
                    null,
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    });
                setLoadedGroups(responseData.groups);
            } catch (err) {}
        };
        fetchGroups();
    }, [sendRequest, userId, auth.token]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedGroups && <GroupList items={loadedGroups} />}
        </React.Fragment>
    );
};

export default UserGroups;