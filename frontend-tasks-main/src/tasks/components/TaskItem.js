import React, {useState, useContext} from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {useHttpClient} from "../../shared/hooks/http-hook";
import { AuthContext } from '../../shared/context/auth-context';
import { UilTrashAlt } from '@iconscout/react-unicons'
import { UilEdit } from '@iconscout/react-unicons';
import { UilCheckCircle } from '@iconscout/react-unicons'
import "./TaskItem.css";

const TaskItem = props => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };

    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try {
            await sendRequest(
                `http://localhost:5000/api/tasks/${props.id}`,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );
            props.refreshPage();
        } catch (err) {}
    };

    const markAsDoneHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:5000/api/tasks/${props.id}/complete`,
                'PUT',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );
            props.refreshPage()
        } catch (err) {}
    };
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showConfirmModal}
                header= "Are you sure?" footerClass="task-item__modal-actions"
                footer={
                <React.Fragment>
                    <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                    <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                </React.Fragment>
                }
            >
                <p>Do you want to proceed and delete this task? Please not that it can't be undone thereafter.</p>
            </Modal>
            <li className={`task-item ${props.isCompleted ? "is-completed" : ''}`}>
                <Card className="task-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                <div className="task-item__info">
                    <p><strong>TITLE:</strong> {props.title}</p>
                    <p><strong>DESCRIPTION:</strong> {props.description}</p>
                    <p><strong>SCORE: </strong>{props.score}</p>
                </div>
                <div className={`task-item__actions ${props.isCompleted ? "mark-as-done" : ''}`}>
                    {auth.userId === props.creatorId && (
                        <React.Fragment>
                            <Button to={`/tasks/${props.id}`} disabled={props.isCompleted}><UilEdit />Edit</Button>
                            <Button danger onClick={showDeleteWarningHandler}><UilTrashAlt />Delete</Button>
                        </React.Fragment>
                    )}
                    <Button done onClick={markAsDoneHandler}><UilCheckCircle />Mark as done</Button>
                </div>
                </Card>
            </li>
        </React.Fragment>
    );
};
export default TaskItem;