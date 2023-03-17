import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";

import _ from 'lodash'

const initialState = {
    loading: true,
    groups: [],
    allSubjects: [],
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

export const fetchSubjectsByGroupIdAndDay = createAsyncThunk('subjects/fetchSubjectsByGroupIdAndDay',
    async (data) => {
        const { groupId, day } = data;
        const result = await fetch(`http://localhost:3002/schedule/get-schedule-by-day-and-group?day=${day}&group=${groupId}`)
        const subjects = await result.json()
        return {day: day, subjects: subjects}
    })

const subjectsByGroupSlice = createSlice({
    name: "subjectsByGroup",
    initialState,
    reducers: { // TODO: Когда буду делать обработку ошибок вернуться сюда
        setLoadingSubjects: (state, action) => {
            state.loading = action.payload
        },
        setGroupForSubjects: (state, action) => {
            state.allSubjects = action.payload;
        },
        fetchGroupsFromApiSucceed: (state, action) => {
            state.groups = action.payload
        },
        fetchSubjectsFromApiSucceed: (state, action) => {
            let {
                day,
                subjects
            } = action.payload;
            console.log(day, subjects)
            // if(!(_.isEqual(state.subjects[day], subjects))){
                state.subjects[day] = subjects;
                state.loading = false;
            // }
        }, // TODO: Когда приведу в порядок API, тогда вернусь к выводу и сохранению ошибок!!!
        fetchSubjectsFromApiFailed: (state, action) => {
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSubjectsByGroupIdAndDay.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchSubjectsByGroupIdAndDay.fulfilled, (state, action) => {
            const { day, subjects } = action.payload
            state.subjects[day] = subjects.schedule
            // console.log(action.payload)
            state.loading = false;
        })
        builder.addCase(fetchSubjectsByGroupIdAndDay.rejected, (state) => {
            state.loading = false
            state.error = 'Ошибка'
        })
    }
})

export const {
    setLoadingSubjects,
    setGroupForSubjects,
    setPairModeByDaysV2,
    fetchSubjectsFromApiSucceed,
    fetchSubjectsFromApiFailed,
    fetchGroupsFromApiSucceed
} = subjectsByGroupSlice.actions
export default subjectsByGroupSlice.reducer