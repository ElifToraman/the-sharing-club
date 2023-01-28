import React, {useEffect, useState, useContext} from "react";
import {useParams, useHistory} from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card"
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH
} from "../../shared/util/validators";

import {useForm} from "../../shared/hooks/form-hook";
import {useHttpClient} from "../../shared/hooks/http-hook";
import {AuthContext} from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import "./TaskForm.css";

const UpdateTask = () => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedTask, setLoadedTask] =  useState();
    const taskId = useParams().taskId;
    const history = useHistory();
    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
    }, false)

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/tasks/${taskId}`);
                setLoadedTask(responseData.task);
                setFormData(
                    {
                        title: {
                            value: responseData.task.title,
                            isValid: true
                        },
                        description: {
                            value: responseData.task.description,
                            isValid: true
                        }
                    }, true
                );
            } catch (err) {}
        };
        fetchTask();
    },[sendRequest, taskId, setFormData]);


    const taskUpdateSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:5000/api/tasks/${taskId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            history.goBack();
        } catch (err) {}
    };

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    if(!loadedTask && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find task!</h2>
                </Card>
            </div>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedTask && (
                <form className="task-form" onSubmit={taskUpdateSubmitHandler}>
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                    initialValue={loadedTask.title}
                    initialValid={true}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (min. 5 characters)."
                    onInput={inputHandler}
                    initialValue={loadedTask.description}
                    initialValid={true}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    UPDATE TASK
                </Button>
            </form>
            )};
        </React.Fragment>
    );
};

export default UpdateTask;