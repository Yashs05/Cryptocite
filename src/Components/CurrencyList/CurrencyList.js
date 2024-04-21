import { React, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { repeatAPICalls } from '../../Context/APICaller'
import { HomePageChart } from '../Charts/HomePageChart'
import TimeChanger from '../TimeChanger/TimeChanger'
import SmallLoader from '../Loader/SmallLoader'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import './CurrencyList.css'

const selectCurrencyListState = state => [state.currencyList.list, state.currencyList.orderDirection, state.currencyList.isLoading]

const selectGlobalStatsState = state => [state.globalStats.list.totalMarketCap]

const selectFiatCurrencyState = state => state.fiatCurrency

const selectCurrentTimeState = state => state.currentTime

const selectPaginationState = state => state.pagination.offset

const selectThemeState = state => state.theme

const selectUserState = state => state.user

export const CurrencyList = () => {

    const dispatch = useDispatch()

    const [currencyList, currencyListOrderDirection, loading] = useSelector(selectCurrencyListState)

    const globalMarketCap = useSelector(selectGlobalStatsState)

    const fiatCurrency = useSelector(selectFiatCurrencyState)

    const currentTime = useSelector(selectCurrentTimeState)

    const offset = useSelector(selectPaginationState)

    const theme = useSelector(selectThemeState)

    const { user, wishlistedUuids } = useSelector(selectUserState)

    const navBarHeaders = [null, '#', 'Name', 'Price', `${currentTime}%`, 'Market Cap', 'Volume(24h)', `Graph(${currentTime})`]

    const handleOrderDirectionChange = () => {
        dispatch({
            type: 'currencyList/setOrderDirection',
            payload: currencyListOrderDirection === 'desc' ? 'asc' : 'desc'
        })
    }

    const addtoWishlist = async (coinUuid, coinSymbol) => {
        if (user) {
            const coinRef = doc(db, 'wishlist', user.uid)

            try {
                await setDoc(coinRef, {
                    coins: wishlistedUuids ? [...wishlistedUuids, coinUuid] : [coinUuid]
                })
                dispatch({
                    type: 'alert/setAlert',
                    payload: {
                        display: true,
                        message: `${coinSymbol} added to wishlist.`,
                        color: 'success'
                    }
                })
            }
            catch (err) {
                dispatch({
                    type: 'alert/setAlert',
                    payload: {
                        display: true,
                        message: err.message,
                        color: 'danger'
                    }
                })
            }
        }
    }

    const removeFromWishlist = async (coinUuid, coinSymbol) => {
        if (user) {
            const coinRef = doc(db, 'wishlist', user.uid)

            try {
                await setDoc(coinRef, {
                    coins: wishlistedUuids.filter(coin => coin !== coinUuid)
                })
                dispatch({
                    type: 'alert/setAlert',
                    payload: {
                        display: true,
                        message: `${coinSymbol} removed from wishlist.`,
                        color: 'success'
                    }
                })
            }
            catch (err) {
                dispatch({
                    type: 'alert/setAlert',
                    payload: {
                        display: true,
                        message: err.message,
                        color: 'danger'
                    }
                })
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            repeatAPICalls(dispatch, fiatCurrency, offset, currentTime)
        }, 60000
        )
        return () => clearInterval(interval)
    }, [dispatch, fiatCurrency, offset, currentTime])

    useEffect(() => {
        document.title = 'Cryptocite - Get live updates of crypto currencies all across the world.'
    }, [])

    return (
        <div className='w-100 px-4 pt-5 currency_list_container padding-x-less'>

            <div className='d-flex justify-content-between align-items-center flex-wrap pb-3'>
                <div className='d-flex flex-column pb-2 pe-2'>
                    <h3 className='fw-bold'>Cryptocurrency Prices</h3>
                    <div className='fw-bold fs-small'>
                        Showing&nbsp;<span className='text-primary'>1000</span>&nbsp;results(by Market cap) from&nbsp;<a href='https://coinranking.com/' target='_blank' rel="noreferrer">Coinranking</a>
                    </div>
                </div>
                <TimeChanger />
            </div>

            <div className='w-100 position-relative currency_list_div'>
                <table className={`currency_list w-100 currency-list-border-${theme}`}>
                    <thead className={loading ? 'opacity_manual' : 'opacity_initial'}>
                        <tr className='navbar_row'>
                            {navBarHeaders.map((header, index) => {
                                return (
                                    <th key={navBarHeaders.indexOf(header)} onClick={header === '#' ? handleOrderDirectionChange : undefined} className={index === 2 ? `th-1 bg-primary-${theme}` : ''}>
                                        <div className={header === '#' ? 'cursor-pointer' : ''}>
                                            <span>{header}</span>
                                            {header === '#' ?
                                                <span className='ms-1'>
                                                    <i className={currencyListOrderDirection === 'desc' ? 'fa-solid fa-caret-down' : 'fa-solid fa-caret-up'}></i>
                                                </span> : undefined}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>

                    <tbody className={loading ? 'opacity_manual' : 'opacity_initial'}>
                        {currencyList.map(currency => {
                            return (
                                <tr key={currency.uuid} className={`hover-primary-${theme}`} >
                                    <td>
                                        <i className={`${wishlistedUuids?.includes(currency.uuid) ? 'fa-solid wishlisted' : 'fa-regular text-secondary'} fa-star fs-small cursor-pointer`} onClick={() => wishlistedUuids?.includes(currency.uuid, currency.symbol) ? removeFromWishlist(currency.uuid, currency.symbol) : addtoWishlist(currency.uuid, currency.symbol)}></i>
                                    </td>

                                    <td className='text-center'>{currency.rank}</td>

                                    <td className={`td-1 bg-currency-list-name-${theme}`}>
                                        <div>
                                            <Link to={`${currency.name.replace(/ /g, '-')}`} className='d-flex align-items-center currency_link'>
                                                <img src={currency.iconUrl} alt="" className='me-1' />
                                                <div className='d-flex align-items-center currency-info-div'>
                                                    <span>{currency.name}</span>
                                                    <span className={`ms-2 color-secondary-${theme} currency-symbol`}>{currency.symbol}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </td>

                                    <td>{currency.price === null ?
                                        <span className={`color-secondary-${theme}`}>Not Available</span> :
                                        ((fiatCurrency.type === 'fiat' ? fiatCurrency.symbol + " " : "") + (Number(currency.price) < 1 ? Number(currency.price).toFixed(20).match(/^-?\d*\.?0*\d{0,6}/)[0] : Number(currency.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) + (fiatCurrency.type === 'coin' ? " " + fiatCurrency.code : ""))
                                    }</td>

                                    <td className={Number(currency.change) >= 0 ? 'price-up' : 'price-down'}>{currency.change === null ?
                                        <span className={`color-secondary-${theme}`}>Not Available</span> :
                                        Number(currency.change).toFixed(2) + '%'
                                    }</td>

                                    <td>{currency.marketCap === null ?
                                        <span className={`color-secondary-${theme}`}>Not Available</span> :
                                        <div className='d-flex flex-column justify-content-center'>
                                            <span>{`${fiatCurrency.type === 'fiat' ? fiatCurrency.symbol : ""} ${Number(Number(currency.marketCap).toFixed(0)).toLocaleString()} ${fiatCurrency.type === 'coin' ? fiatCurrency.code : ""} `}</span>
                                            <span className={`relative_coin_percentage color-secondary-${theme}`} >{`(${Number((Number(currency.marketCap) * 100 / Number(globalMarketCap)).toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0].toLocaleString()) ? (Number(currency.marketCap) * 100 / Number(globalMarketCap)).toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0].toLocaleString() : '0.00'}%)`}</span>
                                        </div>
                                    }</td>

                                    <td>{currency['24hVolume'] === null ?
                                        <span className={`color-secondary-${theme}`}>Not Available</span> :
                                        <div className='d-flex flex-column justify-content-center align-items-end'>
                                            <span>{(fiatCurrency.type === 'fiat' ? fiatCurrency.symbol + " " : "") + (Number(currency['24hVolume']).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })) + (fiatCurrency.type === 'coin' ? " " + fiatCurrency.code : "")}</span>
                                            <span className={`converted_volume color-secondary-${theme}`} >{(Number(currency['24hVolume']) / Number(currency.price)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' ' + currency.symbol}</span>
                                        </div>
                                    }</td>

                                    <td>{
                                        currency.sparkline.filter(item => item === null).length > 10 ?
                                            <div className='d-flex justify-content-center w-100'>
                                                <i className={`fa fa-area-chart no_chart_icon color-secondary-${theme}`}></i>
                                            </div> :
                                            <div className='d-flex justify-content-end align-items-center'>
                                                <HomePageChart currency={currency} />
                                            </div>
                                    }
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <SmallLoader loading={loading} component='currencyList' />
            </div>
        </div>
    )
}
