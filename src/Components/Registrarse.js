import React, {useState} from 'react'
import {auth, fs} from '../Config/Config'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

export const Registrarse = () => {

  const history = useHistory();

  const [nombreCompleto, setNombrecompleto] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegistrarse = (e) =>{
    e.preventDefault();
    //console.log(nombreCompleto, email, contraseña);
    auth.createUserWithEmailAndPassword(email, contraseña).then((credentials)=>{
      console.log(credentials);
      fs.collection('users').doc(credentials.user.uid).set({
        NombreCompleto: nombreCompleto,
        Email: email,
        Contraseña: contraseña
      }).then(()=>{
        setSuccessMsg('Registracion exitosa. Sera dirigido automaticamente al inicio de sesion')
        setNombrecompleto('');
        setEmail('');
        setContraseña('');
        setErrorMsg('');
        setTimeout(()=>{
          setSuccessMsg('');
          history.push('/Iniciarsesion');
        },3000)
      }).catch(error => setErrorMsg(error.message));
    }).catch((error)=>{
      setErrorMsg(error.message)
    })
  }

  return (
    <div className='container'>
      <br></br>
      <br></br>
      <h1>Registrarse</h1>
      <hr></hr> 
      {successMsg&&<>
        <div className='success-msg'> {successMsg} </div>
        <br></br>
      </>}     
      <form className='form-group' autoComplete='off' onSubmit={handleRegistrarse}>
        <label>Nombre completo</label>
        <input type="text" className='form-control' required onChange={(e) => setNombrecompleto(e.target.value)} value={nombreCompleto}></input>
        <br></br>
        <label>Email</label>
        <input type="email" className='form-control' required onChange={(e) => setEmail(e.target.value)} value={email}></input>
        <br></br>
        <label>Contraseña</label>
        <input type="password" className='form-control' required onChange={(e) => setContraseña(e.target.value)} value={contraseña}></input>
        <br></br>
        <div className='btn-box'>
          <span>Ya tienes una cuenta? Inicia sesion <Link to="Iniciarsesion" className='link'>AQUI</Link></span>
          <button type="submit" className='btn btn-success btn-md'>Registrarse</button>
        </div>
      </form>
      {errorMsg&&<>
        <br></br>
        <div className='error-msg'> {errorMsg} </div>        
      </>}
    </div>
  )
}
