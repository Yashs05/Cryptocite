import { loadCurrencyList } from '../Reducers/CurrencyListReducer'
import { loadCurrency } from '../Reducers/CurrencyReducer'
import { loadGlobalData } from '../Reducers/GlobalStatsReducer'

export const callAPIsOnInitialRender = (dispatch, fiatCurrency, offset, currentTime) => {
    dispatch(loadCurrencyList(fiatCurrency, offset, currentTime))
    dispatch(loadGlobalData(fiatCurrency))
}

export const repeatAPICalls = (dispatch, fiatCurrency, offset, currentTime) => {
    dispatch(loadCurrencyList(fiatCurrency, offset, currentTime))
}

export const repeatGlobalStatsAPICall = (dispatch, fiatCurrency, currentTime) => {
    dispatch(loadGlobalData(fiatCurrency, currentTime))
}

export const callCurrencyAPI = (dispatch, id, fiatCurrencyUuid) => {
    dispatch(loadCurrency(id, fiatCurrencyUuid))
}