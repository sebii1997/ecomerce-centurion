import React, {useState, useEffect} from 'react'
import { Navbar } from './Navbar'
import { Productos } from './Productos'
import {auth, fs} from '../Config/Config'

export const Inicio = (props) => {

  //current user uid

  function GetUserUid() {
    const [uid, setUid] = useState(null);
    useEffect(() =>{
      auth.onAuthStateChanged(user =>{
        if(user){
          setUid(user.uid);
        }
      })
    }, [])
    return uid;
  }

  const uid = GetUserUid();

  //getting current user function
  function GetCurrentUser(){
    const [user, setUser] = useState(null);
    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
          if (user){
              fs.collection('users').doc(user.uid).get().then(snapshot=>{
                setUser(snapshot.data().NombreCompleto);
              })
          }
          else{
            setUser(null);
          }
        })
    },[])
    return user;
  }

  const user = GetCurrentUser();
  //console.log(user);

  //state of productos
  const [products, setProducts] = useState([]);

  //productos function
  const getProducts = async () =>{
    const products = await fs.collection('Products').get();
    const productsArray = [];
    for (var snap of products.docs){
        var data = snap.data();
        data.ID = snap.id;
        productsArray.push({
          ...data
        })
        if(productsArray.length === products.docs.length){
          setProducts(productsArray);
        }
    }
  }

  useEffect(() => {
    getProducts();
  }, [])

  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() =>{
    auth.onAuthStateChanged(user =>{
      if(user){
        fs.collection('cart ' + user.uid).onSnapshot(snapshot =>{
          const qty = snapshot.docs.length;
          setTotalProducts(qty);
        })
      }
    })
  }, [])

  let Product;
  const addToCart = (product) =>{
    if(uid!==null){
      //console.log(product);
      Product=product;
      Product['qty'] = 1;
      Product['TotalProductPrice'] = Product.qty*Product.price;
      fs.collection('cart ' + uid).doc(product.ID).set(Product).then(() =>{
        console.log('Añadido correctamente al carrito');
      })
    }
    else{
      props.history.push('/Iniciarsesion');
    }
    
  }

  return (
    <>
      <Navbar user = {user} totalProducts = {totalProducts}/>
      <br></br>
      {products.length > 0 &&(
        <div className='container-fluid'>
          <h1 className='text-center'>Productos</h1>
          <div className='products-box'>
            <Productos products={products} addToCart= {addToCart}/>
          </div>
        </div>
      )}
      {products.length < 1 &&(
        <div className='container-fluid'>Por favor espere...</div>
      )}
    </>
  )
}
