import { legacy_createStore as createStore } from 'redux'
import { appReducer } from './reducer.js'

export const store = createStore(appReducer)
