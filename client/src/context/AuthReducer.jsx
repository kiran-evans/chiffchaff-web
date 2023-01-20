export const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                user: null,
                isFetching: false,
                error: false,
            }
        
        case 'LOGIN_SUCCESS':
            return {
                user: action.payload,
                isFetching: false,
                error: false,
            }
        
        case 'LOGIN_FAILURE':
            return {
                user: null,
                isFetching: false,
                error: action.payload,
            }
        
        case 'LOGOUT_START':
            return {
                user: action.payload,
                isFetching: false,
                error: false,
            }
        
        case 'LOGOUT_SUCCESS':
            return {
                user: null, // Succeed with no user logged in
                isFetching: false,
                error: false,
            }
        
        case 'LOGOUT_FAILURE':
            return {
                user: null,
                isFetching: false,
                error: action.payload,
            }
            
        default:
            return state;
    }
}