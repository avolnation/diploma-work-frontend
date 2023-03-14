import {
    createSlice
} from "@reduxjs/toolkit";

const initialState = {
    loading: true,
    group: '',
    subjects: {
        'Понедельник': [],
        'Вторник': [],
        'Среда': [],
        'Четверг': [],
        'Пятница': [],
        'Суббота': [],
    },
    error: ''
}

const subjectsByGroupSlice = createSlice({
    name: "subjectsByGroup",
    initialState,
    reducers: { // TODO: Когда буду делать обработку ошибок вернуться сюда
        setLoadingSubjects: (state) => {
            state.loading = true
        },
        setGroupForSubjects: (state, action) => {
            state.group = action.payload;
        },
        fetchSubjectsFromApiSucceed: (state, action) => {
            let { day, subjects } = action.payload;
            console.log(day, subjects)
            state.subjects[day] = subjects;
            state.loading = false;
        }, // TODO: Когда приведу в порядок API, тогда вернусь к выводу и сохранению ошибок!!!
        fetchSubjectsFromApiFailed: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const {
    setLoadingSubjects,
    setGroupForSubjects,
    fetchSubjectsFromApiSucceed,
    fetchSubjectsFromApiFailed
} = subjectsByGroupSlice.actions
export default subjectsByGroupSlice.reducer