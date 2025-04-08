import axios from "axios";

const baseUrl="http://localhost:5090/api/vendor"

export function getAllSuppliers(){
    return axios.get(baseUrl)
}

export function login({password,phone}){
    return axios.post(`${baseUrl}/login`,{password,phone})
}

export function signUp(supplier){
    return axios.post(baseUrl,supplier)
}

export function apiAddProduct(name,vendorId){
    return axios.post(`${baseUrl}/addProduct`,{name,vendorId})
}


