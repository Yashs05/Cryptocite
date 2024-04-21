import { createSlice } from "@reduxjs/toolkit"

const options = {
    name: 'alert',
    initialState: {
        display: false,
        message: '',
        color: ''
    },
    reducers: {
        setAlert(state, action) {
            return action.payload
        }
    }
}

export const alertSlice = createSlice(options)