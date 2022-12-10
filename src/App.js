import './App.css';
import LatexRenderer from './components/LatexRenderer';
import Button from './components/Button';
import { useState, useEffect, React } from 'react';


function App() {



  return (
    <div className="App">

      <div className='Container'>
        <div  className='Video'>
        </div>
        <div className='Panel'>
          <div className='Info'>
            <div className='Title'>
              <p>Input:</p>
            </div>
            <div className='Answer'>
              <p>Here's your equation!</p>
              <LatexRenderer latex="$\left [ \frac{a}{b} \right ]$" />
            </div>
            <div className='Inputs'>
              <input type="text" name="problem"></input>
              <Button label="Generate" />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}


export default App;
