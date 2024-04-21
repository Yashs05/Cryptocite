import { createSlice } from "@reduxjs/toolkit"
import config from "../config"

export const loadGlobalData = (fiatCurrency) => {
    return async (dispatch, getState) => {
        try {
            const APIData = await fetch(`https://coinranking1.p.rapidapi.com/stats?referenceCurrencyUuid=${fiatCurrency.uuid}`,
                {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "coinranking1.p.rapidapi.com",
                        "x-rapidapi-key": config.apiKey
                    }
                }
            )

            const response = await APIData.json()

            const payload = await response.data

            dispatch({
                type: 'globalStats/setGlobalStats',
                payload: {
                    list: payload,
                    isLoading: false,
                    hasError: false
                }
            })
        } catch {
            dispatch({
                type: 'globalStats/setGlobalStats',
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
    name: 'globalStats',
    initialState: {
        list: [],
        routerlist: [],
        isLoading: true,
        hasError: false
    },
    reducers: {
        setGlobalStats(state, action) {
            return {
                list: action.payload.list,
                routerlist: state.routerlist.concat(action.payload.list.bestCoins.concat(action.payload.list.newestCoins)),
                isLoading: action.payload.isLoading,
                hasError: action.payload.hasError
            }
        },
        setGlobalStatsLoadingState(state, action) {
            return {
                ...state,
                isLoading: action.payload
            }
        }
    }
}

export const globalStatsSlice = createSlice(options)