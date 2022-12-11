import './App.css';
import LatexRenderer from './components/LatexRenderer';
import Button from './components/Button';
import { useState, useEffect, React } from 'react';
import { Forms, MessageDots, MathSymbols, Microphone, PlayerStop, Check, X } from 'tabler-icons-react';
import promptTemplate from './prompt';
import TypeWriterEffect from 'react-typewriter-effect';

///////////////////////////////////////////
// OpenAI API
//////////////////////////////////////////
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_NOT_SECRET_CODE,
});

const openai = new OpenAIApi(configuration);


////////////////////////////////////////////////////

const inputStates = ["none","text","voice"];

////////////////////////////////////////////////////

function App() {
  const [response, setResponse] = useState(null);
  const [latex, setLatex] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const [inputState, setInputState] = useState(0);

  useEffect(() => {
    console.log("RENDERING!");
  }, []);

  const fetchResponse = async (prompt) => {
    const completion = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 1000,
    prompt: promptTemplate + prompt + "\nZelda:",
    });

    try {
      const answerObj = JSON.parse(completion.data.choices[0].text);
    
      answerObj.latex === undefined ? setLatex(null) : setLatex(answerObj.latex);
      setResponse(answerObj.response);
      console.log(answerObj);
  
      console.log(answerObj.latex);

    } catch (error) {
      const answerObj = {
        response: "I've encountered an error. Please try again.",
        latex: null
      };
    
      answerObj.latex === undefined ? setLatex(null) : setLatex(answerObj.latex);
      setResponse(answerObj.response);
  
      console.log(answerObj);
    }
  };

  // Handling Satate FUNCTION

  const handleInputState = (state) => {
    console.log("Setting input state to: " + state);
    setInputState(state);
    console.log(state);
  }

  //FUNCTIONS

  const sendText = (text) => {
    setResponse("(Thinking...)");
    setLatex(null);
    fetchResponse(text);
    handleInputState(0);
    setInputValue("");
  }



  return (
    <div className="App">

      <img className="Logo" src={require("./img/zeldalogo.png")} alt="Zelda Logo" />
      
      <div  className='Video'>
        <img className='Gif' src={require("./img/thinking_loop.gif")} alt="gif"/>
      </div>

      <div 
        className='LatexContainer'
        style = {
          {
            display: latex && inputState === 0 ? 'flex' : 'none'
            ,
            maxWidth: "400px",
          }
        }>
        {latex !== null ? <LatexRenderer latex={latex} /> : <p></p>}
      </div>

      <div 
        className='ResponseContainer'
        style = {
          {
            display: response && inputState === 0 ? 'flex' : 'none'
          }
        }>
        <p>
          {response}
        </p>
      </div>

      <div className='Buttons'
        style = {
          {
            display: inputState === 0 ? 'flex' : 'none'
          }
        }>
        <Button 
          icon={<Microphone size={36} 
          color="#56ECA3"/>} 
          />
        <Button 
          icon={<Forms size={36} 
          color="#6798FF" />} 
          onClick={ () => {handleInputState(1)} }
          />
      </div>

      <div className='TextInputContainer'
        style = {
          {
            display: inputState === 1 ? 'flex' : 'none'
          }
        }>
        <MessageDots
          className='InputIcon'
          size={50}
          color="white" />
        <input className='InputText'
          input={inputValue}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          >
        </input>
        <Button className='InputButtons' 
          icon={<Check size={36} 
          color="#56ECA3"/>} 
          onClick={ () => {sendText(inputValue)} }
          />
        <Button className='InputButtons' 
          icon={<X size={36} 
          color="#FF8080" 
          onClick={ () => {handleInputState(0);setInputValue("");} }
          />} 
          />
      </div>

    </div>
  );
}


export default App;