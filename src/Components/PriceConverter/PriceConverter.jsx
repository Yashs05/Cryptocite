import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { loadConvertedPrice, loadCurrencyLists, updateCurrencyLists } from '../../Reducers/PriceConverterReducer'
import './priceConverter.css'
import { useDispatch } from 'react-redux'
import CurrencyChanger from '../CurrencyChanger/CurrencyChanger'
import SmallLoader from '../Loader/SmallLoader'

const selectCurrencyState = state => [state.currency.data.symbol, state.currency.data.uuid]

const selectFiatCurrencyState = state => [state.fiatCurrency.code, state.fiatCurrency.uuid]

const selectPriceConverterState = state => state.priceConverter

const selectThemeState = state => state.theme

const PriceConverter = () => {

    const dispatch = useDispatch()

    const timer1 = useRef()

    const timer2 = useRef()

    const [currencyCode, currencyUuid] = useSelector(selectCurrencyState)

    const [refCurrencyCode, refCurrencyUuid] = useSelector(selectFiatCurrencyState)

    const { convertedPrice, isPriceLoading, priceHasError, currencyList, currencyListOffset, currencyListTotal, isCurrencyListLoading, currencyListhasError,
        refCurrencyList, refCurrencyListOffset, refCurrencyListTotal, isRefCurrencyListLoading, refCurrencyListhasError } = useSelector(selectPriceConverterState)

    const theme = useSelector(selectThemeState)

    const [value1, setValue1] = useState(1.00)

    const [value2, setValue2] = useState(convertedPrice)

    const [searchValue1, setSearchValue1] = useState('')

    const [searchValue2, setSearchValue2] = useState('')

    const [date, setDate] = useState(new Date().getTime())

    const [dateInputValue, setDateInputValue] = useState(new Date().toLocaleDateString('en-CA'))

    const oldestDate = new Date(new Date().setFullYear(new Date().getFullYear() - 5))

    const [currentCurrency, setCurrentCurrency] = useState({
        code: currencyCode,
        uuid: currencyUuid
    })

    const [currentRefCurrency, setCurrentRefCurrency] = useState({
        code: refCurrencyCode,
        uuid: refCurrencyUuid
    })

    const handleCurrencyChange = currency => {
        setCurrentCurrency({
            code: currency.symbol,
            uuid: currency.uuid
        })
        dispatch({
            type: 'currencyConverter/setConvertedPriceLoading',
            payload: true
        })
    }

    const handleRefCurrencyChange = currency => {
        setCurrentRefCurrency({
            code: currency.symbol,
            uuid: currency.uuid
        })
        dispatch({
            type: 'currencyConverter/setConvertedPriceLoading',
            payload: true
        })
    }

    const handleCurrencySwap = () => {
        setCurrentCurrency({
            code: currentRefCurrency.code,
            uuid: currentRefCurrency.uuid
        })

        setCurrentRefCurrency({
            code: currentCurrency.code,
            uuid: currentCurrency.uuid
        })
    }

    const handleInput1Change = (e) => {
        setValue1(e.target.value)
        setValue2(Number(convertedPrice * e.target.value) < 1 ? Number(Number(convertedPrice * e.target.value).toFixed(20).match(/^-?\d*\.?0*\d{0,6}/)[0]) : Number(Number(convertedPrice * e.target.value).toFixed(2)))
    }

    const handleInput2Change = (e) => {
        setValue2((e.target.value))
        setValue1(Number(e.target.value / convertedPrice) < 1 ? Number(Number(e.target.value / convertedPrice).toFixed(20).match(/^-?\d*\.?0*\d{0,6}/)[0]) : Number(Number(e.target.value / convertedPrice).toFixed(2)))
    }

    const handleSearchValue1Change = (e) => {
        setSearchValue1(e.target.value)

        if (timer1.current) {
            clearTimeout(timer1.current)
        }
        timer1.current = setTimeout(() => {
            dispatch({
                type: 'currencyConverter/setCurrencyListLoadingState',
                payload: true
            })
            dispatch(loadCurrencyLists(e.target.value, 'currencyList'))
        }, 500)
    }

    const handleSearchValue2Change = (e) => {
        setSearchValue2(e.target.value)

        if (timer2.current) {
            clearTimeout(timer2.current)
        }
        timer2.current = setTimeout(() => {
            dispatch({
                type: 'currencyConverter/setRefCurrencyListLoadingState',
                payload: true
            })
            dispatch(loadCurrencyLists(e.target.value, 'refCurrencyList'))
        }, 500)
    }

    const handleLatestBtnClick = () => {
        setDate(new Date().getTime())
        setDateInputValue(new Date().toLocaleDateString('en-CA'))
        dispatch({
            type: 'currencyConverter/setConvertedPriceLoading',
            payload: true
        })
    }

    const handleOldestBtnClick = () => {
        setDate(new Date().setFullYear(new Date().getFullYear() - 5))
        setDateInputValue(new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toLocaleDateString('en-CA'))
        dispatch({
            type: 'currencyConverter/setConvertedPriceLoading',
            payload: true
        })
    }

    const loadMoreCurrencies = () => {
        dispatch({
            type: 'currencyConverter/setCurrencyListLoadingState',
            payload: true
        })
        dispatch(updateCurrencyLists(searchValue1, currencyListOffset, 'currencyList'))
    }

    const loadMoreRefCurrencies = () => {
        dispatch({
            type: 'currencyConverter/setRefCurrencyListLoadingState',
            payload: true
        })
        dispatch(updateCurrencyLists(searchValue2, refCurrencyListOffset, 'refCurrencyList'))
    }

    useEffect(() => {
        dispatch(loadConvertedPrice(currentCurrency.uuid, currentRefCurrency.uuid, date / 1000))
        setValue2(Number(value1 * convertedPrice) < 1 ? Number(Number(value1 * convertedPrice).toFixed(20).match(/^-?\d*\.?0*\d{0,6}/)[0]) : Number(Number(value1 * convertedPrice).toFixed(2)))
        dispatch(loadCurrencyLists())
    }, [dispatch, currentCurrency.uuid, currentRefCurrency.uuid, convertedPrice, date])

    return (
        <div className='price_converter_container'>

            <div className='mb-4'>
                <h3 className='mb-1 fw-bold'>Calculator</h3>
                <span>Use the calculator to convert prices between available crypto and fiat currencies at any available point of time.</span>
            </div>

            <div className='w-100 d-flex justify-content-center'>
                <div className='d-flex flex-column align-items-center price-converter w-100'>
                    <div className={`w-100 ${isPriceLoading ? 'position-relative' : ''}`}>
                        <div className={`d-flex w-100 ${isPriceLoading ? 'opacity_manual' : 'opacity_initial'}`}>
                            <input type="text" value={isNaN(value1) ? 0 : value1}
                                className={`fw-bold px-3 py-2 color-primary-${theme} border-primary-${theme}`} onChange={e => handleInput1Change(e)} />
                            <CurrencyChanger value={searchValue1} refCurrency={currentCurrency} refCurrencyList={currencyList} refCurrencyListTotal={currencyListTotal} isRefCurrencyListLoading={isCurrencyListLoading}
                                refCurrencyListHasError={currencyListhasError} loadMoreRefCurrencies={loadMoreCurrencies} handleInputChange={handleSearchValue1Change} handleChangeCurrency={handleCurrencyChange} id="scrollableDiv2" />
                        </div>
                        <SmallLoader loading={isPriceLoading} />
                    </div>

                    <div className='my-3'>
                        <i className={`fa-solid fa-right-left mx-3 swap_icon bg-swap-${theme}`} onClick={handleCurrencySwap}></i>
                    </div>

                    <div className={`w-100 ${isPriceLoading ? 'position-relative' : ''}`}>
                        <div className={`d-flex w-100 ${isPriceLoading ? 'opacity_manual' : 'opacity_initial'}`}>
                            <input type="text" value={isNaN(value2) ? 0 : value2}
                                className={`fw-bold px-3 py-2 color-primary-${theme} border-primary-${theme}`} onChange={e => handleInput2Change(e)} />
                            <CurrencyChanger value={searchValue2} refCurrency={currentRefCurrency} refCurrencyList={refCurrencyList} refCurrencyListTotal={refCurrencyListTotal} isRefCurrencyListLoading={isRefCurrencyListLoading}
                                refCurrencyListHasError={refCurrencyListhasError} loadMoreRefCurrencies={loadMoreRefCurrencies} handleInputChange={handleSearchValue2Change} handleChangeCurrency={handleRefCurrencyChange} id="scrollableDiv3" />
                        </div>
                        <SmallLoader loading={isPriceLoading} />

                        <div className={`text-warning position-absolute ${priceHasError ? '' : 'd-none'}`}>
                            <i className="fa-solid fa-triangle-exclamation me-1"></i>
                            <span>Price not availabe for the required date</span>
                        </div>
                    </div>

                    <div className={`d-flex justify-content-between w-100 mt-5 date_container date-container-${theme}`}>
                        <button type="button" className={`px-4 py-2 date_button ${new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0) ? 'btn_not_active' : 'btn_active'}`} onClick={handleLatestBtnClick} disabled={new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0) ? true : false}>
                            Latest
                        </button>
                        <button type="button" className='px-4 py-2 mx-3 date_button' onClick={handleOldestBtnClick} disabled={new Date(date).setHours(0, 0, 0, 0) === new Date(oldestDate).setHours(0, 0, 0, 0) ? true : false}>
                            Oldest
                        </button>
                        <input type="date" value={dateInputValue} className={`px-3 py-2 fw-bold date_input color-primary-${theme} border-primary-${theme}`} onChange={e => {
                            setDate(new Date(e.target.value).getTime())
                            setDateInputValue(e.target.value)
                            dispatch({
                                type: 'currencyConverter/setConvertedPriceLoading',
                                payload: true
                            })
                        }} />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PriceConverter