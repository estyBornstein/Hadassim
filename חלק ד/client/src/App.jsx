import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom';

import './App.css'

import Suppliers from './pages/Suppliers';
import ProductDetails from './component/ProductDetails';
import Products from './component/Products';
import Login from './component/Login';
import SignUp from './component/SignUp';
import Orders from './pages/Orders';
import OrderForm from './component/OrderForm';
import SignOut from './component/SignOut';
import NavBar from './component/NavBar';



function App() {
  return (
    <>     
      <NavBar />
      <Routes>
        <Route path='/orders' element={<Orders />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/signOut' element={<SignOut />} />
        <Route path='/order-form' element={<OrderForm />} />
        <Route path="/Product" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </>
  );
}

export default App;

