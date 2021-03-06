import * as actionTypes from './actionTypes'

export const authStart = () => ({
    type: actionTypes.AUTH_START
})

export const authSuccess = (authData) => ({
    type: actionTypes.AUTH_SUCCESS,
    authData
})

export const authFail = (error) => ({
    type: actionTypes.AUTH_FAIL,
    error
})

export const auth = (email, password) => {
    return dispatch => {
        dispatch(authStart())
    }
}