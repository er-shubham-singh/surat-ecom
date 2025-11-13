import axios from 'axios'
import { FIND_PRODUCT_BY_ID_REQUEST, FIND_PRODUCT_BY_ID_SUCCESS,FIND_PRODUCT_BY_ID_FAILURE, FIND_PRODUCTS_BY_CATEGORY_REQUEST, FIND_PRODUCT_BY_CATEGORY_SUCCESS, FIND_PRODUCT_BY_CATEGORY_FAILURE } from './actionType'
import api from '../../Config/api'


// Find product by id
export const findProductById =(reqData)=> async(dispatch)=>{
    try{
        dispatch({type:FIND_PRODUCT_BY_ID_REQUEST})
        const {data} = await api.get(`/api/products/id/${reqData.productId}`)
        console.log("product by id : ", data)
        dispatch({
            type:FIND_PRODUCT_BY_ID_SUCCESS,
            payload:data
        })
    } catch(error){
        dispatch({
            type:FIND_PRODUCT_BY_ID_FAILURE,
            payload:error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

// find product in filter option
export const findProducts = (reqData)=> async(dispatch)=>{
    try{
        dispatch({type:FIND_PRODUCTS_BY_CATEGORY_REQUEST})
        const params = new URLSearchParams()
        if(reqData.colors?.length>0) params.append("color", reqData.color)
        if(reqData.sizes?.length>0) params.append("size",reqData.sizes)
        if(reqData.maxPrice) params.append('maxPrice',reqData.maxPrice)
        if(reqData.minPrice) params.append('manPrice',reqData.manPrice)
        if(reqData.category) params.append('category',reqData.category)
        if(reqData.sort) params.append('sort',reqData.sort)
        if(reqData.pageNumber) params.append('pageNumber',reqData.pageNumber)
        if(reqData.pageSize) params.append('pageSize', reqData)
        
        const {data} = await api.get(`api/products?${params.toString()}`)
        console.log("Api response data : ",data)
        dispatch({
            type:FIND_PRODUCT_BY_CATEGORY_SUCCESS,
            payload:data
        })
    } catch(error){
        dispatch({
            type:FIND_PRODUCT_BY_CATEGORY_FAILURE,
            payload: error.response?.data?.message || error.message        })
    }
}