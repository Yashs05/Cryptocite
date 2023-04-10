import { createSlice } from "@reduxjs/toolkit"

const options = {
    name: 'fiatCurrency',
    initialState: {
        name: 'Indian Rupee',
        code: 'INR',
        symbol: '₹',
        type: 'fiat',
        uuid: '6mUvpzCc2lFo'
    },
    reducers: {
        setFiatCurrency(state, action) {
            return action.payload
        }
    }
}

export const fiatCurrencySlice = createSlice(options)