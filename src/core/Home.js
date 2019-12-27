import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import {getProducts, getCategories} from './apiCore';
import Card from './Card';
import Search from './Search'

const Home = () => {

    const [productBySell, setProductBySell] = useState([]);
    const [productByArrival, setProductByArrival] = useState([]);
    const [error, setError]  = useState(false)
    const [categories, setCategories] = useState([]);

    const loadProductsBySell = () => {
        getProducts('sold').then(data => {
            if (data.error) {
                setError(data.error)
            }else{
                setProductBySell(data)
            }
        })

    }

    const init = () => {
        getCategories().then(data => {
            if (data.error) {
               setError(data.error);
            }else{
                setCategories(data);
            }
        });
    };

    const loadProductsByArrival = () => {
        getProducts('createdAt').then(data => {
            if (data.error) {
                setError(data.error)
            }else{
                setProductByArrival(data)
            }
        })

    }

    
    useEffect(() => {
        init();
        loadProductsByArrival();
        loadProductsBySell();
    }, [])



    return (
        <Layout title="Home Page" description="Node React E-commerce App" className="container-fluid">

            <Search />


        <h2 className="mb-4">New Arrivals</h2>
        <div className="row">
          {productByArrival.map((product, i) => ( 
       <div key={i} className="col-4 mb-3">
              <Card  product={product}  />
       </div>
          ))}
          </div>
          
          <h2 className="mb-4">Best Sellers</h2>
          <div className="row">
          {productBySell.map((product, i) => ( 
          <div key={i} className="col-4 mb-3">
           <Card  product={product}  />
        </div>
          ) )}
          </div>

         
        </Layout>
    );

};



export default Home;