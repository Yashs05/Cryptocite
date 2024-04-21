import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import ReactPlaceholder from 'react-placeholder/lib'
import Navbar from './Components/Navbar/Navbar';
import GlobalStats from './Components/GlobalStats/GlobalStats'
import { CurrencyList } from './Components/CurrencyList/CurrencyList';
import Currency from './Components/Currency/Currency';
import Loader from './Components/Loader/Loader';
import Error from './Components/Error/Error';
import Pagination from './Components/Pagination/Pagination';
import { callAPIsOnInitialRender } from './Context/APICaller';
import SearchBar from './Components/SearchBar/SearchBar';

const selectCurrencyListState = state => [state.currencyList.list, state.currencyList.isLoading, state.currencyList.hasError]

const selectGlobalStatsState = state => [state.globalStats.routerlist, state.globalStats.isLoading]

const selectSearchResultState = state => state.searchResult.routerList

const selectFiatCurrencyState = state => state.fiatCurrency

const selectCurrentTimeState = state => state.currentTime

const selectPaginationState = state => state.pagination.offset

const selectThemeState = state => state.theme

const App = () => {

  const dispatch = useDispatch()

  const [currencyList, isCurrencyListLoading, currencyListHasError] = useSelector(selectCurrencyListState)

  const [globalStatsRouterList, isGlobalStatsLoading] = useSelector(selectGlobalStatsState)

  const searchResult = useSelector(selectSearchResultState)

  const fiatCurrency = useSelector(selectFiatCurrencyState)

  const currentTime = useSelector(selectCurrentTimeState)

  const offset = useSelector(selectPaginationState)

  const theme = useSelector(selectThemeState)

  useEffect(() => {
    callAPIsOnInitialRender(dispatch, fiatCurrency, offset, currentTime)
  }, [dispatch, fiatCurrency, offset, currentTime])

  if (currencyListHasError) {
    return <Error />
  }

  return (
    <div className={`bg-primary-${theme} color-primary-${theme} app`}>
      {isCurrencyListLoading === true && isGlobalStatsLoading === true ?
        <Loader /> :
        <>
          <Navbar />
          <div className='searchbar-mobile px-4 padding-x-less padding-y-less'>
            <SearchBar bgColor={`bg-secondary-${theme}`}/>
          </div>
          <Routes>
            <Route path='/' element={
              <>
                <GlobalStats />
                {isCurrencyListLoading === true && currencyList.length === 0 ?
                  <div className='w-100 px-4 my-5'>
                    <ReactPlaceholder type='rect' ready={false} color={theme === 'light' ? '#e9e9e9' : '#2b3945'} style={{ height: '35px', margin: '30px 0' }} />
                    <ReactPlaceholder type='rect' ready={false} color={theme === 'light' ? '#e9e9e9' : '#2b3945'} style={{ height: '35px', margin: '30px 0' }} />
                    <ReactPlaceholder type='rect' ready={false} color={theme === 'light' ? '#e9e9e9' : '#2b3945'} style={{ height: '35px', margin: '30px 0' }} />
                    <ReactPlaceholder type='rect' ready={false} color={theme === 'light' ? '#e9e9e9' : '#2b3945'} style={{ height: '35px', margin: '30px 0' }} />
                  </div> :
                  <>
                    <CurrencyList />
                    <Pagination />
                    <div className='d-flex justify-content-center mb-3'>Made by &nbsp;<a href='https://www.linkedin.com/in/yashdeep-sharma-40534020a/'>Yash Sharma</a></div>
                  </>
                }
              </>
            }
            />

            {currencyList.map((currency, index) => {
              return (
                <Route exact path={currency.name.replace(/ /g, '-')} element={<Currency id={currency.uuid} name={currency.name.replace(/ /g, '-')} />} key={index} />
              )
            }
            )}

            {searchResult?.map((result, index) => {
              return (
                <Route exact path={result.name.replace(/ /g, '-')} element={<Currency id={result.uuid} name={result.name.replace(/ /g, '-')} />} key={index} />
              )
            })
            }

            {globalStatsRouterList?.map((coin, index) => {
              return (
                <Route exact path={coin.name.replace(/ /g, '-')} element={<Currency id={coin.uuid} name={coin.name.replace(/ /g, '-')} />} key={index} />
              )
            })}

          </Routes>
        </>
      }
    </div>
  )
}

export default App;
