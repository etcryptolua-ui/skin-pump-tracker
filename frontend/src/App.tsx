import React from 'react'
import Dashboard from './pages/Dashboard'

export default function App(){
  return <div className='app'><header style={{textAlign:'center', marginBottom:20}}>
    <h1>CS Pump Tracker</h1>
    <p style={{opacity:0.8}}>Monitor de potenciais pumps (dados via API)</p>
  </header><Dashboard/></div>
}
