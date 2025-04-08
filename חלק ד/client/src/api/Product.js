import axios from "axios";
const baseUrl="http://localhost:5090/api/product"


export function getProductDeatailsById(id){
    return axios.get(`${baseUrl}/${id}`)
}