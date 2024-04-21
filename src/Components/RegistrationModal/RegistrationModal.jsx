import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Login from './Login'
import Signup from './Signup'
import ProfileDrawer from '../ProfileSidebar/ProfileDrawer'
import Alert from '../Alert/Alert'
import './registrationModal.css'
import '../../Media.css'
import logo from '../../logo.png'
import userDefault from '../../userDefault.png'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import GoogleButton from 'react-google-button'
import { auth, db } from '../../firebase'
import { loadWishlist } from '../../Reducers/WishlistReducer'

const selectThemeState = state => state.theme

const selectUserState = state => state.user

const selectFiatCurrencyState = state => state.fiatCurrency

const selectAlertState = state => state.alert

const RegistrationModal = () => {

    const dispatch = useDispatch()

    const theme = useSelector(selectThemeState)

    const { user } = useSelector(selectUserState)

    const fiatCurrency = useSelector(selectFiatCurrencyState)

    const alert = useSelector(selectAlertState)

    const [display, setDisplay] = useState(false)

    const [displayState, setDisplayState] = useState('login')

    const [isOpen, setIsOpen] = useState(false)

    const googleProvider = new GoogleAuthProvider()

    const handleTabChange = () => {
        if (displayState === 'login') setDisplayState('signup')
        else setDisplayState('login')
    }

    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }

    const signInWithGoogle = () => {
        signInWithPopup(auth, googleProvider).then(() => {
            dispatch({
                type: 'alert/setAlert',
                payload: {
                    display: true,
                    message: 'Logged in successfully',
                    color: 'success'
                }
            })
        })
            .catch(err => {
                dispatch({
                    type: 'alert/setAlert',
                    payload: {
                        display: true,
                        message: err.message,
                        color: 'danger'
                    }
                })
            })
    }

    document.querySelector('body').style.overflowY = display === true || isOpen === true ? 'hidden' : 'auto'

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                if (user.emailVerified) {
                    dispatch({
                        type: 'user/setUser',
                        payload: user
                    })
                    setDisplay(false)
                    dispatch({
                        type: 'alert/setAlert',
                        payload: {
                            display: true,
                            message: 'Logged in successfully.',
                            color: 'success'
                        }
                    })
                }
                else {
                    dispatch({
                        type: 'user/setUser',
                        payload: null
                    })
                }
            }
            else {
                dispatch({
                    type: 'user/setUser',
                    payload: null
                })
            }
        })
    }, [dispatch])

    useEffect(() => {
        if (user) {
            const coinref = doc(db, 'wishlist', user?.uid)
            let snapshot = onSnapshot(coinref, coin => {
                if (coin.exists()) {
                    dispatch({
                        type: 'user/setWishlistedUuids',
                        payload: coin.data().coins
                    })
                    if (coin.data().coins?.length) {
                        dispatch(loadWishlist(coin.data().coins, fiatCurrency.uuid))
                    }
                    else {
                        dispatch({
                            type: 'wishlist/setWishlist',
                            payload: {
                                list: [],
                                isLoading: false,
                                hasError: false
                            }
                        })
                    }
                }
                else {
                    dispatch({
                        type: 'wishlist/setWishlist',
                        payload: {
                            list: [],
                            isLoading: false,
                            hasError: false
                        }
                    })
                }
            })

            return () => {
                snapshot()
            }
        }
    }, [user, fiatCurrency.uuid, dispatch])

    useEffect(() => {
        if (user) {
            const themeRef = doc(db, 'theme', user?.uid)
            let snapshot = onSnapshot(themeRef, theme => {
                if (theme.exists()) {
                    dispatch({
                        type: 'themeChanger/setTheme',
                        payload: theme.data().theme
                    })
                }
            })

            return () => {
                snapshot()
            }
        }
    }, [user, dispatch])

    return (
        <div>
            {user ?
                <>
                    <img src={user.photoURL || userDefault} alt="" referrerPolicy='no-referrer' className='avatar' onClick={toggleDrawer} />
                    {isOpen ?
                        <ProfileDrawer user={user} isOpen={isOpen} setIsOpen={setIsOpen} toggleDrawer={toggleDrawer} /> : ''}
                </> :
                <>
                    <button className='px-3 py-1 navbar-login-btn' onClick={() => setDisplay(!display)}>Log In</button>
                    {display ?
                        <div className={`registration-modal px-4 py-4 bg-secondary-${theme}`} >
                            <div className='d-flex justify-content-between align-items-center mx-2'>
                                <div className='d-flex '>
                                    <img src={logo} alt='' className='modal-logo'></img>
                                    <span className='modal-logo-text text-danger'>ryptocite</span>
                                </div>
                                <i className={`fa-solid fa-xmark d-flex justify-content-center align-items-center px-2 py-2 modal-close-logo bg-primary-${theme} border-primary-${theme}`} onClick={() => setDisplay(false)}></i>
                            </div>

                            <div className='d-flex justify-content-center my-4'>
                                <div className={`d-flex flex-column align-items-center w-50 px-3 py-2 me-2 login-signup-tabs bg-primary-${theme} hover-secondary-${theme} ${displayState === 'login' ? 'login-signup-active' : `border-primary-${theme}`}`} onClick={displayState === 'signup' ? handleTabChange : undefined}>
                                    <h5 className='mb-0'>Log In</h5>
                                    <span className={`color-secondary-${theme} login-signup-info`}>If you are registered already.</span>
                                </div>
                                <div className={`d-flex flex-column align-items-center w-50 px-3 py-2 ms-2 login-signup-tabs bg-primary-${theme} hover-secondary-${theme} ${displayState === 'signup' ? 'login-signup-active' : `border-primary-${theme}`}`} onClick={displayState === 'login' ? handleTabChange : undefined}>
                                    <h5 className='mb-0'>Sign Up</h5>
                                    <span className={`color-secondary-${theme} login-signup-info`}>If you are a new user.</span>
                                </div>
                            </div>

                            {displayState === 'login' ?
                                <Login user={user} display={display} setDisplay={setDisplay} /> :
                                <Signup user={user} display={display} setDisplay={setDisplay} />
                            }

                            <h5 className='my-3 d-flex justify-content-center'>OR</h5>

                            <div className='d-flex justify-content-center'>
                                <GoogleButton onClick={signInWithGoogle} />
                            </div>

                        </div> : ''
                    }
                    {display ?
                        <div className='body-overlay'></div> : ''
                    }
                </>
            }

            {alert.display ?
                <Alert alert={alert} /> : ''
            }
        </div>
    )
}

export default RegistrationModal