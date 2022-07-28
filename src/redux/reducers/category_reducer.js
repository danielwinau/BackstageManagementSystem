import {SAVE_CATEGORY_LIST} from '../action_types'

let initState=[]
export default function categoryReducer (preState=initState, action) {
    const {type, data}=action
    let newState
    switch (type) {
        case SAVE_CATEGORY_LIST:
            newState=[...data]
            return newState
        default:
            return preState
    }
}