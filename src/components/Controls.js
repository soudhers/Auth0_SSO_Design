import React from 'react';
import Timer from './Timer';
import GameReset from './GameReset';
import FlagsCount from './FlagsCount';

function Controls(props){
    return (
    <div className="controls">
        <Timer gamestatus={props.gamestatus} />
        <GameReset gamestatus={props.gamestatus} onClick={props.onClick} />
        <FlagsCount count={props.minecount} />
    </div>
    );
}

export default Controls;