import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './content/content.slice';
import kurralReducer from './kurral/kurral.slice';

const store = configureStore({
  reducer: {
    content: contentReducer,
    kurral: kurralReducer,
  },
});

export default store;