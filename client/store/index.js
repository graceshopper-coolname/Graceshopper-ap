import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import user from './user';
import allProductsReducer from './allProducts';
import allUsersReducer from './allUsers';
import singleUserReducer from './singleUser';
import singleProductReducer from './singleProduct';
import cartReducer from './cart';
import typeReducer from './userType';
import productReviewsReducer from './reviews';

// Priti comments: updating names of items in your store
const reducer = combineReducers({
  user,
  allProductsReducer,
  allUsersReducer,
  singleProductReducer,
  singleUserReducer,
  cartReducer,
  typeReducer,
  productReviewsReducer
});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from './user';
