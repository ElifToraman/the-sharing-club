import React, {useContext, useEffect, useState} from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {useHttpClient} from "../../shared/hooks/http-hook";
import {AuthContext} from "../../shared/context/auth-context";
import "./Auth.css";

const User = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();
    const auth = useContext(AuthContext);

    useEffect(()=> {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users',
                    'GET',
                    null,
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    });
                setLoadedUsers(responseData.users.filter((user) => user.id === auth.userId));
            } catch (err) {}
        };
        fetchUsers();
    }, [sendRequest, auth.token, auth.userId]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            <div className="profile">
                <h2>Welcome! You are logged in as: {!isLoading && loadedUsers && <UsersList items={loadedUsers} />} </h2>
            </div>
        </React.Fragment>
    );
};

export default User;