import './App.css';
import LatexRenderer from './components/LatexRenderer';
import Button from './components/Button';
import { useState, useEffect, React } from 'react';
///////////////////////////////////////////
// OpenAI API
//////////////////////////////////////////
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_NOT_SECRET_CODE,
});

const openai = new OpenAIApi(configuration);


////////////////////////////////////////////////////

function App() {
  const [answer, setAnswer] = useState(null);
  const [inputValue, setInputValue] = useState(null);

  useEffect(() => {
    
  }, []);

  const fetchResponse = async (prompt) => {
    setAnswer(null);
    const completion = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 1000,
    prompt: `ONLY Reply with Latex Equations converted from Natural Language in a format enclosed in $

    DO NOT SOLVE
    
    Prompt: Ashley bought a big bag of candy to share with her friends. In total, there were 296 candies. She gave 105 candies to Marissa. She also gave 86 candies to Kayla. How many candies were left?
    Latex: $296 - 105 - 86 = ?$
    Prompt: ${prompt}
    Latex: `,
    });
    console.log(prompt);
    setAnswer(completion.data.choices[0].text);
  };

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
              {answer !== null ? <LatexRenderer latex={answer} /> : <p>waiting...</p>}
            </div>
            <div className='Inputs'>
              <input type="text" name="problem" input={inputValue} onChange={event => setInputValue(event.target.value)}></input>
              <Button label="Generate" onClick={ () => {fetchResponse(inputValue)} }/>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}


export default App;
