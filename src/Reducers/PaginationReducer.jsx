import { createSlice } from "@reduxjs/toolkit"

const options = {
    name: 'pagination',
    initialState: {
        page: 1,
        offset: 0
    },
    reducers: {
        setPagination(state, action) {
            return action.payload
        }
    }
}

export const paginationSlice = createSlice(options)