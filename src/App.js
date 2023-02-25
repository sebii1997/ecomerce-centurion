import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Inicio } from './Components/Inicio'
import { Registrarse } from './Components/Registrarse'
import { Iniciarsesion } from './Components/Iniciarsesion'
import { NotFound } from './Components/NotFound'
import { AddProducts } from './Components/AddProducts'
import { Cart } from './Components/Cart'

export const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component = {Inicio} />
        <Route path="/Registrarse" component={Registrarse}/>
        <Route path="/Iniciarsesion" component={Iniciarsesion}/>
        <Route path="/añadir-productos" component={AddProducts}/>
        <Route path="/cart" component={Cart}/>
        <Route component={NotFound}/>
      </Switch>
    </BrowserRouter>
  )
}

export default App