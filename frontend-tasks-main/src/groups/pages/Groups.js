import React, {useContext, useEffect, useState} from "react";
import GroupList from "../components/GroupList";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Input from "../../shared/components/FormElements/Input";
import {VALIDATOR_REQUIRE} from "../../shared/util/validators";
import {useHttpClient} from "../../shared/hooks/http-hook";
import {useHistory} from "react-router-dom";
import {useForm} from "../../shared/hooks/form-hook";
import {AuthContext} from "../../shared/context/auth-context";
import "./Groups.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const Groups = () => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedGroups, setLoadedGroups] = useState();
    const history = useHistory();
    const auth = useContext(AuthContext);

    const [formState, inputHandler]= useForm(
        {
            name: {
                value: '',
                isValid: false
            }
        }, false);

    useEffect(()=> {
        const fetchGroups = async () => {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/groups/all',
                    'GET',
                    null,
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    });
                setLoadedGroups(responseData.groups.filter(groups => {
                    return !groups.users.includes(auth.userId);
                }));

            } catch (err) {}
        };
        fetchGroups();
    }, [sendRequest, auth.token, auth.userId]);

    const showCreateGroupHandler = () => {
        setShowConfirmModal(true);
    };

    const cancelCreateHandler = () => {
        setShowConfirmModal(false);
    };
    const groupSubmitHandler = async event => {
        event.preventDefault();
        try {
                await sendRequest(
                'http://localhost:5000/api/groups',
                'POST',
                JSON.stringify({
                    name: formState.inputs.name.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            setShowConfirmModal(false);
            history.push('/my-groups');
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <Modal
                show={showConfirmModal}
                header= "Do you want create a group?" footerClass="task-item__modal-actions"
                footer={
                        <form className="group-form" onSubmit={groupSubmitHandler}>
                            {isLoading && <LoadingSpinner asOverlay />}
                            <Input
                                id="name"
                                element="input"
                                name="name"
                                type="text"
                                label="Group Name"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter a group name."
                                onInput={inputHandler}
                            />
                            <Button type="button" inverse onClick={cancelCreateHandler}>CANCEL</Button>
                            <Button type="submit" disabled={!formState.isValid}>
                                CREATE GROUP
                            </Button>
                        </form>
                }
            >
                <p>You can create a group by filling out the form below.</p>
            </Modal>
            <div className="create_group__actions">
                <Button onClick={showCreateGroupHandler}>Create Group</Button>
            </div>
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedGroups && <GroupList items={loadedGroups} />}
        </React.Fragment>
    );
};

export default Groups;