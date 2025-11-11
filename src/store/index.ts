import { configureStore, combineReducers } from '@reduxjs/toolkit'
import tableReducer from './tableSlice'
import { persistReducer, persistStore } from 'redux-persist'
import { persistConfig } from './persist'

const rootReducer = combineReducers({
  table: tableReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
