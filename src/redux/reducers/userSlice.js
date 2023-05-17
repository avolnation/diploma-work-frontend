import {
    createSlice
} from "@reduxjs/toolkit";

const initialState = {
    loading: true,
    authenticated: false,
    token: '',
    data: {}
}

const userSlice = createSlice({
    name: "groups",
    initialState,
    reducers: { // TODO: Когда буду делать обработку ошибок вернуться сюда
        setLoadingUser: (state, action) => {
            state.loading = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setAuthenticated: (state, action) => {
            state.authenticated = action.payload;
        },
        setData: (state, action) => {
            state.data = action.payload;
        }
    }
})

export const {
    setLoadingUser,
    setToken,
    setAuthenticated,
    setData
} = userSlice.actions
export default userSlice.reducer