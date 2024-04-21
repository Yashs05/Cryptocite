import { createSlice } from "@reduxjs/toolkit"
import config from "../config";

export const loadCurrency = (id, fiatCurrencyUuid) => {
    return async (dispatch, getState) => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
                    'X-RapidAPI-Key': config.apiKey
                }
            };

            const APIData = await fetch(`https://coinranking1.p.rapidapi.com/coin/${id}?referenceCurrencyUuid=${fiatCurrencyUuid}&timePeriod=24h`, options)

            const response = await APIData.json()

            const payload = await response.data.coin

            dispatch({
                type: 'currency/setCurrency',
                payload: {
                    data: payload,
                    isLoading: false,
                    hasError: false
                }
            })
        } catch {
            dispatch({
                type: 'currency/setCurrency',
                payload: {
                    data: [],
                    isLoading: false,
                    hasError: true
                }
            })
        }
    }
}

const options = {
    name: 'currency',
    initialState: {
        data: [],
        isLoading: true,
        hasError: false
    },
    reducers: {
        setCurrency(state, action) {
            return action.payload
        },
        emptyCurrency(state, action) {
            return {
                ...state,
                isLoading: true,
                data: action.payload
            }
        }
    }
}

export const currencySlice = createSlice(options)