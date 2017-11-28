import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import reducers from 'src/reducers'




console.log(reducers)
const store = createStore(
	combineReducers(reducers), 
	applyMiddleware(thunk)
)


export default store