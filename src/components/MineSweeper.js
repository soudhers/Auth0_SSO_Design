import React from 'react';
import Controls from './Controls';
import Board from './Board';
import { EASY, NEW, CLK } from './Constants';

class MineSweeper extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            complexity: EASY,
            gamestatus: NEW,
            minecount: 0
        };
    }
    onControlClick = () => {
        if(this.state.gamestatus === NEW){
            this.setState( {gamestatus: CLK} );
        }else{
            this.setState( {gamestatus: NEW} );
        }
    }
    onCellClick = (status) => {
        this.setState( {gamestatus: status} );
    }
    onCellContextMenu = (n, status) => {
        if(n===-1 || n===1){
            const count = this.state.minecount + n;
            this.setState( {
                minecount: count,
                gamestatus: status
            });
        }else{
            this.setState( {minecount: n} );
        }
    }
    render(){
        return (
            <div className="minesweeper">
                <Controls minecount={this.state.minecount}
                    gamestatus={this.state.gamestatus} onClick={this.onControlClick} />
                <Board complexity={this.state.complexity} gamestatus={this.state.gamestatus} 
                    onCellClick={this.onCellClick} onCellContextMenu={this.onCellContextMenu} />
            </div>);
    }
}
export default MineSweeper;