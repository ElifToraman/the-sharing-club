import React from 'react';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './UserItem.css';

const UserItem = props => {

    return (
        <li className="user-item">

            <Card className="user-item__content">
                    <div className="user-item__image">
                        <Avatar image={`http://localhost:5000/${props.image}`} alt={props.name} />
                    </div>
                    <div className="user-item__info">
                        <h2>{props.name}</h2>
                        <h3>Score: {props.score} </h3>
                    </div>
            </Card>

        </li>
    );
};

export default UserItem;
