import { createSlice } from "@reduxjs/toolkit";
import config from "../config";

export const loadCurrencyHistory = (currencyUuid, fiatCurrencyUuid, timePeriod) => {
    return async (dispatch, getState) => {

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
                'X-RapidAPI-Key': config.apiKey
            }
        };

        try {
            const APIData = await fetch(`https://coinranking1.p.rapidapi.com/coin/${currencyUuid}/history?referenceCurrencyUuid=${fiatCurrencyUuid}&timePeriod=${timePeriod}`, options)

            const response = await APIData.json()

            const payload = await response.data

            dispatch({
                type: 'currencyHistory/setCurrencyHistory',
                payload: {
                    data: {
                        change: payload.change,
                        history: payload.history.reverse(),
                    },
                    isLoading: false,
                    hasError: false
                }
            })

        } catch {
            dispatch({
                type: 'currencyHistory/setCurrencyHistory',
                payload: {
                    data: {
                        change: 0,
                        history: [],
                    },
                    isLoading: false,
                    hasError: true
                }
            })
        }
    }
}

const options = {
    name: 'currencyHistory',
    initialState: {
        data: {
            change: 0,
            history: []
        },
        isLoading: true,
        hasError: false
    },
    reducers: {
        setCurrencyHistory(state, action) {
            return action.payload
        },
        emptyCurrencyHistory(state, action) {
            return {
                ...state,
                isLoading: true,
                data: action.payload
            }
        },
        setCurrencyHistoryLoading(state, action) {
            return {
                ...state,
                isLoading: action.payload
            }
        }
    }
}

export const currencyHistorySlice = createSlice(options)