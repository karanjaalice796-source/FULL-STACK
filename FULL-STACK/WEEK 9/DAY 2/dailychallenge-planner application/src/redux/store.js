import { legacy_createStore as createStore } from 'redux'
import { plannerReducer } from './reducer.js'

export const store = createStore(plannerReducer)
