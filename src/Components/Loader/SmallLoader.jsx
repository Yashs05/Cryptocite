import React from 'react'
import './smallLoader.css'

const SmallLoader = ({ loading, component = undefined }) => {
    return (
        <div className={`search_results_loader d-flex justify-content-center ${component ? 'mt-5' : 'align-items-center'} w-100 h-100 ${loading ? '' : 'd-none'}`}>
            <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default SmallLoader