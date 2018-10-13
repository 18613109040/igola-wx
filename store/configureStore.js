const { createStore, compose, applyMiddleware } = require('../libs/redux.js');
const reducer = require('../reducers/index.js')
import thunk from '../libs/redux-thunk.js'
// const logger1 = store => next => action => {
//   console.log('logger1 start', action);
//   next(action);
//   console.dir(store)
//   console.log('logger1 end', action);
// }

// function logger(store){
//   return function logger(next){
//     return function logger(action){
//         return next(action)
//     }
//   }
// }

function configureStore(initialState) {
  //return createStore(reducer, initialState);
   // actions 内异步返回
  return compose(applyMiddleware(thunk))(createStore)(reducer, initialState);
}
module.exports = configureStore;
