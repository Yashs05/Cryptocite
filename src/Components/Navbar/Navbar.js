import React from 'react'
import { useSelector } from 'react-redux'
import RefCurrencyChanger from '../RefCurrencyChanger/RefCurrencyChanger'
import ThemeChanger from '../ThemeChanger/ThemeChanger'
import SearchBar from '../SearchBar/SearchBar'
import RegistrationModal from '../RegistrationModal/RegistrationModal'
import logo from '../../logo.png'
import './Navbar.css'
import { Link } from 'react-router-dom'

const selectThemeState = state => state.theme

const Navbar = () => {

    const theme = useSelector(selectThemeState)

    return (
        <div className={`d-flex align-items-center justify-content-between w-100 px-4 py-3 padding-x-less bg-secondary-${theme} navbar-border-${theme}`}>
            <div className='d-flex align-items-center'>
                <Link to={'/'} className='d-flex text-decoration-none'>
                    <img src={logo} alt='' className='logo'></img>
                    <span className='logo_text text-danger'>ryptocite</span>
                </Link>
            </div>

            <div className='d-flex navbar_components justify-content-between align-items-center'>
                <div className='searchbar-desktop me-3'>
                    <SearchBar bgColor={`bg-primary-${theme}`} />
                </div>
                <RefCurrencyChanger />
                <ThemeChanger />
                <RegistrationModal />
            </div>

        </div>
    )
}

export default Navbar
