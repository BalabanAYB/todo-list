import { combineReducers, createStore} from "redux"
import canvasReducer from './canvasReducer'

let reducers = combineReducers({
   canvas: canvasReducer
})

const store = createStore(reducers)
export default store;