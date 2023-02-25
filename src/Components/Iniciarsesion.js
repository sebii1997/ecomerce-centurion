import React, {useState} from 'react'
import {auth} from '../Config/Config'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

export const Iniciarsesion = () => {

  const history = useHistory();

  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleIniciarsesion = (e) => {
    e.preventDefault();
    //console.log(email, contraseña);
    auth.signInWithEmailAndPassword(email, contraseña).then(()=>{
      setSuccessMsg('Ingreso exitoso. Sera dirigido automaticamente al inicio de pagina');
      setEmail('');
        setContraseña('');
        setErrorMsg('');
        setTimeout(()=>{
          setSuccessMsg('');
          history.push('/');
        },3000)
    }).catch(error => setErrorMsg(error.message));
  }

  return (
    <div className='container'>
      <br></br>
      <br></br>
      <h1>Iniciar Sesion</h1>
      <hr></hr>
      {successMsg&&<>
        <div className='success-msg'> {successMsg} </div>
        <br></br>
      </>}     
      <form className='form-group' autoComplete='off' onSubmit={handleIniciarsesion}>        
        <label>Email</label>
        <input type="email" className='form-control' required onChange={(e) => setEmail(e.target.value)} value={email}></input>
        <br></br>
        <label>Contraseña</label>
        <input type="password" className='form-control' required onChange={(e) => setContraseña(e.target.value)} value={contraseña}></input>
        <br></br>
        <div className='btn-box'>
          <span>Aun no tienes una cuenta? Registrarse <Link to="Registrarse" className='link'>AQUI</Link></span>
          <button type="submit" className='btn btn-success btn-md'>Iniciar Sesion</button>
        </div>
      </form>
      {errorMsg&&<>
        <br></br>
        <div className='error-msg'> {errorMsg} </div>        
      </>}
    </div>
  )
}
