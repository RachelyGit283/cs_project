import { configureStore } from '@reduxjs/toolkit'
import TokenSlice from './tokenSlice'
// import carSlice from './CarSlice'
// import UserSlice from './UserSlice'
// import rolseSlice from './rolseSlice'

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
  key: 'root',
  storage,
};

const persistedTokenReducer = persistReducer(persistConfig, TokenSlice);
// const persistedRolseReducer = persistReducer(persistConfig, rolseSlice);

// const persistedCarReducer=persistReducer(persistConfig,carSlice);
// const persistedUserReducer=persistReducer(persistConfig,UserSlice);

const store = configureStore({
  reducer: {
    // rolse:persistedRolseReducer,
    token: persistedTokenReducer, // Persisted token reducer
    // car:persistedCarReducer,
    // user:persistedUserReducer
  },
});

const persistor = persistStore(store);

export { store, persistor };
