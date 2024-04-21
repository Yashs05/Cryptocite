import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import './Pagination.css'

const selectPaginationState = state => [state.pagination.page, state.pagination.offset]

const selectThemeState = state => state.theme

const Pagination = () => {

    const dispatch = useDispatch()

    const [page, offset] = useSelector(selectPaginationState)

    const theme = useSelector(selectThemeState)

    const pagesNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    const handlePaginationChange = (pageNumber) => {
        dispatch({
            type: 'pagination/setPagination',
            payload: {
                page: pageNumber,
                offset: ((pageNumber - page) * 100) + offset
            }
        })
        dispatch({
            type: 'currencyList/setCurrencyListLoadingState',
            payload: true
        })
        dispatch({
            type: 'currencyList/emptyCurrencyList',
            payload: []
        })
    }

    const handlePaginationDecrease = () => {
        dispatch({
            type: 'pagination/setPagination',
            payload: {
                page: page - 1,
                offset: offset - 100
            }
        })
        dispatch({
            type: 'currencyList/setCurrencyListLoadingState',
            payload: true
        })
        dispatch({
            type: 'currencyList/emptyCurrencyList',
            payload: []
        })
    }

    const handlePaginationIncrease = () => {
        dispatch({
            type: 'pagination/setPagination',
            payload: {
                page: page + 1,
                offset: offset + 100
            }
        })
        dispatch({
            type: 'currencyList/setCurrencyListLoadingState',
            payload: true
        })
        dispatch({
            type: 'currencyList/emptyCurrencyList',
            payload: []
        })
    }

    return (
        <div className='w-100 px-4 py-5'>
            <ul className='d-flex justify-content-center align-items-center my-0'>
                <li className={`mx-1 text-center page-items-${theme} page_items ${page === 1 ? `color-secondary-${theme} no_hover` : undefined}`} onClick={handlePaginationDecrease}><i className='fa fa-chevron-left arrows text-center'></i></li>
                {pagesNumbers.map(pageNumber => {
                    return <li key={pageNumber} className={`mx-1 text-center page-items-${theme} page_items ${pageNumber === page ? 'active' : undefined}`} onClick={() => handlePaginationChange(pageNumber)}>{pageNumber}</li>
                })}
                <li className={`mx-1 text-center page-items-${theme} page_items ${page === 10 ? `color-secondary-${theme} no_hover` : undefined}`} onClick={handlePaginationIncrease}><i className='fa fa-chevron-right arrows text-center'></i></li>
            </ul>
        </div>
    )
}

export default Pagination
