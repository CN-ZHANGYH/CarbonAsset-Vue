import request from "@/utils/request";


export function getResourceTypeList(){
    return request({
        url: '/carbon/data/rtList',
        method: 'GET'
    })
}


export function getFootPrintList(){
    return request({
        url: '/carbon/data/footprint',
        method: 'GET'
    })
}


export function getNewTxList(){
    return request({
        url: '/carbon/data/newTxList',
        method: 'GET'
    })
}