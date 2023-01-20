/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";
import { AuthReducer } from "./AuthReducer";

const INIT_STATE = {
    user: localStorage.getItem('loggedInUser') ? JSON.parse(localStorage.getItem('loggedInUser')) : null, // Parse user which is stored as a string in localStorage
    isFetching: false,
    error: false,
};

export const AuthContext = createContext(INIT_STATE);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INIT_STATE);
    return (
        <AuthContext.Provider value={{
            user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        }} >{children}</AuthContext.Provider>
    )
}