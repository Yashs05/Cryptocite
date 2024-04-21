import { createSlice } from "@reduxjs/toolkit"
import config from "../config"

export const loadSearchResult = (searchTerm, fiatCurrencyUuid) => {
    return async (dispatch, getState) => {
        try {
            const APIData = await fetch(`https://coinranking1.p.rapidapi.com/search-suggestions?referenceCurrencyUuid=${fiatCurrencyUuid}&query=${searchTerm}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "coinranking1.p.rapidapi.com",
                    "x-rapidapi-key": config.apiKey
                }
            })

            const response = await APIData.json()

            const payload = await response.data.coins.filter(coin => coin.price)

            dispatch({
                type: 'searchResult/setSearchResult',
                payload: {
                    list: payload,
                    isLoading: false,
                    hasError: false
                }
            })
        }
        catch {
            dispatch({
                type: 'searchResult/setSearchResult',
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
    name: 'searchResult',
    initialState: {
        list: [],
        routerList: [],
        isLoading: null,
        hasError: false
    },
    reducers: {
        setSearchResult(state, action) {
            return {
                list: action.payload.list,
                routerList: state.routerList.concat(action.payload.list),
                isLoading: action.payload.isLoading,
                hasError: action.payload.hasError
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
export const searchResultSlice = createSlice(options)