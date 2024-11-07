import React, { useState } from 'react'
import Navbar from './component/Navbar/Navbar'
import Store from '../src/Store'


export default function App() {
  const[sign,setSign]=useState();
  function SignUp(){

  }

  return (
    <div>
      <Navbar/>
      <Store SignUp={SignUp} />
    </div>
  )
}
