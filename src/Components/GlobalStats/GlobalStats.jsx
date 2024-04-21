import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { repeatGlobalStatsAPICall } from '../../Context/APICaller'
import ReactPlaceholder from 'react-placeholder/lib'
import './globalStats.css'

const selectGlobalStatsState = state => [state.globalStats.list, state.globalStats.isLoading, state.globalStats.hasError]

const selectFiatCurrencyState = state => state.fiatCurrency

const selectThemeState = state => state.theme

const GlobalStats = () => {

    const dispatch = useDispatch()

    const [globalStats, isGlobalStatsLoading, globalStatsHasError] = useSelector(selectGlobalStatsState)

    const fiatCurrency = useSelector(selectFiatCurrencyState)

    const theme = useSelector(selectThemeState)

    useEffect(() => {
        const interval = setInterval(() => repeatGlobalStatsAPICall(dispatch, fiatCurrency), 30000)
        return () => clearInterval(interval)
    })

    if (globalStatsHasError === true) {
        return <div className='text-center px-5 mt-5'>Unable to get global stats</div>
    }

    return (
        <div className='global-stats-container px-4 pt-5 padding-x-less'>
            {isGlobalStatsLoading ?
                <div className='d-flex w-100'>
                    <div className={`px-5 py-5 global-stats-placeholders box-shadow-primary-${theme}`}>
                        <ReactPlaceholder type='text' ready={false} rows={3} color='#eeeeee' />
                    </div>
                    <div className={`px-5 py-5 global-stats-placeholders global-stats-placeholder-2 box-shadow-primary-${theme}`}>
                        <ReactPlaceholder type='text' ready={false} rows={3} color='#eeeeee' />
                    </div>
                    <div className={`px-5 py-5 global-stats-placeholders global-stats-placeholder-3 box-shadow-primary-${theme}`}>
                        <ReactPlaceholder type='text' ready={false} rows={3} color='#eeeeee' />
                    </div>
                </div> :
                <div className='d-flex justify-content-center global-stats'>
                    <div className={`d-flex flex-column px-3 py-4 stats_containers numbers_stats_container bg-secondary-${theme} box-shadow-primary-${theme}`}>
                        <h5 className='fw-bold'>Total Numbers</h5>
                        <div className='d-flex justify-content-between my-2'>
                            <span>Total Coins</span>
                            <span>{Number(globalStats.totalCoins).toLocaleString()}</span>
                        </div>
                        <div className='d-flex justify-content-between my-2'>
                            <span>Total Markets</span>
                            <span>{Number(globalStats.totalMarkets).toLocaleString()}</span>
                        </div>
                        <div className='d-flex justify-content-between my-2'>
                            <span>Total Exchanges</span>
                            <span>{Number(globalStats.totalExchanges).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className={`d-flex flex-column px-3 py-4 stats_containers market_stats_container bg-secondary-${theme} box-shadow-primary-${theme}`}>
                        <h5 className='fw-bold'>Market Statistics</h5>
                        <div className='d-flex justify-content-between my-2'>
                            <span>Market Cap</span>
                            <span>{(fiatCurrency.type === 'fiat' ? fiatCurrency.symbol + " " : "") + Number(globalStats.totalMarketCap).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + (fiatCurrency.type === 'coin' ? " " + fiatCurrency.code : "")}</span>
                        </div>
                        <div className='d-flex justify-content-between my-2'>
                            <span>Volume(24h)</span>
                            <span>{(fiatCurrency.type === 'fiat' ? fiatCurrency.symbol + " " : "") + Number(globalStats.total24hVolume).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + (fiatCurrency.type === 'coin' ? " " + fiatCurrency.code : "")}</span>
                        </div>
                        <div className='d-flex justify-content-between my-2'>
                            <span>Dominance</span>
                            <span>
                                <span className={`me-2 fw-bold color-secondary-${theme}`}>BTC</span>
                                <span>{Number(globalStats.btcDominance).toFixed(2) + '%'}</span>
                            </span>
                        </div>
                    </div>
                    <div className={`d-flex justify-content-between px-3 py-4 stats_containers coins_stats_container bg-secondary-${theme} box-shadow-primary-${theme}`}>
                        <div className='d-flex flex-column me-2'>
                            <h5 className='fw-bold'>Best Coins</h5>
                            {globalStats.bestCoins.map(coin => {
                                return (
                                    <div className='py-2' key={coin.symbol}>
                                        <Link to={`/${coin.name.replace(/ /g, '-')}`} >
                                            <img src={coin.iconUrl} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} className='me-1' />
                                            <span className='me-2'>
                                                {coin.name}</span>
                                            <span className={`fw-bold color-secondary-${theme}`}>
                                                {coin.symbol}
                                            </span>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>

                        <div className='d-flex flex-column ms-2'>
                            <h5 className='fw-bold'>Newest Coins</h5>
                            {globalStats.newestCoins.map(coin => {
                                return (
                                    <div className='py-2' key={coin.symbol}>
                                        <Link to={`/${coin.name.replace(/ /g, '-')}`} >
                                            <img src={coin.iconUrl} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} className='me-1' />
                                            <span className='me-2'>
                                                {coin.name}</span>
                                            <span className={`fw-bold color-secondary-${theme}`}>
                                                {coin.symbol}
                                            </span>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

export default GlobalStats
