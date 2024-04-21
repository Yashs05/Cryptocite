import { useSelector, useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"
import './timeChanger.css'

const timePeriods = ['3h', '24h', '7d', '30d', '3m', '1y', '3y', '5y']

const selectCurrentTimeState = state => state.currentTime

const selectThemeState = state => state.theme

const TimeChanger = () => {

    const dispatch = useDispatch()

    const location = useLocation()

    const currentTime = useSelector(selectCurrentTimeState)

    const theme = useSelector(selectThemeState)

    const handleTimePeriodChange = item => {
        dispatch({
            type: 'currentTime/setCurrentTime',
            payload: item
        })

        if (location.pathname === '/') {
            dispatch({
                type: 'currencyList/setCurrencyListLoadingState',
                payload: true
            })
        }
        else {
            dispatch({
                type: 'currencyHistory/setCurrencyHistoryLoading',
                payload: true
            })
        }
    }

    return (
        <div className="times_container_div">
            <ul className={`d-flex justify-content-center px-1 py-1 my-0 times_container border-primary-${theme}`}>
                {timePeriods.map(time => {
                    return <li key={time} className={`px-2 py-1 mx-1 text-center times times-${theme} ${time === currentTime ? 'active' : undefined}`} onClick={time !== currentTime ? () => handleTimePeriodChange(time) : undefined}>{time}</li>
                })}
            </ul>
        </div>
    )
}

export default TimeChanger