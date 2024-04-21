import { createSlice } from "@reduxjs/toolkit";
import config from "../config";

export const loadWishlist = (coinlist, fiatCurrencyUuid) => {
    return async (dispatch, getState) => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': config.apiKey,
                    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
                }
            };

            const APIData = await fetch(`https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=${fiatCurrencyUuid}&timePeriod=24h&${coinlist?.map((coin, index) => `uuids%5B${index}%5D=${coin}&`).join('')}tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0`, options)

            const response = await APIData.json()

            const payload = await response.data.coins

            dispatch({
                type: 'wishlist/setWishlist',
                payload: {
                    list: payload,
                    isLoading: false,
                    hasError: false
                }
            })
        }
        catch {
            dispatch({
                type: 'wishlist/setWishlist',
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
    name: 'wishlist',
    initialState: {
        list: [],
        isLoading: true,
        hasError: false
    },
    reducers: {
        setWishlist(state, action) {
            return action.payload
        }
    }
}

export const wishlistSlice = createSlice(options)