import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { loadRefCurrencyList, updateRefCurrencyList } from '../../Reducers/RefCurrencyListReducer'
import './refCurrencyChanger.css'
import CurrencyChanger from '../CurrencyChanger/CurrencyChanger'

const selectRefCurrencyListState = state => [state.refCurrencyList.currencyList, state.refCurrencyList.currencyListOffset, state.refCurrencyList.total, state.refCurrencyList.isLoading, state.refCurrencyList.hasError]

const selectFiatCurrencyState = state => state.fiatCurrency

const RefCurrencyChanger = () => {

    const dispatch = useDispatch()

    const location = useLocation()

    const timer = useRef()

    const [value, setvalue] = useState('')

    const [refCurrencyList, refCurrencyListOffset, refCurrencyListTotal, isRefCurrencyListLoading, refCurrencyListHasError] = useSelector(selectRefCurrencyListState)

    const fiatCurrency = useSelector(selectFiatCurrencyState)

    const handleChangeCurrency = currency => {
        dispatch({
            type: 'fiatCurrency/setFiatCurrency',
            payload: {
                name: currency.name,
                code: currency.symbol,
                symbol: currency.sign,
                type: currency.type,
                uuid: currency.uuid
            }
        })

        if (location.pathname === '/') {
            dispatch({
                type: 'currencyList/setCurrencyListLoadingState',
                payload: true
            })
            dispatch({
                type: 'globalStats/setGlobalStatsLoadingState',
                payload: true
            })
            dispatch({
                type: 'currencyList/emptyCurrencyList',
                payload: []
            })
        }
        else {
        }
    }

    const loadMoreRefCurrencies = () => {
        dispatch({
            type: 'refCurrencyList/setLoadingState',
            payload: true
        })
        dispatch(updateRefCurrencyList(refCurrencyListOffset, value))
    }

    const handleInputChange = (e) => {
        setvalue(e.target.value)

        if (timer.current) {
            clearTimeout(timer.current)
        }
        timer.current = setTimeout(() => {
            dispatch({
                type: 'refCurrencyList/setLoadingState',
                payload: true
            })
            dispatch(loadRefCurrencyList(e.target.value))
        }, 500)
    }

    useEffect(() => {
        dispatch(loadRefCurrencyList())
    }, [dispatch])

    return (
        <CurrencyChanger value={value} refCurrency={fiatCurrency} refCurrencyList={refCurrencyList} refCurrencyListTotal={refCurrencyListTotal} isRefCurrencyListLoading={isRefCurrencyListLoading}
            refCurrencyListHasError={refCurrencyListHasError} loadMoreRefCurrencies={loadMoreRefCurrencies} handleInputChange={handleInputChange} handleChangeCurrency={handleChangeCurrency} id="scrollableDiv1"/>
    )
}

export default RefCurrencyChanger
