import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../Images/logo.png'
import {Icon} from 'react-icons-kit'
import {shoppingCart} from 'react-icons-kit/feather/shoppingCart'
import {auth} from '../Config/Config'
import { useHistory } from 'react-router-dom'

export const Navbar = ({user, totalProducts}) => {

  const history = useHistory();

  const handleSalir=()=>{
      auth.signOut().then(()=>{
          history.push('/Iniciarsesion');
      })
  }

  return (
    <div className='navbar'>
      <div className='leftside'>
        <div className='logo'>
          <img src={logo} alt='logo'/>
        </div>
      </div>
      <div className='rightside'>
        {!user&&<>
          <div><Link className='navlink' to="Registrarse">Registrarse</Link></div>
          <div><Link className='navlink' to="Iniciarsesion">Iniciar Sesion</Link></div>
        </>}

        {user&&<>
          <div><Link className='navlink' to="/">{user}</Link></div>
          <div className='cart-menu-btn'>
              <Link className='navlink' to="/cart">
                  <Icon icon={shoppingCart} size={20}/>
              </Link>
              <span className='cart-indicator'>{totalProducts}</span>
          </div>
          <div className='btn btn-danger btn-md' onClick={handleSalir}>Salir</div>
        </>}
        
      </div>
    </div>
  )
}
