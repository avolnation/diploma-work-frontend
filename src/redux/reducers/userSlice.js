import {
    createSlice
} from "@reduxjs/toolkit";

const initialState = {
    loading: true,
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
        setData: (state, action) => {
            state.data = action.payload;
        }
    }
})

export const {
    setLoadingUser,
    setToken,
    setData
} = userSlice.actions
export default userSlice.reducer