import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import { getBraintreeClientToken, processPayment, createOrder} from './apiCore';
import Card from './Card';
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom';
import 'braintree-web';
import DropIn from 'braintree-web-drop-in-react';
import {emptyCart} from './CartHelpers';







const Checkout = ({products}) => {

    const [data, setData] = useState({loading: false,success: false, clientToken: null,error: '',instance: {}, address: '' });

    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(data => {
            if (data.error) {
                setData({...data, error: data.erro})
            }else{
                setData({clientToken: data.clientToken});
            }
        })
    }

    useEffect(() => {
        getToken(userId, token)
    }, []);

    const handleAddress = event => {
        setData({...data, address: event.target.value});
    }

    const getTotal = () => {
        return products.reduce((currentValue , nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0)
    }
    const showCheckout = () => {
       return  (isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
           <Link to="/signin">
                <button className="btn btn-primary">Signin to check out</button>
           </Link>
        )
       )
    }

    let deliveryAddress = data.address

    const buy = () => {
        setData({loading: true});
        // send the nonce to your server 
        //noce = data.instace.requestPaymentMethod()

        let nonce;
        let getNonce = data.instance.requestPaymentMethod()
        .then(data => {
            //console.log(data)
            nonce = data.nonce
            // once you have nonce ( card type, card number) send nonce as ' paymentMethodNonce
            // and also total to be charged
           // console.log('sond nonce and total to process:', nonce, getTotal(products) )
           const paymentData = {
               paymentMethodNonce: nonce,
               amount: getTotal(products)
           }
           processPayment(userId, token, paymentData)
           .then(response => {
           // console.log(response)
          
        //    empty cart
        // create order

        const createOrderData = {
            products: products,
            transaction_id: response.transaction_id,
            amount: response.transaction.amount,
            address: deliveryAddress
        };

        createOrder(userId, token, createOrderData)
        .then(response => {
            emptyCart(() => {
                console.log('payment succes and empty cart');
                setData({loading: false, success:true
                });
    
            });
        })

           } )
           .catch(error => {
               console.log(error)
               setData({loading: false});

            
            })
        })
        .catch(error => {
            //console.log('dropin error: ', error)
            setData({...data, error: error.message});
        })

        
    }

    const showDropIn = () => (
        <div onBlur={() => setData({...data, error: ""})}>
            <div>
                {data.clientToken !== null && products.length > 0 ?  (
                    <div>
                    <div className="form-group mb3">
                        <label className="text-muted">Delivery address: </label>
                            <textarea onChange={handleAddress} className="form-control" value={data.address} placeholder="Type your delivery address here.." />
                    </div>
                   
                        <DropIn options={{
                            authorization:data.clientToken,
                            paypal: {
                                flow: "vault"
                            }
                        }} onInstance={instance => (data.instance = instance) } />
                        <button onClick={buy} className="btn btn-success btn-block">Pay</button>
                    </div>

                ) : null }
            </div>
        </div>
    );

    const showError = error => (
        <div className="alert alert-danger" style={{display: error? '' : 'none'}}>
            {error}
        </div>
    )

    const showSuccess = success => (
        <div className="alert alert-info" style={{display: success? '' : 'none'}}>
            Thanks! your payment was successful 
        </div>
    )

    const showLoading = (loading) =>(
        loading && <h2>Loading...</h2>
    )

return <div> 

        <h2> Total: ${getTotal() }</h2>
        {showLoading(data.loading)}
        {showSuccess(data.success)}
        {showError(data.error)}
       {showCheckout()}
    
    </div>;
};


export default Checkout
