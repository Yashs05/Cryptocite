import { createSlice } from "@reduxjs/toolkit";
import config from "../config";

export const loadRefCurrencyList = (value) => {
    return async (dispatch, getState) => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': config.apiKey,
                    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
                }
            };
            const APIData = await fetch(`https://coinranking1.p.rapidapi.com/reference-currencies?${value ? `search=${value}&` : ''}limit=20&offset=0`, options)
            const response = await APIData.json()

            dispatch({
                type: 'refCurrencyList/setCurrencyList',
                payload: {
                    currencyList: response.data.currencies,
                    currencyListOffset: 20,
                    total: response.data.stats.total,
                    isLoading: false,
                    hasError: false
                }
            })
        }
        catch {
            dispatch({
                type: 'refCurrencyList/setCurrencyList',
                payload: {
                    currencyList: [],
                    currencyListOffset: 0,
                    total: 0,
                    isLoading: false,
                    hasError: true
                }
            })
        }
    }
}

export const updateRefCurrencyList = (offset, value) => {
    return async (dispatch, getState) => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': config.apiKey,
                    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
                }
            };
            const APIData = await fetch(`https://coinranking1.p.rapidapi.com/reference-currencies?${value ? `search=${value}&` : ''}limit=20&offset=${offset}`, options)
            const response = await APIData.json()

            dispatch({
                type: 'refCurrencyList/updateCurrencyList',
                payload: {
                    currencyList: response.data.currencies,
                    currencyListOffset: offset + 20,
                    total: response.data.stats.total,
                    isLoading: false,
                    hasError: false
                }
            })
        }
        catch {
            dispatch({
                type: 'refCurrencyList/setLoadingState',
                payload: false
            })
        }
    }
}

const options = {
    name: 'refCurrencyList',
    initialState: {
        currencyList: [],
        currencyListOffset: 0,
        total: 0,
        isLoading: true,
        hasError: false
    },
    reducers: {
        setCurrencyList(state, action) {
            return action.payload
        },
        updateCurrencyList(state, action) {
            return {
                currencyList: state.currencyList.concat(action.payload.currencyList),
                currencyListOffset: action.payload.currencyListOffset,
                total: action.payload.total,
                isLoading: action.payload.isLoading
            }
        },
        setLoadingState(state, action) {
            return {
                ...state,
                isLoading: action.payload
            }
        }
    }
}

export const refCurrencyListSlice = createSlice(options)