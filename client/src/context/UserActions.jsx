import axios from 'axios';

export const loginCall = async (credentials, dispatch) => {
    dispatch({ type: 'LOGIN_START' });

    try {
        const res = await axios.post(`${import.meta.env.ENV_SERVER_URL}/user/login`, credentials);
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
        return localStorage.setItem('loggedInUser', JSON.stringify(res.data));
    } catch (err) {
        dispatch({ type: 'LOGIN_FAILURE', payload: err });
        throw new Error(err.response.data);
    }
}

export const logoutCall = async (user, dispatch) => {
    dispatch({ type: 'LOGOUT_START' });

    try {
        dispatch({ type: 'LOGOUT_SUCCESS', payload: user });
        return localStorage.clear();
    } catch (err) {
        dispatch({ type: 'LOGOUT_FAILURE', payload: err });
        throw new Error(err);
    }
}

export const refreshUserData = async (user, dispatch) => {
    dispatch({ type: 'LOGIN_START' });

    try {
        const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/user?id=${user._id.toString()}`);
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
        return localStorage.setItem('loggedInUser', JSON.stringify(res.data));
    } catch (err) {
        dispatch({ type: 'LOGIN_FAILURE', payload: err });
        throw new Error(err.response.data);
    }
}