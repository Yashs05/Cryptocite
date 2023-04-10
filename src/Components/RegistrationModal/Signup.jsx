import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import { auth } from '../../firebase'

const selectThemeState = state => state.theme

const Signup = ({ setDisplay }) => {

    const dispatch = useDispatch()

    const theme = useSelector(selectThemeState)

    const [email, setEmail] = useState('')

    const [password, setPassword] = useState('')

    const [confirmPassword, setconfirmPassword] = useState('')

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleConfirmPasswordChange = (e) => {
        setconfirmPassword(e.target.value)
    }

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            dispatch({
                type: 'alert/setAlert',
                payload: {
                    display: true,
                    message: 'Passwords do not match.',
                    color: 'danger'
                }
            })
            return;
        }
        if (password.length < 8) {
            dispatch({
                type: 'alert/setAlert',
                payload: {
                    display: true,
                    message: 'Bad password',
                    color: 'danger'
                }
            })
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)
            const user = result.user

            updateProfile(user, {
                displayName: (Math.random() + 1).toString(36).substring(4)
            })

            sendEmailVerification(user)
            dispatch({
                type: 'alert/setAlert',
                payload: {
                    display: true,
                    message: `Link sent to ${user.email}`,
                    color: 'success'
                }
            })
            setDisplay(false)
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
            <label htmlFor="email" className='mb-1 mx-4 margin-x-0'>Enter email</label>
            <input type="text" value={email} id="email" placeholder='Type here..' className={`px-3 py-2 mx-4 mb-4 border-radius-5 margin-x-0 bg-primary-${theme} input-${theme} border-primary-${theme}`} onChange={e => handleEmailChange(e)} />
            <label htmlFor="password" className='mb-1 mx-4 margin-x-0'>Your password</label>
            <input type="password" value={password} id="password" placeholder='Type here..' className={`px-3 py-2 mx-4 mb-4 border-radius-5 margin-x-0 bg-primary-${theme} input-${theme} border-primary-${theme}`} onChange={e => handlePasswordChange(e)} />
            <label htmlFor="confirm-password" className='mb-1 mx-4 margin-x-0'>Confirm password</label>
            <input type="password" value={confirmPassword} id="confirm-password" placeholder='Type here..' className={`px-3 py-2 mx-4 mb-1 border-radius-5 margin-x-0 bg-primary-${theme} input-${theme} border-primary-${theme}`} onChange={e => handleConfirmPasswordChange(e)} />
            <div className={`mx-4 fs-small margin-x-0 color-secondary-${theme}`}>Password should be of minimum length of 8 characters, consisting of both letters and numbers.</div>

            <div className='d-flex flex-column align-items-center mt-4'>
                <button type="submit" className='login-sigup-button px-5 py-3' onClick={handleSubmit} disabled={email.length === 0 || password.length === 0 || confirmPassword.length === 0 ? true : false}>
                    Create account
                </button>
                <div className={`mt-2 fs-small color-secondary-${theme}`}>
                    An email with a link will be sent to your email id (in spam section) after creating your account. Click on the link to verify your email and log in to your account.
                </div>
            </div>
        </div>
    )
}

export default Signup