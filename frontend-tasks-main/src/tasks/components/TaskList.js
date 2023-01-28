import React from "react";
import "./TaskList.css";

import TaskItem from "./TaskItem";
import Button from "../../shared/components/FormElements/Button";

const TaskList = props => {
    if( props.items.length === 0) {
        return (
            <div className="no-task">
                <h2>No tasks found!</h2>
                <Button to={"/groups/" + props.groupId +"/tasks/new"} >Create New Task</Button>
            </div>
        );
    }
    return (
        <ul className="task-list">
            {props.items.map(task => (
                <TaskItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    score={task.score}
                    isCompleted={task.isCompleted}
                    groupId={task.groupId}
                    creatorId={task.creator}
                    refreshPage={props.refreshPage}
                />
            ))}
            <div className="task-list center">
                <Button to={"/groups/" + props.groupId +"/tasks/new"} >Create New Task</Button>
            </div>
        </ul>
    );
};

export default TaskList;