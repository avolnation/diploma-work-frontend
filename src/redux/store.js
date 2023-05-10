import { configureStore } from "@reduxjs/toolkit"

import groupsSlice from "./reducers/groupsSlice";
import subjectsSlice from "./reducers/subjectsByGroupSlice";
import userSlice from "./reducers/userSlice";

const store = configureStore({
    reducer: {
        groups: groupsSlice,
        subjects: subjectsSlice,
        user: userSlice,
    }
})

export default store;