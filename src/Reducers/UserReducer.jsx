import { createSlice } from "@reduxjs/toolkit"

const options = {
    name: 'user',
    initialState: {
        user: null,
        wishlistedUuids: null
    },
    reducers: {
        setUser(state, action) {
            return {
                ...state,
                user: action.payload
            }
        },
        setWishlistedUuids(state, action) {
            return {
                ...state,
                wishlistedUuids: action.payload
            }
        }
    }
}

export const userReducerSlice = createSlice(options)