import React from 'react';
import { IMAGES, NEW } from './Constants';

class Cell extends React.Component{
    constructor(props){
        super(props);
        this.state = {newclass : ""};
    }

    onCellClick = (event) => {
        if(!this.props.info.o && this.state.newclass === ""){
            if(this.props.info.m){
                this.setState( {newclass : "showmine"} );
            }else{
                this.setState( {newclass : "shownumber"} );
            }
            this.props.onClick(this.props.info);
        }
    }

    onCellContextMenu = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(!this.props.info.o){
            const newclass = this.state.newclass === "showflag" ? "" : "showflag";
            this.setState( {newclass : newclass} );
            const count = (newclass === "showflag") ? -1: 1;
            this.props.onContextMenu(count, this.props.info);
        }
    }
    
    shouldComponentUpdate(newProps, newState) {
        if( (this.props.info.o !== newProps.info.o) ||
            (this.state.newclass !== newState.newclass) ||
            (this.props.gamestatus !== NEW && newProps.gamestatus === NEW)
        ){
            return true;
        }else{
            return false;
        }
    }

    componentDidUpdate(prevProps, prevState){
        if( (this.props.gamestatus === NEW && prevProps.gamestatus !== NEW) &&
            (this.state.newclass !== "")
        ){
            this.setState( {newclass: ""} );
        }
    }

    render(){
        let newclass = "cell ";
        if(this.props.info.o){
            if(this.props.info.m) newclass += "showmine";
            else newclass += "shownumber " + IMAGES[this.props.info.n];
        }else{
            if(this.state.newclass === "showflag") newclass += "showflag";
            if(this.state.newclass === "showmine") newclass += "showmine";
            if(this.state.newclass === "shownumber") newclass += "shownumber "+ IMAGES[this.props.info.n];
        }
        return (
            <div>
                <input type="button" className={newclass}
                    onClick={this.onCellClick} onContextMenu={this.onCellContextMenu} />
            </div>
        );
    } 
}
export default Cell;