import { configureStore } from '@reduxjs/toolkit'
import ProductRedux from './features/product/product.redux'
import OrderRedux from './features/order/order.redux'
import UserRedux from './features/user/user.redux'
import ListUser from './features/listUser/listUser.redux'
import ListRoom from './features/roomchat/roomchat.redux'

export const makeStore = () => {
  return configureStore({
    reducer: {
      ProductRedux,
      UserRedux,
      OrderRedux,
      ListUser,
      ListRoom
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']