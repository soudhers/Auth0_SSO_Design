import React from 'react';
import flag from '../images/icn_flag_01.png';

function FlagsCount(props){
    return (
        <div className="flagcount">
            <img src={flag} alt="FlagIcon" />
            <span> {props.count} </span>
        </div>
        );
}

export default FlagsCount;