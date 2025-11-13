import { FIND_PRODUCT_BY_CATEGORY_FAILURE, FIND_PRODUCT_BY_CATEGORY_SUCCESS, FIND_PRODUCT_BY_ID_FAILURE, FIND_PRODUCT_BY_ID_SUCCESS, FIND_PRODUCTS_BY_CATEGORY_REQUEST } from "./actionType"


const initialState = {
    products:[],
    product:null,
    loading:false,
    error:null,
}

const productReducer = (state = initialState, action) =>{
    switch(action.type){
        case FIND_PRODUCTS_BY_CATEGORY_REQUEST:
            return {...state, loading:true, error:null, products:[]}
        case FIND_PRODUCT_BY_CATEGORY_SUCCESS :
            return {...state, products:action.payload, loading:false}
        case FIND_PRODUCT_BY_CATEGORY_FAILURE :
            return {...state, loading:false, products:[],error:action.payload}
        case FIND_PRODUCT_BY_ID_FAILURE :
            return {...state,loading:true}
        case FIND_PRODUCT_BY_ID_SUCCESS :
            return {...state,loading:false, product:action.product}
        case FIND_PRODUCT_BY_ID_SUCCESS :
            return {...state,loading:false, product:null, error:action.payload}
        default :
            return state
    }
}

export default productReducer