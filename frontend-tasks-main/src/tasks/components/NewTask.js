import React, {useContext} from "react";
import {useHistory, useParams} from "react-router-dom";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH
} from "../../shared/util/validators";

import {useForm} from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {useHttpClient} from "../../shared/hooks/http-hook";
import {AuthContext} from "../../shared/context/auth-context";
import "./TaskForm.css";

const NewTask = () => {
    const auth = useContext(AuthContext);
    const groupId = useParams().groupId;
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [formState, inputHandler]= useForm(
        {
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        score: {
            value: null,
            isValid: false
        }
    }, false);

    const history = useHistory();

    const taskSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                'http://localhost:5000/api/tasks',
                'POST',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    score: formState.inputs.score.value,
                    groupId: groupId,
                    creator: auth.userId
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            history.push('/groups/' + groupId + '/details')
        } catch (err) {}
    };
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <form className="task-form" onSubmit={taskSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />
                <Input
                    id="score"
                    element="input"
                    label="Score"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid score."
                    onInput={inputHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    ADD TASK
                </Button>
            </form>
        </React.Fragment>
    );
};

export default NewTask;