import { configureStore } from '@reduxjs/toolkit'
import UserRedux from './features/user/user.redux'
import CategoryRedux from './features/category/category.redux'
import ProductRedux from './features/product/product.redux'
import CartRedux from './features/cart/cart.redux'
import OrderRedux from './features/order/order.redux'

export const makeStore = () => {
    return configureStore({
        reducer: {
            UserRedux,
            CategoryRedux,
            ProductRedux,
            CartRedux,
            OrderRedux
        }
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']