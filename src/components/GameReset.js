import React from 'react';
import { FACES } from './Constants';

function GameReset(props){
    const face = FACES[props.gamestatus];
    let image;
    switch(face){
        case 'confused' : image = require('../images/confused.png'); break;
        case 'smiley'   : image = require('../images/smiley.png'); break;
        case 'sad'      : image = require('../images/sad.png'); break;
        case 'cool'     : image = require('../images/cool.png'); break;
        default         : image = require('../images/confused.png'); break;
    };
    return (
        <div className="gamereset" onClick={props.onClick}>
            <img src={image} style={{width: "40px", height: "40px"}} alt="Avatar" />
        </div>);
}

export default GameReset;