import { createSlice } from "@reduxjs/toolkit"

const options = {
    name: 'currentTime',
    initialState: '24h',
    reducers: {
        setCurrentTime(state, action) {
            return action.payload
        }
    }
}

export const currentTimeSlice = createSlice(options)