import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './content/content.slice';
import userReducer from './user/user.slice';
import kurralReducer from './kurral/kurral.slice';

const store = configureStore({
  reducer: {
    content: contentReducer,
    user: userReducer,
    kurral: kurralReducer,
  },
});

export default store;