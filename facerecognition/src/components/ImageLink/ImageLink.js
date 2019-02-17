import React from "react";
import './ImageLink.css'

const ImageLink = ({onInputChange, onButtonSubmit}) => {
  return (
    <div>
        <p className="f3">  
        {'this magic will detect faces in pictures'}</p>
        <div className="center">
            <div className="form pa4 br3 shadow-5 center">
                <input onChange={onInputChange} className='f4 pa2 w-70 center'></input>
                <button onClick={onButtonSubmit} className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple">Detect</button>
            </div>
        </div>
    </div>
  );
};

export default ImageLink;
