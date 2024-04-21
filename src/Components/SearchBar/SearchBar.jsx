import { React, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { loadSearchResult } from '../../Reducers/SearchResultReducer'
import SmallLoader from '../Loader/SmallLoader'
import './SearchBar.css'

const selectSearchResultState = state => [state.searchResult.list, state.searchResult.isLoading, state.searchResult.hasError]

const selectFiatCurrencyState = state => [state.fiatCurrency.uuid, state.fiatCurrency.symbol, state.fiatCurrency.code]

const selectThemeState = state => state.theme

const SearchBar = ({ bgColor }) => {

    const dispatch = useDispatch()

    const dropDown = useRef(null)

    const timer = useRef()

    const [result, isResultLoading, resultHasError] = useSelector(selectSearchResultState)

    const [fiatCurrencyUuid, fiatCurrencySymbol, fiatCurrencyCode] = useSelector(selectFiatCurrencyState)

    const theme = useSelector(selectThemeState)

    const [value, setValue] = useState('')

    const [display, setDisplay] = useState(false)

    const handleChange = (e) => {
        setValue(e.target.value)

        if (timer.current) {
            clearTimeout(timer.current)
        }

        if (value.length === 1 && e.target.value.length === 0) {
            setDisplay(false)
        }
        else {
            timer.current = setTimeout(() => {
                setDisplay(true)
                dispatch({
                    type: 'searchResult/setLoadingState',
                    payload: true
                })
                dispatch(loadSearchResult(e.target.value, fiatCurrencyUuid))
            }, 500)
        }
    }

    const closeDropDown = (e) => {
        if (display && !dropDown.current.contains(e.target)) {
            setValue('')
            setDisplay(false)
        }
    }

    const handleCloseClick = () => {
        if (display) {
            setValue('')
            setDisplay(false)
        }
    }

    document.addEventListener('mouseup', closeDropDown)

    return (
        <div className='dropdown search_cont' ref={dropDown}>
            <div className={`search_bar_container d-flex align-items-center ${bgColor} border-primary-${theme}`}>
                <i className={`fa-solid fa-magnifying-glass color-secondary-${theme}`}></i>
                <input type='text' placeholder='Search' value={value} className={`input-${theme}`} onChange={e => handleChange(e)} disabled={isResultLoading ? true : undefined} />
                <i className={`fa-solid fa-xmark close_icon color-secondary-${theme}`} onClick={handleCloseClick}></i>
            </div>

            {!display ? '' :
                resultHasError ?
                    <div className={`search_results_container loader_height d-flex flex-column justify-content-center align-items-center bg-secondary-${theme} box-shadow-secondary-${theme}`}>
                        <i className="fa-regular fa-face-frown mb-1"></i>
                        <span className='fw-bold'>Unable to load results</span>
                    </div> :
                    result.length === 0 && value && !isResultLoading ?
                        <div className={`search_results_container loader_height d-flex flex-column justify-content-center align-items-center bg-secondary-${theme} box-shadow-secondary-${theme}`}>
                            <i className="fa-regular fa-face-frown mb-1"></i>
                            <span className='fw-bold'>No result found</span>
                        </div> :
                        <>
                            <div className={`search_results_container py-2 bg-secondary-${theme} box-shadow-secondary-${theme} ${isResultLoading === true && result.length === 0 ? 'loader_height' : undefined}`}>
                                <div className={`results-label-${theme} px-3 py-2 ${isResultLoading ? `opacity_manual ${!result.length ? 'd-none' : undefined}` : 'opacity_initial'}`}>
                                    Showing results for '&nbsp;
                                    <span className='fw-bold'>{value}</span>
                                    &nbsp;'
                                </div>
                                <ul>
                                    {result.map(item => {
                                        return (item.price === null ? undefined :
                                            <li key={item.uuid} className={`results_cont hover-primary-${theme} ${isResultLoading ? 'opacity_manual' : 'opacity_initial'}`} onClick={handleCloseClick} >
                                                <Link to={`/${item.name.replace(/ /g, '-')}`} className={`color-primary-${theme}`}>
                                                    <div className='results d-flex justify-content-between align-items-center px-3 py-2 fw-bold' key={result.uuid}>
                                                        <div>
                                                            <img src={item.iconUrl} alt="" className='icon me-1' />
                                                            <span>{`${item.name} (${item.symbol})`}</span>
                                                        </div>
                                                        <span className={`ms-3 color-secondary-${theme}`}>{`${(fiatCurrencySymbol || fiatCurrencyCode)} ${Number(item.price) < 1 ? Number(Number(item.price).toFixed(6)) ? Number(item.price).toFixed(6) : ('0.00. . .' + Number(item.price).toLocaleString(undefined, { maximumFractionDigits: 20 }).slice(-3)) : Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                                <SmallLoader loading={isResultLoading} />
                            </div>
                        </>
            }
        </div>
    )
}

export default SearchBar
