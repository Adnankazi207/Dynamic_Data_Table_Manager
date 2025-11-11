import storage from 'redux-persist/lib/storage'  
import { persistReducer } from 'redux-persist'

export const persistConfig = {
  key: 'root',          
  version: 1,           
  storage,              
  whitelist: ['table'], 
}


