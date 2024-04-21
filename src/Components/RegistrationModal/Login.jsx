import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { auth } from '../../firebase'

const selectThemeState = state => state.theme

const Login = ({ setDisplay }) => {

    const dispatch = useDispatch()

    const theme = useSelector(selectThemeState)

    const [email, setEmail] = useState('')

    const [password, setPassword] = useState('')

    const handleEmailChange = e => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = e => {
        setPassword(e.target.value)
    }

    const handleSubmit = async () => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password)

            if (!result.user.emailVerified) {
                signOut(auth)
                dispatch({
                    type: 'alert/setAlert',
                    payload: {
                        display: true,
                        message: 'Verify your email first.',
                        color: 'danger'
                    }
                })
            }
            else {
                dispatch({
                    type: 'user/setUser',
                    payload: result.user
                })
                dispatch({
                    type: 'alert/setAlert',
                    payload: {
                        display: true,
                        message: 'Logged in successfully',
                        color: 'success'
                    }
                })
                setDisplay(false)
            }
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

    return (
        <div className='fw-bold'>
            <label htmlFor="email" className='mb-1 mx-4 margin-x-0'>Your registered email</label>
            <input type="text" value={email} id="email" placeholder='Type here..' className={`px-3 py-2 mx-4 mb-4 margin-x-0 border-radius-5 bg-primary-${theme} input-${theme} border-primary-${theme}`} onChange={e => handleEmailChange(e)} />
            <label htmlFor="password" className='mb-1 mx-4 margin-x-0'>Your password</label>
            <input type="password" value={password} id="password" placeholder='Type here..' className={`px-3 py-2 mx-4 mb-4 margin-x-0 border-radius-5 bg-primary-${theme} input-${theme} border-primary-${theme}`} onChange={e => handlePasswordChange(e)} />

            <div className='d-flex flex-column align-items-center mt-4'>
                <button type="submit" className='login-sigup-button px-5 py-3' disabled={email.length === 0 || password.length === 0 ? true : false} onClick={handleSubmit}>
                    Log In
                </button>
            </div>
        </div>
    )
}

export default Login