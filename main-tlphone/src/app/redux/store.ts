import { configureStore } from '@reduxjs/toolkit'
import UserRedux from './features/user/user.redux'
import CategoryRedux from './features/category/category.redux'


export const makeStore = () => {
    return configureStore({
        reducer: {
            UserRedux,
            CategoryRedux
        }
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']