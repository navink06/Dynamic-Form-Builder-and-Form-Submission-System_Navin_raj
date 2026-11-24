import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import formsReducer from './slices/formsSlice';
import formBuilderReducer from './slices/formBuilderSlice';
import formRendererReducer from './slices/formRendererSlice';
import submissionsReducer from './slices/submissionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forms: formsReducer,
    formBuilder: formBuilderReducer,
    formRenderer: formRendererReducer,
    submissions: submissionsReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
