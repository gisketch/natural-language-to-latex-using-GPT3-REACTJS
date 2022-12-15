import './App.css';
import LatexRenderer from './components/LatexRenderer';
import Button from './components/Button';
import { useState, useEffect, React } from 'react';
import { Forms, MessageDots, MathSymbols, Microphone, PlayerStop, Check, X } from 'tabler-icons-react';
import promptTemplate from './prompt';
import corePrompt from './corePrompt';
import Polly from './Polly';

//////////////////////////////////////////////
// Save prompt to file
//////////////////////////////////////////////

//Initialize



///////////////////////////////////////////
// OpenAI API
//////////////////////////////////////////
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_NOT_SECRET_CODE,
});

const openai = new OpenAIApi(configuration);



////////////////////////////////////////////////////

//const inputStates = ["none","text","voice"];

////////////////////////////////////////////////////

function App() {
  const [response, setResponse] = useState(null);
  const [latex, setLatex] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const [inputState, setInputState] = useState(0);
  const [promptFs, setPromptFs] = useState(promptTemplate);
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    console.log("RENDERING!");
  }, []);

///////////////////////////////////////////////////////////
///////////////// OPEN AI METHODS /////////////////////////
///////////////////////////////////////////////////////////
  const fetchResponse = async (prompt) => {
    const completion = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 1000,
    prompt: corePrompt + promptFs + "\nHuman: " + prompt + "\nZelda:",
    });

    console.log(completion.data.choices[0].text);
    
    try {
      const answerObj = JSON.parse(completion.data.choices[0].text);
    
      answerObj.latex === undefined ? setLatex(null) : setLatex(answerObj.latex);
      ///////PLAY AUDIO WITH POLLY /////

      Polly(answerObj.response);

      ///////SET RESPONSE//////////////
      if(answerObj.response.length < 150)
      {
        setResponse(answerObj.response);
      } else {
        //cut response into 150 char chunks (words shouldn't be separated) for every x seconds, display each chunk at a time
        const responseChunks = answerObj.response.match(/.{1,150}/g);
        console.log(responseChunks);
        setResponse(responseChunks[0] + "...");
        for(let i = 1; i < responseChunks.length; i++)
        {
          setTimeout(() => {
            setResponse("..." + responseChunks[i]);
          }, 5000 * i); //CHANGE THIS TO ANYTHING YOU WANT << TIMEOUT NI MS
        }
      }


      ///////////////////////////////////
      console.log(answerObj);
      console.log(answerObj.latex);

      //Add Zelda's response to promptFs
      setPromptFs(promptFs + "\nHuman: " + prompt + "\nZelda:" + completion.data.choices[0].text);

    } catch (error) {

      console.log("ERROR: " + error);
      const answerObj = {
        response: "I've encountered an error. Please try again.",
        latex: null
      };
    
      answerObj.latex === undefined ? setLatex(null) : setLatex(answerObj.latex);
      setResponse(answerObj.response);
      console.log(answerObj);

      //Add Zelda's response to promptFs
      setPromptFs(promptFs + "\nHuman: " + prompt + "\nZelda:" + completion.data.choices[0].text);
    }
    console.log(promptFs);
  };

  // Handling State FUNCTION

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
    setPromptFs(promptFs + "\nHuman: " + text);
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
            //#fff Only show LATEX CONTAINER when there is latex and inputState is 0
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
          color="#fff"/>}
          onClick={ () => {setPromptFs(promptTemplate)} } 
          />
        <Button 
          icon={<Microphone size={36} 
          color="#56ECA3"/>}
          onClick={ () => {} } 
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