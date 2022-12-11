import React from 'react';
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next';

function LatexRenderer(props) {
  return (
    <h3>
      <Latex>
      {props.latex}
      </Latex>
    </h3>
  );
}


export default LatexRenderer;