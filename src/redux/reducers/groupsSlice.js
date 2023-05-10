import {
    createSlice
} from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    groups: [],
    error: ''
}

const groupsSlice = createSlice({
    name: "groups",
    initialState,
    reducers: { // TODO: Когда буду делать обработку ошибок вернуться сюда
        setLoadingGroups: (state) => {
            state.loading = true;
        },
        fetchGroupsFromApiSucceed: (state, action) => {
            state.groups = action.payload;
            state.loading = false;
        }, // TODO: Когда приведу в порядок API, тогда вернусь к выводу и сохранению ошибок!!!
        fetchGroupsFromApiFailed: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const {
    setLoadingGroups,
    fetchGroupsFromApiSucceed,
    fetchGroupsFromApiFailed
} = groupsSlice.actions
export default groupsSlice.reducer