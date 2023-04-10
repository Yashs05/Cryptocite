import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-moment'
import { Chart as ChartJS, CategoryScale } from 'chart.js'
import SmallLoader from '../Loader/SmallLoader'
import { loadCurrencyHistory } from '../../Reducers/CurrencyHistoryReducer'

const selectCurrencyHistoryState = state => [state.currencyHistory.data, state.currencyHistory.isLoading]

const selectFiatCurrencyState = state => [state.fiatCurrency.uuid, state.fiatCurrency.code, state.fiatCurrency.symbol, state.fiatCurrency.type]

const selectThemeState = state => state.theme

ChartJS.register(CategoryScale)

const CurrencyChart = ({ currencyUuid, currTimePeriod }) => {

  const dispatch = useDispatch()

  const [gradient, setGradient] = useState(null)

  const [data, isCurrencyHistoryLoading] = useSelector(selectCurrencyHistoryState)

  const { history } = data

  const [fiatCurrencyUuid, fiatCurrencyCode, fiatCurrencySymbol, fiatCurrencyType] = useSelector(selectFiatCurrencyState)

  const theme = useSelector(selectThemeState)

  useEffect(() => {
    dispatch(loadCurrencyHistory(currencyUuid, fiatCurrencyUuid, currTimePeriod))
    const interval = setInterval(() => {
      dispatch(loadCurrencyHistory(currencyUuid, fiatCurrencyUuid, currTimePeriod))
    }, 60000)

    var ctx = document.getElementById('canvas').getContext("2d")
    var gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, '#33b5e5')
    gradient.addColorStop(1, theme === 'light' ? 'white' : '#172736')
    setGradient(gradient)
    return () => {
      clearInterval(interval)
      dispatch({
        type: 'currencyHistory/setCurrencyHistoryLoading',
        payload: true
      })
    }
  }, [currencyUuid, fiatCurrencyUuid, currTimePeriod, theme, dispatch])

  return (
    <div className='currency-chart-container'>
      <div className='w-100 px-4 position-relative padding-x-less currency-chart' style={{ height: '400px' }}>
        <Line id='canvas'
          data={{
            labels: history.map(label => (label.timestamp * 1000)),
            datasets: [
              {
                data: history.map(data => data.price),
                tension: '0.4',
                pointRadius: 0,
                borderColor: '#1266F1',
                pointHoverRadius: 5,
                borderWidth: 1.5,
                backgroundColor: gradient,
                fill: {
                  target: 'origin',
                }
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            spanGaps: true,
            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: function (tooltipItem, data) {
                    return (
                      (fiatCurrencyType === 'fiat' ? fiatCurrencySymbol + " " : '') +
                      (Number(tooltipItem.parsed.y) < 1 ? Number(tooltipItem.parsed.y).toFixed(20).match(/^-?\d*\.?0*\d{0,4}/)[0] : Number(tooltipItem.parsed.y).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) +
                      (fiatCurrencyType === 'coin' ? " " + fiatCurrencyCode : '')
                    )
                  }
                },
                backgroundColor: theme === 'light' ? 'white' : '#2b3945',
                borderColor: theme === 'light' ? '#d3d3d3' : '#37485a',
                borderWidth: 1,
                titleColor: theme === 'light' ? '#6c757d' : '#99a5af',
                titleFont: { family: "'Mulish', sans-serif", size: '13px' },
                bodyColor: theme === 'light' ? '#202c37' : '#e0e0e0',
                bodyFont: { family: "'Mulish', sans-serif", weight: 'bold', size: '16px' },
                padding: '20',
                displayColors: false,
                caretSize: 10
              },
              legend: false
            },
            scales: {
              y: {
                ticks: {
                  color: theme === 'light' ? '#6c757d' : '#99a5af',
                  font: {
                    family: "'Mulish', sans-serif",
                    weight: 'bold'
                  },
                  maxTicksLimit: 6,
                  maxRotation: 0,
                  callback: function (label) {
                    return Number(label) < 1 ? Number(label).toFixed(20).match(/^-?\d*\.?0*\d{0,4}/)[0] : Number(label).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  }
                },
                grid: {
                  color: theme === 'light' ? '#d3d3d3' : '#344455',
                  borderColor: theme === 'light' ? '#d3d3d3' : '#344455',
                  display: true,
                  drawOnChartArea: false
                }
              },
              x: {
                type: 'time',
                time: {
                  unit: currTimePeriod === '3h' ?
                    'minute' :
                    currTimePeriod === '24h' || currTimePeriod === '7d' ?
                      'hour' :
                      currTimePeriod === '30d' || currTimePeriod === '3m' ?
                        'day' :
                        currTimePeriod === '1y' || currTimePeriod === '3y' ?
                          'month' :
                          'year',

                  displayFormats: {
                    hour: currTimePeriod === '7d' ? 'MMM DD' : 'hh:mm A',
                    month: currTimePeriod === '1y' ? 'MMMM' : 'MMM YYYY'
                  }
                },
                ticks: {
                  color: theme === 'light' ? '#6c757d' : '#99a5af',
                  font: {
                    family: "'Mulish', sans-serif",
                    weight: 'bold'
                  },
                  maxTicksLimit: 6,
                  maxRotation: 0
                },
                grid: {
                  color: theme === 'light' ? '#d3d3d3' : '#344455',
                  borderColor: theme === 'light' ? '#d3d3d3' : '#344455',
                  display: true,
                  drawOnChartArea: false
                }
              }
            }
          }}
          height='100%'
          className={isCurrencyHistoryLoading ? 'opacity_manual' : 'opacity_initial'} />
        <SmallLoader loading={isCurrencyHistoryLoading} />
      </div>
    </div>
  )
}

export default CurrencyChart