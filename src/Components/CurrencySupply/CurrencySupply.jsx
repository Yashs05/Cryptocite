import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import SmallLoader from '../Loader/SmallLoader'
import './currencySupply.css'
import config from '../../config'

const selectThemeState = state => state.theme

const CurrencySupply = ({ uuid, confirmed, symbol }) => {

    const [supplyData, setSupplyData] = useState({})

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState(false)

    const theme = useSelector(selectThemeState)

    useEffect(() => {

        const fetchSupplyData = async () => {
            try {
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': config.apiKey,
                        'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
                    }
                };

                const APIData = await fetch(`https://coinranking1.p.rapidapi.com/coin/${uuid}/supply`, options)

                const response = await APIData.json()

                const parsedResponse = await response.data.supply

                setSupplyData(parsedResponse)
                setLoading(false)
                setError(false)
            }
            catch {
                setLoading(false)
                setError(true)
            }
        }
        fetchSupplyData()

        const interval = setInterval(() => {
            fetchSupplyData()
        }, 60000)

        return () => {
            clearInterval(interval)
        }
    }, [uuid])

    return (
        <div className='d-flex flex-column currency_supply_container'>
            <div className='mb-4'>
                <h3 className='mb-1 fw-bold'>Supply Information</h3>
                <span>{`Shows the supply information of ` + symbol + ` like total supply, circulating supply etc.`}</span>
            </div>

            <div className={`px-4 py-3 supply_information bg-secondary-${theme} ${loading ? 'position-relative' : undefined}`}>
                {error ?
                    <div className='d-flex justify-content-center align-items-center h-100'>Unable to get supply information.</div> :
                    loading ? <SmallLoader loading={loading} /> :
                        <>
                            <div className={`d-flex justify-content-between pb-3 navbar-border-${theme}`}>
                                <div className='d-flex flex-column justify-content-center'>
                                    <div className='d-flex align-items-center mb-1'>
                                        <span>Supply status :&nbsp;</span>
                                        <span className={`d-flex align-items-center ${confirmed ? 'price-up' : 'text-warning'}`}>
                                            <span>{confirmed ? 'Verified' : 'Not verified'}</span>
                                            <i className={`fa-solid ${confirmed ? 'fa-circle-check' : 'fa-triangle-exclamation'} ms-1`}></i>
                                        </span>
                                    </div>
                                    <div className='d-flex align-items-center mt-2'>
                                        <span>Last updated at :&nbsp;</span>
                                        <span>{supplyData.totalSyncedAt === 'Fixed' ? 'Updated manually' : new Date(Number(supplyData.totalSyncedAt)).toLocaleTimeString()}</span>
                                    </div>
                                </div>

                                <svg width="100" height="100">
                                    <text x="50" y="57" textAnchor="middle" fill={theme === 'light' ? '#202c37' : '#e0e0e0'} className='fw-bold'>{Number((supplyData.circulatingAmount * 100) / supplyData.totalAmount).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "%"}</text>
                                    <circle cx="50" cy="50" r="47" stroke="#dc3545" strokeWidth="5" strokeDasharray="295.310" strokeDashoffset={((((supplyData.totalAmount - supplyData.circulatingAmount) * 100) / supplyData.totalAmount) / 100) * 295.310} strokeLinecap='round' fill='none' className='supply_percentage_circle' />
                                    <circle cx="50" cy="50" r="47" stroke="#dc35458c" strokeWidth="5" fill='none' />
                                </svg>
                            </div>

                            <table className='w-100'>
                                <tbody>
                                    <tr className={`d-flex justify-content-between py-3 navbar-border-${theme}`}>
                                        <th className='me-2 fw-normal'>Circulating supply</th>
                                        <td className='fw-bold'>{Number(Number(supplyData.circulatingAmount).toFixed(0)).toLocaleString() + " " + symbol}</td>
                                    </tr>

                                    {!supplyData.maxAmount ?
                                        <tr className={`d-flex justify-content-between py-3 navbar-border-${theme}`}>
                                            <th className='me-2 fw-normal'>Non circulating supply</th>
                                            <td className='fw-bold'>{Number((Number(supplyData.circulatingAmount) - Number(supplyData.totalAmount)).toFixed(0)).toLocaleString() + " " + symbol}</td>
                                        </tr> : undefined
                                    }

                                    <tr className={`d-flex justify-content-between py-3 navbar-border-${theme}`}>
                                        <th className='me-2 fw-normal'>Total supply</th>
                                        <td className='fw-bold'>{Number(Number(supplyData.totalAmount).toFixed(0)).toLocaleString() + " " + symbol}</td>
                                    </tr>

                                    {supplyData.maxAmount ?
                                        <tr className='d-flex justify-content-between py-3'>
                                            <th className='me-2 fw-normal'>Maximum supply</th>
                                            <td className='fw-bold'>{Number(Number(supplyData.maxAmount).toFixed(0)).toLocaleString() + " " + symbol}</td>
                                        </tr> : undefined
                                    }
                                </tbody>
                            </table>
                        </>
                }
            </div>
        </div>
    )
}

export default CurrencySupply