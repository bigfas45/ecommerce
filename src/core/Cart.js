import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import {getCart} from './CartHelpers';
import Card from './Card';
import { Link } from 'react-router-dom';
import checkout from './Checkout';
import Checkout from './Checkout';



const Cart = () =>{
    const [items, setItems] = useState([]);
    const [run, setRun] = useState(false);


    useEffect(() => {
        setItems(getCart());
    }, [run]);


    const showItems = items => {
        return (
            <div>
                <h2>Your cart has {`${items.length}`}</h2>
                <hr />
                {items.map((product, i) => (
                <Card key={i} product={product} showAddToCartButton={false} cartUpdate={true} showRemoveProductButton={true} setRun={setRun}
                run={run} />
                ))}
            </div>
        )
    }

    const noItmesMessage = () => (
        <h2>Your cart is empty. <br /> <Link to="/shop">Continue shopping</Link> </h2>
    )



    return (
        <Layout title="Shopping Cart" description="Manage your cart itmes. Add remove checkout or continue shopping " className="container-fluid">

        <div className="row">
            <div className="col-6">
                {items.length > 0 ? showItems(items) : noItmesMessage()}
            </div>

            <div className="col-6">
              <h2 className="mb-4">Your cart summary </h2>
              <hr />
              <Checkout products={items} />
            </div>
        </div>

        </Layout>
    );



}

export default Cart
