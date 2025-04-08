import axios from "axios";
const baseUrl="http://localhost:5090/api/order"


export function getAllOrders(){
    return axios.get(baseUrl)
}

export function getOrdersBySupplierId(id){
    return axios.get(`${baseUrl}/${id}`)
}

export function getOrdersNotCompleted(){
    return axios.get(`${baseUrl}/InProgress`)
}

export function addOrder(order){
    return axios.post(baseUrl,order)
}

export function changeStatusForOrder(id, status,token) {
    return axios.put(`${baseUrl}/${id}`, { status },{headers:{ authorization: token}}); 
}






