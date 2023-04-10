import { configureStore } from "@reduxjs/toolkit";
import { currencyListSlice } from "./Reducers/CurrencyListReducer";
import { currencySlice } from "./Reducers/CurrencyReducer";
import { fiatCurrencySlice } from "./Reducers/FiatCurrencyReducer";
import { globalStatsSlice } from "./Reducers/GlobalStatsReducer";
import { paginationSlice } from "./Reducers/PaginationReducer";
import { searchResultSlice } from "./Reducers/SearchResultReducer";
import { currencyHistorySlice } from "./Reducers/CurrencyHistoryReducer";
import { currentTimeSlice } from "./Reducers/CurrentTimeReducer";
import { priceConverterSlice } from "./Reducers/PriceConverterReducer";
import { refCurrencyListSlice } from "./Reducers/RefCurrencyListReducer";
import { themeChangerSlice } from "./Reducers/ThemeChangerReducer";
import { userReducerSlice } from "./Reducers/UserReducer";
import { wishlistSlice } from "./Reducers/WishlistReducer";
import { alertSlice } from "./Reducers/AlertReducer"

export const store = configureStore({
    reducer: {
        currencyList: currencyListSlice.reducer,
        currencyHistory: currencyHistorySlice.reducer,
        fiatCurrency: fiatCurrencySlice.reducer,
        refCurrencyList: refCurrencyListSlice.reducer,
        globalStats: globalStatsSlice.reducer,
        currency: currencySlice.reducer,
        priceConverter: priceConverterSlice.reducer,
        searchResult: searchResultSlice.reducer,
        pagination: paginationSlice.reducer,
        currentTime: currentTimeSlice.reducer,
        theme: themeChangerSlice.reducer,
        user: userReducerSlice.reducer,
        wishlist: wishlistSlice.reducer,
        alert: alertSlice.reducer
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store