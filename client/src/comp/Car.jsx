import { useDispatch, useSelector } from "react-redux";
import { useReducer, useState, useEffect } from "react"
import axios from 'axios' 
 

export const Car = {    
async getAllCars(token) {
        try {
            const res = await axios.get(`http://localhost:8090/api/User/connect`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                console.log("carsUser",res.data)
                console.log(res.data);
                return res.data.carsUser;
            }
        } catch (e) {
            return [];
        }
    },
    
    getProductsMini(token) {
        return Promise.resolve(this.getAllCars(token).slice(0, 5));
    },
    getProductsSmall(token) {
        return Promise.resolve(this.getAllCars(token).slice(0, 10));
    },
    getProducts(token) {
        return Promise.resolve(this.getAllCars(token));
    },
    getProductsWithOrdersSmall() {
        return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
    },

    getProductsWithOrders() {
        return Promise.resolve(this.getProductsWithOrdersData());
    }
};

