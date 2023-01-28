import React from "react";
import './UsersList.css';

import UserItem from "./UserItem";

const UsersList = props => {
    return (
        <ul className="users-list">
        {props.items.map(user => (
            <UserItem
                key={user.id}
                id={user.id}
                image={user.image}
                name={user.name}
                score={user.scores.find(score => score.groupId === props.groupId)?.score || 0}
            />
        ))}
        </ul>
    );
};

export default UsersList;