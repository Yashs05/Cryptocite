import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import './themeChanger.css'

const selectThemeState = state => state.theme

const selectUserState = state => state.user

const ThemeChanger = () => {

    const dispatch = useDispatch()

    const theme = useSelector(selectThemeState)

    const { user } = useSelector(selectUserState)

    const handleClick = async () => {
        dispatch({
            type: 'themeChanger/setTheme',
            payload: theme === 'light' ? 'dark' : 'light'
        })

        if (user) {
            const themeRef = doc(db, 'theme', user.uid)

            try {
                await setDoc(themeRef, {
                    theme: theme === 'light' ? 'dark' : 'light'
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

    return (
        <div className='d-flex align-items-center mx-2'>
            <i className={`fa-solid fa-${theme === 'light' ? 'moon' : 'sun'}`} style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={handleClick}></i>
        </div>
    )
}

export default ThemeChanger
