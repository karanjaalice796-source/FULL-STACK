import { legacy_createStore as createStore } from 'redux'
import { todoReducer } from './reducer.js'

export const store = createStore(todoReducer)
