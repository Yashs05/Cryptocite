import { createSlice } from "@reduxjs/toolkit"

const options = {
    name: 'themeChanger',
    initialState: 'light',
    reducers: {
        setTheme(state, action) {
            return action.payload
        }
    }
}

export const themeChangerSlice = createSlice(options)