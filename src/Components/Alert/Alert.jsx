import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './alert.css'

const selectThemeState = state => state.theme

const Alert = ({ alert }) => {

    const dispatch = useDispatch()

    const theme = useSelector(selectThemeState)

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch({
                type: 'alert/setAlert',
                payload: {
                    display: false,
                    message: '',
                    color: ''
                }
            })
        }, 3000)

        return () => {
            clearTimeout(timeout)
        }
    }, [dispatch])

    return (
        <>
            <div className={`alert px-4 py-2 text-white bg-${alert.color} box-shadow-secondary-${theme}`}>
                <i className={`${alert.color === 'success' ? 'fa-regular fa-circle-check' : 'fa-solid fa-triangle-exclamation'} me-2`}></i>
                <span>{alert.message}</span>
            </div>
        </>
    )
}

export default Alert