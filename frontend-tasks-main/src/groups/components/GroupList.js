import React from "react";

import './GroupList.css';
import GroupItem from "./GroupItem";

const GroupList = (props) => {
    if( props.items.length === 0) {
        return (
            <div className="center">
                <h2> No groups found. </h2>
            </div>
        );
    }
    return (
        <div className="group-list">
            {props.items.map(group => (
                <GroupItem
                    key={group.id}
                    id={group.id}
                    name={group.name}
                    users={group.users}
                />
            ))}
        </div>
    );
};

export default GroupList;