import { configureStore } from "@reduxjs/toolkit"

import groupsSlice from "./reducers/groupsSlice";
import subjectsSlice from "./reducers/subjectsByGroupSlice";

const store = configureStore({
    reducer: {
        groups: groupsSlice,
        subjects: subjectsSlice
    }
})

export default store;