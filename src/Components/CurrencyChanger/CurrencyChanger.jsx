import React, { useState, useRef } from 'react'
import SmallLoader from '../Loader/SmallLoader'
import InfiniteScroll from 'react-infinite-scroll-component'
import './currencyChanger.css'
import { useSelector } from 'react-redux'

const selectThemeState = state => state.theme

const CurrencyChanger = ({ value, refCurrency, refCurrencyList, refCurrencyListTotal, isRefCurrencyListLoading, refCurrencyListHasError, loadMoreRefCurrencies, handleInputChange, handleChangeCurrency, id }) => {

  const theme = useSelector(selectThemeState)

  const dropDown = useRef(null)

  const [display, setDisplay] = useState(false)

  const closeDropdown = (e) => {
    if (dropDown.current && display && !dropDown.current.contains(e.target)) {
      setDisplay(false)
    }
  }

  document.addEventListener('mousedown',closeDropdown)

  return (
    <div className={`dropdown ${id === 'scrollableDiv1' ? '' : 'w-50'}`} ref={dropDown}>
      <button className={`d-flex align-items-center w-100 ${id === 'scrollableDiv1' ? `px-3 py-1 currency_changer_btn color-primary-${theme} bg-primary-${theme} border-primary-${theme}` : 'justify-content-between currency_converter_btn'}`} type="button"
        onClick={() => !display ? setDisplay(true) : undefined}>
        <span>{refCurrency.code}</span>
        <i className="ms-2 fa-solid fa-caret-down"></i>
      </button>

      {!display ? '' :
        <div className={`currency_changer_dropdown py-2 color-primary-${theme} bg-secondary-${theme} box-shadow-primary-${theme}`}>
          <div className='d-flex align-items-center px-3 py-2'>
            <i className="fa-solid fa-magnifying-glass text-secondary"></i>
            <input type="text" value={value} placeholder='Search' className={`mx-2 input-${theme}`} onChange={(e, value) => handleInputChange(e, value)} />
          </div>
          {refCurrencyListHasError ?
            <div className={`loader_height d-flex flex-column justify-content-center align-items-center ${isRefCurrencyListLoading ? 'opacity_manual' : 'opacity_initial'}`}>
              <i className="fa-regular fa-face-frown mb-1"></i>
              <span className='fw-bold'>Unable to load results</span>
            </div> :
            <ul className={`currency_options_container ${isRefCurrencyListLoading ? 'opacity_manual' : 'opacity_initial'}`} id={id}>
              <InfiniteScroll
                dataLength={refCurrencyList.length}
                next={loadMoreRefCurrencies}
                hasMore={refCurrencyList.length !== refCurrencyListTotal ? true : false}
                scrollableTarget={id} >
                {refCurrencyList.map(currency => {
                  return (
                    <li key={currency.uuid} className={`currency_options d-flex flex-column px-3 py-2 hover-primary-${theme}`} onClick={() => { handleChangeCurrency(currency); setDisplay(false) }} >
                      {`${currency.name} - ${currency.symbol}`}
                    </li>
                  )
                }
                )}
              </InfiniteScroll>
            </ul>
          }

          <SmallLoader loading={isRefCurrencyListLoading} />
        </div>
      }
    </div>
  )
}

export default CurrencyChanger