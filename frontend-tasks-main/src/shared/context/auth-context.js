import {createContext} from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    groupId: null,
    token: null,
    login: ()=> {},
    logout: ()=> {}
});