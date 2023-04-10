import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Drawer from 'react-modern-drawer'
import { signOut, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase'
import './profileSidebar.css'
import 'react-modern-drawer/dist/index.css'
import userDefault from '../../userDefault.png'
import { loadWishlist } from '../../Reducers/WishlistReducer'
import SmallLoader from '../Loader/SmallLoader'

const selectThemeState = state => state.theme

const selectWishlistState = state => [state.wishlist.list, state.wishlist.isLoading, state.wishlist.hasError]

const selectUserState = state => state.user

const selectFiatCurrencyState = state => state.fiatCurrency

const ProfileDrawer = ({ user, isOpen, setIsOpen, toggleDrawer }) => {

    const dispatch = useDispatch()

    const theme = useSelector(selectThemeState)

    const [wishlist, isWishlistLoading, wishlistHasError] = useSelector(selectWishlistState)

    const { wishlistedUuids } = useSelector(selectUserState)

    const fiatCurrency = useSelector(selectFiatCurrencyState)

    const [name, setName] = useState(user.displayName)

    const [updatingName, setUpdatingName] = useState(false)

    const handleNameEdit = () => {
        setUpdatingName(true)
    }

    const handleChangeApply = () => {
        if (name.length >= 3) {
            updateProfile(user, {
                displayName: name
            })
            setUpdatingName(false)
        }
    }

    const handleCancel = () => {
        setName(user.displayName)
        setUpdatingName(false)
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

    const logOut = () => {
        signOut(auth)
        setIsOpen(false)
        dispatch({
            type: 'wishlist/setWishlist',
            payload: {
                list: [],
                isLoading: false,
                hasError: false
            }
        })
        dispatch({
            type: 'user/setWishlistedUuids',
            payload: null
        })
        dispatch({
            type: 'alert/setAlert',
            payload: {
                display: true,
                message: 'Logged out successfully.',
                color: 'success'
            }
        })
    }

    useEffect(() => {
        if (user) {
            if (wishlistedUuids) {
                const interval = setInterval(() => {
                    dispatch(loadWishlist(wishlistedUuids, fiatCurrency.uuid))
                }, 60000)

                return () => {
                    clearTimeout(interval)
                }
            }
        }
    }, [user, wishlistedUuids, fiatCurrency.uuid, dispatch])

    console.log(wishlistedUuids)

    return (
        <Drawer
            open={isOpen}
            onClose={toggleDrawer}
            direction='right'
            className='d-flex flex-column align-items-center justify-content-between px-4 py-3 fw-bold profile-drawer'
            style={{ backgroundColor: theme === 'light' ? 'white' : '#2b3945', width: '40%' }}
        >
            <div className='w-100'>
                <div className='w-100 d-flex flex-column align-items-center'>
                    <img src={user.photoURL || userDefault} alt="" referrerPolicy='no-referrer' className='drawer-avatar' />
                    <div className='d-flex flex-column align-items-center w-100 my-3'>
                        {!updatingName ?
                            <div className='d-flex align-items-center my-1'>
                                <h5 className='mb-0 me-2'>{name}</h5>
                                <i className={`fa-solid fa-pen-to-square name-edit color-secondary-${theme}`} onClick={handleNameEdit} ></i>
                            </div> :
                            <div className='d-flex flex-column align-items-center w-100 my-1'>
                                <input type="text" value={name} className={`px-2 py-2 input-${theme} border-primary-${theme} bg-primary-${theme} border-radius-5`} onChange={e => setName(e.target.value)} />
                                <div className='d-flex w-100 mt-3'>
                                    <button onClick={handleChangeApply} className='changes-btn px-2 py-1 me-2 border-radius-5 fw-normal'>Update</button>
                                    <button onClick={handleCancel} className={`cancel-btn px-2 py-1 fw-normal color-secondary-${theme}`}>Cancel</button>
                                </div>
                                {name.length < 3 ?
                                    <span className='w-100 text-start text-danger fs-small mt-1'>Name should contain atleast 3 characters!!</span> : ''
                                }
                            </div>
                        }
                        <span className={`w-100 text-center color-secondary-${theme} fw-normal`}>{user.email}</span>
                    </div>
                </div>

                <div className='w-100 wishlist-container my-3'>
                    <div className='d-flex align-items-center'>
                        <i className='fa-solid wishlisted fa-star me-1'></i>
                        <h5 className='fw-bold mb-0'>Your wishlist</h5>
                    </div>
                    {wishlistHasError ?
                        <div className='w-100 text-center py-5 fw-bold'>Unable to retrieve your wishlist.</div> :
                        isWishlistLoading ?
                            <div className={`position-relative d-flex flex-column py-5 my-2 bg-primary-${theme} box-shadow-primary-${theme}`}>
                                <SmallLoader loading={isWishlistLoading} />
                            </div> :
                            <ul className={`wishlist-items-container my-2 border-radius-5 bg-primary-${theme} box-shadow-primary-${theme}`}>
                                {wishlist.length ?
                                    wishlist.map((coin, index) => {
                                        return (
                                            <li key={index} className={`d-flex justify-content-between align-items-center px-3 py-3 wishlist-coins ${index === wishlist?.length - 1 ? '' : `navbar-border-${theme}`}`}>
                                                <div className='d-flex align-items-center me-3 overflow-x-auto scrollbar-hidden'>
                                                    <span>{index + 1}.</span>
                                                    <img src={coin.iconUrl} alt="" className='wishlist-coin-icon ms-2 me-1' />
                                                    <span className='me-1 overflow-x-auto scrollbar-hidden'>{coin.name}</span>
                                                    <span className={`color-secondary-${theme}`}>{coin.symbol}</span>
                                                </div>
                                                <div className='d-flex align-items-center fs-small'>
                                                    <span className='text-nowrap'>
                                                        {(fiatCurrency.type === 'fiat' ? fiatCurrency.symbol + " " : "") + (Number(coin.price) < 1 ? Number(coin.price).toFixed(20).match(/^-?\d*\.?0*\d{0,6}/)[0] : Number(coin.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) + (fiatCurrency.type === 'coin' ? " " + fiatCurrency.code : "")}
                                                    </span>
                                                    <i className="fa-solid fa-trash ms-2 price-down cursor-pointer" onClick={() => removeFromWishlist(coin.uuid, coin.symbol)}></i>
                                                </div>
                                            </li>
                                        )
                                    }) :
                                    <div className={`text-center py-5 border-radius-5 bg-primary-${theme} box-shadow-primary-${theme}`}>Your wishlist is empty.</div>
                                }
                            </ul>
                    }
                </div>
            </div>

            <button className='w-50 fw-bold logout-btn px-5 py-2' onClick={logOut}>Log Out</button>

            <i className='fa-solid fa-xmark profile-drawer-close-logo' onClick={toggleDrawer}></i>
        </Drawer>
    )
}

export default ProfileDrawer