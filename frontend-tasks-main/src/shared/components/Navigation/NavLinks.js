import React, {useContext} from "react";
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../context/auth-context";
import { UilSignin } from '@iconscout/react-unicons';
import { UilSignout } from '@iconscout/react-unicons';
import { UilUser } from '@iconscout/react-unicons'
import {Link} from "react-router-dom";
import './NavLinks.css'

const NavLinks = props => {
    const auth = useContext(AuthContext);
    return (
        <ul className="nav-links">
            {auth.isLoggedIn && (
                <li>
                    <NavLink exact to="/groups">GROUPS</NavLink>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                    <NavLink exact to="/my-groups">MY GROUPS</NavLink>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                    <NavLink exact to="/"><UilUser/></NavLink>
                </li>
            )}

            {!auth.isLoggedIn && (
                <li id="login-icon">
                    <Link to="/auth">
                        <UilSignin />
                    </Link>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                    <button onClick={auth.logout}>
                        <UilSignout />
                    </button>
                </li>
            )}
        </ul>
    );
};

export default NavLinks;