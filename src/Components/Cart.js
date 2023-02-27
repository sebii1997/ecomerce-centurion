import React, { useEffect, useState } from 'react'
import { Navbar } from './Navbar'
import { auth, fs } from '../Config/Config'
import { CartProducts } from './CartProducts';
import StripeCheckout from 'react-stripe-checkout';
import {Modal} from './Modal'

export const Cart = () => {

    const [showModal, setShowModal] = useState(false);

    const triggerModal = () =>{
        setShowModal(true);
    }

    const hideModal = () =>{
        setShowModal(false);
    }

    //getting current user function
    function GetCurrentUser() {
        const [user, setUser] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    fs.collection('users').doc(user.uid).get().then(snapshot => {
                        setUser(snapshot.data().NombreCompleto);
                    })
                }
                else {
                    setUser(null);
                }
            })
        }, [])
        return user;
    }

    const user = GetCurrentUser();
    //console.log(user);

    const [cartProducts, setCartProducts] = useState([]);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                fs.collection('cart ' + user.uid).onSnapshot(snapshot => {
                    const newCartProduct = snapshot.docs.map((doc) => ({
                        ID: doc.id,
                        ...doc.data(),
                    }));
                    setCartProducts(newCartProduct);
                })
            }
            else {
                console.log('El usuario no se encuentra conectado para ir al carrito');
            }
        })
    }, [])

    //console.log(cartProducts);

    //cantidad
    const qty = cartProducts.map(cartProduct => {
        return cartProduct.qty;
    })

    //reducir cantidad

    const reducerOfQty = (accumulator, currentValue) => accumulator + currentValue;

    const totalQty = qty.reduce(reducerOfQty, 0);

    /* console.log(totalQty); */
    //adquiriendo el precio
    const price = cartProducts.map((cartProduct) => {
        return cartProduct.TotalProductPrice;
    })

    const reducerOfPrice = (accumulator, currentValue) => accumulator + currentValue;

    const totalPrice = price.reduce(reducerOfPrice, 0);

    //global variable
    let Product;

    //cart product increase
    const cartProductIncrease = (cartProduct) => {
        //console.log(cartProduct);
        Product = cartProduct;
        Product.qty = Product.qty + 1;
        Product.TotalProductPrice = Product.qty * Product.price;
        auth.onAuthStateChanged(user => {
            if (user) {
                fs.collection('cart ' + user.uid).doc(cartProduct.ID).update(Product).then(() => {
                    console.log('Incremento añadido');
                })
            }
            else {
                console.log('Debe ingresar para incrementar');
            }
        })
    }

    //cart product decrease
    const cartProductDecrease = (cartProduct) => {
        Product = cartProduct;
        if (Product.qty > 1) {
            Product.qty = Product.qty - 1;
            Product.TotalProductPrice = Product.qty * Product.price;
            auth.onAuthStateChanged(user => {
                if (user) {
                    fs.collection('cart ' + user.uid).doc(cartProduct.ID).update(Product).then(() => {
                        console.log('Elemento quitado');
                    })
                }
                else {
                    console.log('Debe ingresar para disminuir cantidad');
                }
            })
        }
    }

    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                fs.collection('cart ' + user.uid).onSnapshot(snapshot => {
                    const qty = snapshot.docs.length;
                    setTotalProducts(qty);
                })
            }
        })
    }, [])

    const handleToken = (token) =>{
        console.log(token);
    }

    return (
        <>
            <Navbar user={user} totalProducts={totalProducts}/>
            <br></br>
            {cartProducts.length > 0 && (
                <div className='container-fluid'>
                    <h1 className='text-center'>Carrito</h1>
                    <div className='products-box cart'>
                        <CartProducts cartProducts={cartProducts} cartProductIncrease={cartProductIncrease} cartProductDecrease={cartProductDecrease} />
                    </div>
                    <div className='summary-box'>
                        <h5>Detalle del carrito</h5>
                        <br></br>
                        <div>
                            Numero de productos: <span>{totalQty}</span>
                        </div>
                        <div>
                            Monto total: <span>$ {totalPrice}</span>
                        </div>
                        <br></br>                        
                        <StripeCheckout                    
                            stripeKey='pk_test_51Mf61lEatUvaVB0hfrptq49vlsMMTIDc542mk7iFseIeZWJnX1ieXzhJcJGN6Rvpz0UEOzSGd5qtY7rW31zUSqoQ00ltdJiMsh'
                            token = {handleToken}
                            billingAddress
                            shippingAddress
                            name = 'Todos los productos'
                            amount = {totalPrice * 100}                          
                        >                            
                        </StripeCheckout>
                        <h6 className='text-center' style={{marginTop: 7+ 'px'}}>O pagar con efectivo</h6>
                        <button className='btn btn-secondary btn-md' onClick={() => triggerModal()}>Pagar en efectivo</button>
                    </div>
                </div>
            )}
            {cartProducts.length < 1 && (
                <div className='container-fluid'>No se encuentran productos</div>
            )}

            {showModal === true && (
                <Modal TotalPrice={totalPrice} totalQty= {totalQty} hideModal = {hideModal}/>
            )}
        </>
    )
}