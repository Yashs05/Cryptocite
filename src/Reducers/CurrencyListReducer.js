import { createSlice } from "@reduxjs/toolkit"
import config from "../config"

export const loadCurrencyList = (fiatCurrency, offset, timePeriod) => {
    return async (dispatch, getState) => {

        try {
            const APIData = await fetch(`https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=${fiatCurrency.uuid}&timePeriod=${timePeriod}&tiers=1%2C2&orderBy=marketCap&orderDirection=desc&limit=100&offset=${offset}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "coinranking1.p.rapidapi.com",
                    "x-rapidapi-key": config.apiKey
                }
            })

            const response = await APIData.json()

            const payload = await response.data.coins

            dispatch({
                type: 'currencyList/setCurrencyList',
                payload: {
                    list: payload,
                    isLoading: false,
                    hasError: false
                }
            })
        } catch {
            dispatch({
                type: 'currencyList/setCurrencyList',
                payload: {
                    list: [],
                    isLoading: false,
                    hasError: true
                }
            })
        }
    }
}

const options = {
    name: 'currencyList',
    initialState: {
        list: [],
        isLoading: true,
        hasError: false,
        orderDirection: 'desc'
    },
    reducers: {
        setCurrencyList(state, action) {
            return {
                ...action.payload,
                list: state.orderDirection === 'desc' ? action.payload.list : [...action.payload.list].reverse(),
                orderDirection: state.orderDirection
            }
        },
        setOrderDirection(state, action) {
            return {
                ...state,
                list: [...state.list].reverse(),
                orderDirection: action.payload
            }
        },
        setCurrencyListLoadingState(state, action) {
            return {
                ...state,
                isLoading: action.payload
            }
        },
        emptyCurrencyList(state, action) {
            return {
                ...state,
                list: action.payload
            }
        }
    }
}

export const currencyListSlice = createSlice(options)