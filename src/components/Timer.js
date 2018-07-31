import React from 'react';
import clock from '../images/clock.png';
import { NEW, CLK, DOM, END } from './Constants';

class Timer extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            time : 0
        };
        this.tick = this.tick.bind(this);
    }

    tick(){
        let newTime = this.state.time + 1;
        this.setState({
            time: newTime
        }); 
    }

    componentDidUpdate(prevProps){
        if(prevProps.gamestatus !== this.props.gamestatus){
            if(this.props.gamestatus === CLK){
                this.interval = setInterval(this.tick, 1000);
            }else if(this.props.gamestatus === NEW){
                clearInterval(this.interval);
                this.setState({
                    time: 0
                }); 
            }else if(this.props.gamestatus === DOM || this.props.gamestatus === END){
                clearInterval(this.interval);
            }
        }
    }

    render(){
        return (
            <div className="timer">
                <img src={clock} alt="Timer" />
                <span> {this.state.time} </span>
            </div>
        )
    }
}

export default Timer;