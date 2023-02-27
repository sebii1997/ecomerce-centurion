import React, {useState, useEffect} from 'react'
import { Navbar } from './Navbar'
import { Productos } from './Productos'
import {auth, fs} from '../Config/Config'
import { IndividualFilteredProduct } from './IndividualFilteredProduct'

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

  const [spans] = useState([
    {id: 'Placasmadres', text: 'Placas madres'},
    {id: 'Gabinete', text: 'Gabinete'},
    {id: 'Procesadores', text: 'Procesadores'},
    {id: 'Memoriaram', text: 'Memoria ram'},
    {id: 'Placasdevideo', text: 'Placas de video'},
    {id: 'Monitores', text: 'Monitores'},
    {id: 'DiscosSSD', text: 'Discos SSD'},
    {id: 'Fuentes', text: 'Fuentes'},
    {id: 'Notebooks', text: 'Notebooks'},    
  ])

  const [active, setActive] = useState('');

  const [category, setCategory] = useState('');

  const handleChange = (individualSpan) =>{
    setActive(individualSpan.id);
    setCategory(individualSpan.text);
    filterFunction(individualSpan.text);
  }

  const [filteredProducts, setFilteredProducts] = useState([]);

  const filterFunction = (text) =>{
      if(products.length>1){
        const filter=products.filter((product) => product.category===text);
        setFilteredProducts(filter);
      }
      else{
        console.log('No hay productos para filtrar');
      }
  }

  const returntoAllProducts = () =>{
    setActive('');
    setCategory('');
    setFilteredProducts([]);
  }

  return (
    <>
      <Navbar user = {user} totalProducts = {totalProducts}/>
      <br></br>  
      <div className='container-fluid filter-products-main-box'>
        <div className='filter-box'>
          <h6>Filtrar por categoria</h6>
          {spans.map((individualSpan, index) =>(
            <span key={index} id={individualSpan.id} onClick={()=>handleChange(individualSpan)} className={individualSpan.id===active ? active:'deactive'}>{individualSpan.text}</span>
          ))}
        </div>
        {filteredProducts.length > 0 &&(
          <div className='my-products'>
            <h1 className='text-center'>{category}</h1>
            <a href="javascript:void(0)" onClick={returntoAllProducts}>Volver a todos los productos</a>
            <div className='products-box'>
              {filteredProducts.map(individualFilteredProduct =>(
                <IndividualFilteredProduct key={individualFilteredProduct.ID} individualFilteredProduct={individualFilteredProduct}
                addToCart={addToCart}/>
              ))}
            </div>
          </div>
        )}
        {filteredProducts.length < 1 &&(
          <>
            {products.length > 0 &&(
              <div className='my-products'>
                <h1 className='text-center'>Todos los productos</h1>
                <div className='products-box'>
                  <Productos products={products} addToCart={addToCart}/>
                </div>
              </div>
            )}
            {products.length < 1 &&(
              <div className='my-products please-wait'>Por favor espere...</div>
            )}
          </>
        )}
      </div>    
    </>
  )
}
