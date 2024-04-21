import { createSlice } from "@reduxjs/toolkit"
import config from "../config"

export const loadConvertedPrice = (currencyUuid, refCurrencyUuid, date) => {

    return async (dispatch, getState) => {
        try {

            const APIData = await fetch(`https://coinranking1.p.rapidapi.com/coin/${currencyUuid}/price?${date ? `referenceCurrencyUuid=${refCurrencyUuid}&timestamp=${date}` : `referenceCurrencyUuid=${refCurrencyUuid}`}`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': config.apiKey,
                    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
                }
            })

            const response = await APIData.json()

            const payload = await response.data.price

            dispatch({
                type: 'currencyConverter/setConvertedPrice',
                payload: {
                    price: payload,
                    isLoading: false,
                    hasError: false
                }
            })
        }
        catch {
            dispatch({
                type: 'currencyConverter/setConvertedPrice',
                payload: {
                    price: '0',
                    isLoading: false,
                    hasError: true
                }
            })
        }
    }
}

export const loadCurrencyLists = (value, listToUpdate) => {

    return async (dispatch, getState) => {
        try {

            const APIData = await fetch(`https://coinranking1.p.rapidapi.com/reference-currencies?${value ? `search=${value}&` : undefined}limit=20&offset=0`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': config.apiKey,
                    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
                }
            })

            const response = await APIData.json()

            const payload = await response.data

            switch (listToUpdate) {

                case 'currencyList':
                    dispatch({
                        type: 'currencyConverter/setCurrencyList',
                        payload: {
                            list: payload.currencies,
                            total: payload.stats.total,
                            offset: 20,
                            isLoading: false,
                            hasError: false
                        }
                    })
                    break

                case 'refCurrencyList':
                    dispatch({
                        type: 'currencyConverter/setRefCurrencyList',
                        payload: {
                            list: payload.currencies,
                            total: payload.stats.total,
                            offset: 20,
                            isLoading: false,
                            hasError: false
                        }
                    })
                    break

                default:
                    dispatch({
                        type: 'currencyConverter/setCurrencyLists',
                        payload: {
                            list: payload.currencies,
                            total: payload.stats.total,
                            offset: 20,
                            isLoading: false,
                            hasError: false
                        }
                    })
            }
        }
        catch(err) {
            console.log(err.message)
        }
    }
}

export const updateCurrencyLists = (value, offset, listToUpdate) => {

    return async (dispatch, getState) => {
        try {

            const APIData = await fetch(`https://coinranking1.p.rapidapi.com/reference-currencies?${value ? `search=${value}&` : undefined}limit=20&offset=${offset}`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': config.apiKey,
                    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
                }
            })

            const response = await APIData.json()

            const payload = await response.data

            switch (listToUpdate) {

                case 'currencyList':
                    dispatch({
                        type: 'currencyConverter/updateCurrencyList',
                        payload: {
                            list: payload.currencies,
                            total: payload.stats.total,
                            isLoading: false,
                            hasError: false
                        }
                    })
                    break;

                case 'refCurrencyList':
                    dispatch({
                        type: 'currencyConverter/updateRefCurrencyList',
                        payload: {
                            list: payload.currencies,
                            total: payload.stats.total,
                            isLoading: false,
                            hasError: false
                        }
                    })
                    break;

                    default :
            }
        }
        catch {

        }
    }
}

const options = {
    name: 'currencyConverter',
    initialState: {
        convertedPrice: 0,
        isPriceLoading: true,
        priceHasError: false,

        currencyList: [],
        currencyListOffset: 0,
        currencyListTotal: 0,
        isCurrencyListLoading: true,
        currencyListhasError: false,

        refCurrencyList: [],
        refCurrencyListOffset: 0,
        refCurrencyListTotal: 0,
        isrefCurrencyListLoading: true,
        refCurrencyListhasError: false
    },
    reducers: {
        setConvertedPrice(state, action) {
            return {
                ...state,
                convertedPrice: action.payload.price,
                isPriceLoading: action.payload.isLoading,
                priceHasError: action.payload.hasError
            }
        },

        setConvertedPriceLoading(state, action) {
            return {
                ...state,
                isPriceLoading: action.payload
            }
        },

        setCurrencyLists(state, action) {
            return {
                ...state,

                currencyList: action.payload.list,
                currencyListOffset: action.payload.offset,
                currencyListTotal: action.payload.total,
                isCurrencyListLoading: action.payload.isLoading,
                currencyListhasError: action.payload.hasError,

                refCurrencyList: action.payload.list,
                refCurrencyListOffset: action.payload.offset,
                refCurrencyListTotal: action.payload.total,
                isRefCurrencyListLoading: action.payload.isLoading,
                refCurrencyListhasError: action.payload.hasError
            }
        },

        setCurrencyList(state, action) {
            return {
                ...state,
                currencyList: action.payload.list,
                currencyListOffset: action.payload.offset,
                currencyListTotal: action.payload.total,
                isCurrencyListLoading: action.payload.isLoading,
                currencyListhasError: action.payload.hasError,
            }
        },

        setRefCurrencyList(state, action) {
            return {
                ...state,
                refCurrencyList: action.payload.list,
                refCurrencyListOffset: action.payload.offset,
                refCurrencyListTotal: action.payload.total,
                isRefCurrencyListLoading: action.payload.isLoading,
                refCurrencyListhasError: action.payload.hasError,
            }
        },

        updateCurrencyList(state, action) {
            return {
                ...state,
                currencyList: state.currencyList.concat(action.payload.list),
                currencyListOffset: state.currencyListOffset + 20,
                currencyListTotal: action.payload.total,
                isCurrencyListLoading: action.payload.isLoading,
                currencyListhasError: action.payload.hasError,
            }
        },

        updateRefCurrencyList(state, action) {
            return {
                ...state,
                refCurrencyList: state.refCurrencyList.concat(action.payload.list),
                refCurrencyListOffset: state.refCurrencyListOffset + 20,
                refCurrencyListTotal: action.payload.total,
                isRefCurrencyListLoading: action.payload.isLoading,
                refCurrencyListhasError: action.payload.hasError
            }
        },

        setCurrencyListLoadingState(state, action) {
            return {
                ...state,
                isCurrencyListLoading: action.payload
            }
        },

        setRefCurrencyListLoadingState(state, action) {
            return {
                ...state,
                isRefCurrencyListLoading: action.payload
            }
        }
    }
}

export const priceConverterSlice = createSlice(options)