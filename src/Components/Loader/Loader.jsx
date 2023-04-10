import React from 'react'
import './loader.css'
import logo from '../../logo.png'
import { useSelector } from 'react-redux'

const selectThemeState = state => state.theme

const Loader = () => {

    const theme = useSelector(selectThemeState)

    return (
        <div className='d-flex flex-column justify-content-center align-items-center pt-5 fw-bold'>
            <img src={logo} alt="" className='logo_loader'/>
            <div className={`loader_container mt-2 loader-container-${theme}`}>
                <span className='loader'></span>
            </div>
        </div>
    )
}

export default Loader
