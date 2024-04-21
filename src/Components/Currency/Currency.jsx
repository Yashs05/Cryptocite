import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { callCurrencyAPI } from '../../Context/APICaller'
import CurrencyChart from '../Charts/CurrencyChart'
import Loader from '../Loader/Loader'
import PriceConverter from '../PriceConverter/PriceConverter'
import CurrencySupply from '../CurrencySupply/CurrencySupply'
import TimeChanger from '../TimeChanger/TimeChanger'
import ReactHTMLParser from 'react-html-parser'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import './Currency.css'

const selectCurrencyState = state => [state.currency.data, state.currency.isLoading, state.currency.hasError]

const selectFiatCurrencyState = state => [state.fiatCurrency.code, state.fiatCurrency.symbol, state.fiatCurrency.uuid, state.fiatCurrency.type]

const selectCurrentTimeState = state => state.currentTime

const selectThemeState = state => state.theme

const selectUserState = state => state.user

const Currency = ({ id, name }) => {

    const dispatch = useDispatch()

    const [currencyData, isCurrencyLoading, currencyHasError] = useSelector(selectCurrencyState)

    const [fiatCurrencyCode, fiatCurrencySymbol, fiatCurrencyUuid, fiatCurrencyType] = useSelector(selectFiatCurrencyState)

    const currentTime = useSelector(selectCurrentTimeState)

    const theme = useSelector(selectThemeState)

    const { user, wishlistedUuids } = useSelector(selectUserState)

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
        callCurrencyAPI(dispatch, id, fiatCurrencyUuid)
        const interval = setInterval(() => {
            callCurrencyAPI(dispatch, id, fiatCurrencyUuid)
        }, 60000)

        return () => {
            clearInterval(interval)
            dispatch({
                type: 'currency/emptyCurrency',
                payload: []
            })
        }
    }, [dispatch, id, fiatCurrencyUuid])

    useEffect(() => {
        document.title = `${currencyData.symbol} live price, market cap, past performance.`
    }, [currencyData.symbol])

    if (currencyHasError) {
        return (
            <div className='text-center mt-5'>
                <div>{'Oops!! Unable to get live data for ' + name}</div>
                <div className='mt-2'>Please check your internet or try again after sometime.</div>
                <div className='mt-2'>
                    Back to&nbsp;
                    <Link to={'/'}>Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>
            {isCurrencyLoading === true ?
                <Loader /> :
                <>
                    <div className='d-flex justify-content-between w-100 px-4 py-5 currency-top-info padding-x-less'>
                        <div className='d-flex flex-column'>
                            <div className='d-flex align-items-center mb-2'>
                                <img src={currencyData.iconUrl} alt="" className="currency_icon" />
                                <h2 className='mb-0 ms-2 fw-bold'>{currencyData.name}</h2>
                                <span className={`fw-bold ms-2 px-2 rounded color-secondary-${theme} bg-currency-span1-${theme}`}>{currencyData.symbol}</span>
                                <i className={`${wishlistedUuids?.includes(id) ? 'fa-solid wishlisted' : 'fa-regular text-secondary'} fa-star ms-2 cursor-pointer`}
                                    onClick={() => wishlistedUuids?.includes(id) ? removeFromWishlist(id, currencyData.symbol) : addtoWishlist(id, currencyData.symbol)}></i>
                            </div>

                            <div className='d-flex align-items-center'>
                                <span className={`fw-bold rounded me-2 px-2 py-1 rank color-secondary-${theme} bg-currency-span2-${theme}`}>{`Rank #${currencyData.rank}`}</span>
                                <span className={`fw-bold rounded px-2 py-1 listed_on color-secondary-${theme} bg-currency-span2-${theme}`}>{`Listed on : ${new Date(currencyData.listedAt * 1000).toDateString()}`}</span>
                            </div>
                        </div>
                        <div className={`d-flex justify-content-between top_right_container border-primary-${theme}`}>
                            <div className='d-flex flex-column align-items-start justify-content-center px-4 py-3 border-right'>
                                <span className={`fw-bold color-secondary-${theme}`}>Price</span>
                                <h5 className='mb-0 fw-bold'>{(fiatCurrencyType === 'fiat' ? fiatCurrencySymbol + ' ' : '') +
                                    (Number(currencyData.price) < 1 ? Number(currencyData.price).toFixed(20).match(/^-?\d*\.?0*\d{0,4}/)[0].length <= 12 ? Number(currencyData.price).toFixed(20).match(/^-?\d*\.?0*\d{0,4}/)[0] : `0.00...${Number(currencyData.price).toFixed(20).match(/^-?\d*\.?0*\d{0,3}/)[0].slice(-3)}` : Number(currencyData.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) +
                                    (fiatCurrencyType === 'coin' ? ' ' + fiatCurrencyCode : '')
                                }</h5>
                            </div>

                            <div className='d-flex flex-column align-items-start justify-content-center border-right px-4 py-3'>
                                <span className={`fw-bold color-secondary-${theme}`}>24h(%)</span>
                                <h5 className={`mb-0 fw-bold ${currencyData.change === null ? 'text-secondary' : Number(currencyData.change) >= 0 ? 'price-up' : 'price-down'}`}>{currencyData.change ? currencyData.change + '%' : 'Not available'}</h5>
                            </div>

                            <div className='d-flex flex-column align-items-end justify-content-center px-4 py-3'>
                                <span className={`fw-bold color-secondary-${theme}`}>BTC Price</span>
                                <h5 className='mb-0 fw-bold'>{`${Number(currencyData.btcPrice) < 1 ? Number(currencyData.btcPrice).toFixed(20).match(/^-?\d*\.?0*\d{0,4}/)[0].length <= 8 ? Number(currencyData.btcPrice).toFixed(20).match(/^-?\d*\.?0*\d{0,4}/)[0] : `0.00...${Number(currencyData.btcPrice).toFixed(20).match(/^-?\d*\.?0*\d{0,3}/)[0].slice(-3)}` : Number(currencyData.btcPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BTC`}</h5>
                            </div>
                        </div>
                    </div>

                    <div className='d-flex justify-content-between align-items-center w-100 px-4 pb-5 padding-x-less'>
                        <h4 className='mb-0 fw-bold'>{`${currencyData.symbol} to ${fiatCurrencyCode} chart`}</h4>
                        <div className='timechanger-desktop'>
                            <TimeChanger />
                        </div>
                    </div>

                    <CurrencyChart currencyUuid={currencyData.uuid} currTimePeriod={currentTime} />

                    <div className='timechanger-mobile padding-x-less'>
                        <TimeChanger />
                    </div>

                    <div className='d-flex justify-content-between w-100 px-4 py-5 padding-x-less price-converter-supply-container'>
                        <PriceConverter />
                        <CurrencySupply uuid={currencyData.uuid} confirmed={currencyData.supply.confirmed} symbol={currencyData.symbol} />
                    </div>

                    <div className='d-flex justify-content-between w-100 px-4 padding-x-less value-stats-links-container'>

                        <div className='d-flex flex-column value_stats_container padding-x-less'>
                            <div className='mb-4'>
                                <h3 className='mb-1 fw-bold'>{`${currencyData.symbol} Value Statistics`}</h3>
                                <span className='currency_supply_span'>{'Shows the necessary relative information for ' + currencyData.symbol + ' like current price, market cap, volume etc.'}</span>
                            </div>

                            <table>
                                <tbody>
                                    <tr className={`d-flex justify-content-between py-3 navbar-border-${theme}`}>
                                        <th className='d-flex align-items-center fw-normal'>
                                            <i className="fa-solid fa-cent-sign me-2 value_stats_label_icons"></i>
                                            <span>{`Price to ${fiatCurrencyCode}`}</span>
                                        </th>
                                        <td className='fw-bold'>
                                            {(fiatCurrencyType === 'fiat' ? fiatCurrencySymbol + ' ' : '') +
                                                (Number(currencyData.price) < 1 ? Number(currencyData.price).toFixed(20).match(/^-?\d*\.?0*\d{0,4}/)[0] : Number(currencyData.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) +
                                                (fiatCurrencyType === 'coin' ? ' ' + fiatCurrencyCode : '')}
                                        </td>
                                    </tr>

                                    <tr className={`d-flex justify-content-between py-3 navbar-border-${theme}`}>
                                        <th className='d-flex align-items-center fw-normal'>
                                            <i className="fa-brands fa-bitcoin me-2 value_stats_label_icons"></i>
                                            <span>Price to BTC</span>
                                        </th>
                                        <td className='fw-bold'>
                                            {`${Number(currencyData.btcPrice) < 1 ? Number(currencyData.btcPrice).toFixed(20).match(/^-?\d*\.?0*\d{0,4}/)[0] : Number(currencyData.btcPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BTC`}
                                        </td>
                                    </tr>

                                    <tr className={`d-flex justify-content-between py-3 navbar-border-${theme}`}>
                                        <th className='d-flex align-items-center fw-normal'>
                                            <i className="fa-solid fa-ranking-star me-2 value_stats_label_icons"></i>
                                            <span>Rank(by Market Cap)</span>
                                        </th>
                                        <td className='fw-bold'>
                                            {currencyData.rank}
                                        </td>
                                    </tr>
                                    <tr className={`d-flex justify-content-between py-3 navbar-border-${theme}`}>
                                        <th className='d-flex align-items-center fw-normal'>
                                            <i className="fa-solid fa-sack-dollar me-2 value_stats_label_icons"></i>
                                            <span>Market Cap</span>
                                        </th>
                                        <td className='fw-bold'>
                                            {(fiatCurrencyType === 'fiat' ? fiatCurrencySymbol + ' ' : '') +
                                                Number(Number(currencyData.marketCap).toFixed(0)).toLocaleString() +
                                                (fiatCurrencyType === 'coin' ? ' ' + fiatCurrencyCode : '')}
                                        </td>
                                    </tr>
                                    <tr className={`d-flex justify-content-between py-3 navbar-border-${theme}`}>
                                        <th className='d-flex align-items-center fw-normal'>
                                            <i className="fa-solid fa-droplet me-2 value_stats_label_icons"></i>
                                            <span>24h Volume</span>
                                        </th>
                                        <td className='fw-bold'>
                                            {(fiatCurrencyType === 'fiat' ? fiatCurrencySymbol + ' ' : '') +
                                                Number(Number(currencyData['24hVolume']).toFixed(0)).toLocaleString() +
                                                (fiatCurrencyType === 'coin' ? ' ' + fiatCurrencyCode : '')}
                                        </td>
                                    </tr>
                                    <tr className={`d-flex justify-content-between py-3 navbar-border-${theme}`}>
                                        <th className='d-flex align-items-center fw-normal'>
                                            <i className="fa-solid fa-globe me-2 value_stats_label_icons"></i>
                                            <span>{`${currencyData.symbol} exchanges`}</span>
                                        </th>
                                        <td className='fw-bold'>
                                            {currencyData.numberOfExchanges}
                                        </td>
                                    </tr>
                                    <tr className={`d-flex justify-content-between py-3 navbar-border-${theme}`}>
                                        <th className='d-flex align-items-center fw-normal'>
                                            <i className="fa-solid fa-globe me-2 value_stats_label_icons"></i>
                                            <span>{`${currencyData.symbol} markets`}</span>
                                        </th>
                                        <td className='fw-bold'>
                                            {currencyData.numberOfMarkets}
                                        </td>
                                    </tr>
                                    <tr className='d-flex justify-content-between align-items-start py-3'>
                                        <th className='d-flex align-items-center fw-normal'>
                                            <i className="fa-solid fa-award me-2 value_stats_label_icons"></i>
                                            <span>All time highest</span>
                                        </th>
                                        <td className='d-flex flex-column align-items-end fw-bold'>
                                            <span>
                                                {'$' + (Number(currencyData.allTimeHigh.price) < 1 ? Number(currencyData.allTimeHigh.price).toFixed(20).match(/^-?\d*\.?0*\d{0,4}/)[0] : Number(currencyData.allTimeHigh.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
                                            </span>
                                            <span className='text-secondary all_time_high_span'>
                                                {`On ${new Date(currencyData.allTimeHigh.timestamp * 1000).toLocaleDateString()}`}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className='d-flex flex-column links_container padding-x-less'>
                            <h3 className='mb-4 fw-bold'>{`Useful ${currencyData.symbol} links`}</h3>
                            <table>
                                <tbody>
                                    {currencyData.links.map(item => {
                                        return (
                                            <tr key={currencyData.links.indexOf(item)} className={`d-flex justify-content-between ${currencyData.links.indexOf(item) === currencyData.links.length - 1 ? '' : `navbar-border-${theme}`}`}>
                                                <th className='flex-grow-1'>
                                                    <a href={item.url} target="_blank" rel="noreferrer" className='d-flex align-items-center fw-bold py-3 links'>
                                                        {item.type === 'website' ?
                                                            <i className='fa-solid fa-link me-2 links_label_icons'></i> :
                                                            item.type === 'bitcointalk' ?
                                                                <i className='fa-solid fa-bitcoin-sign me-2 links_label_icons'></i> :
                                                                item.type === 'explorer' ?
                                                                    <i className='fa-solid fa-cube me-2 links_label_icons'></i> :
                                                                    <i className={`fa-brands fa-${item.type} me-2 links_label_icons`}></i>
                                                        }
                                                        <span>{item.type.replace(item.type[0], item.type[0].toUpperCase())}</span>
                                                    </a>
                                                </th>
                                                <td>
                                                    <a href={item.url} target="_blank" rel="noreferrer" className='d-flex align-items-center py-3 links'>
                                                        {item.name}
                                                    </a>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='d-flex flex-column w-100 px-4 py-5 description_container padding-x-less'>
                        <h3 className='text-center fw-bold mb-3'>{`Know about ${currencyData.name}`}</h3>
                        {currencyData.description ?
                            ReactHTMLParser(currencyData.description.replace(/<h3>/g, '<h5>').replace(/<\/h3>/g, '</h5>')) :
                            <p className='text-center'>{`We're sorry to say that there is no description available for ${currencyData.name} currently. We will be adding some description as soon as we can get the same.`}</p>}
                    </div>

                    <div className='d-flex justify-content-center mb-3'>Made by &nbsp;<a href='https://www.linkedin.com/in/yashdeep-sharma-40534020a/'>Yash Sharma</a></div>
                </>
            }
        </>
    )
}

export default Currency
