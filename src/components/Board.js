import React from 'react';
import Cell from './Cell';
import { NEW, DOM, END, CLK, MINE_COUNT } from './Constants';

class Board extends React.Component{
    constructor(props){
        super(props);
        this.vBoard = [];
        this.mineCount = 0;
        this.initGame();
        this.state = {
            virtualBoard: this.vBoard
        }
    }

    componentDidMount() {
        this.onCellContextMenu(this.mineCount);
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.gamestatus !== NEW && this.props.gamestatus === NEW){
            this.initGame();
            this.setState({
                virtualBoard: this.vBoard
            });
            this.props.onCellContextMenu(this.mineCount, NEW);
        } 
    }

    initGame(){
        this.initBoard();
        this.deployMines();
        this.numberCells();
    }

    initBoard(){
        let key = 999;
        this.vBoard = [];
        for(let i=0, rows=(this.props.complexity+1)*10; i<rows; i++, key++){
            this.vBoard.push(new Array(rows));
            for(let j=0, cols=this.vBoard[i].length; j<cols; j++, key++){
                this.vBoard[i][j] = {
                    x: i, y: j, m: false, o: false, n: 0, k: key,
                    onCellClick: this.onCellClick,
                    onCellContextMenu: this.onCellContextMenu
                };
            }
        }
    }

    deployMines(){
        let mineCount = MINE_COUNT[this.props.complexity];
        for(let i=0, rows=this.vBoard.length; i<rows && mineCount > 0; i++){
            for(let j=0, cols=this.vBoard[i].length; j<cols && mineCount > 0; j++){
                if(Math.random()*10 > 8){
                    this.vBoard[i][j].m = true;
                    mineCount--;
                }
            }
        }
        this.mineCount = MINE_COUNT[this.props.complexity] - mineCount;
    }

    numberCells(){
        for(let i=0, rows=this.vBoard.length; i<rows; i++){
            for(let j=0, cols=this.vBoard[i].length; j<cols; j++){
                if(!this.vBoard[i][j].m){
                    this.vBoard[i][j].n = this.sniffMineCounts(i,j);
                }
            }
        }
    }

    sniffMineCounts(x, y){
        let mineCount = 0;
        let size = this.vBoard[0].length;
        for(let row=-1; row<2; row++){
            if(x+row < 0 || x+row >= size) continue;
            for(let col=-1; col<2; col++){
                if(y+col < 0 || y+col >= size) continue;
                if(this.vBoard[x+row][y+col].m){
                    mineCount++;
                }
            }
        }
        return mineCount;
    }

    revealEmptyCellsAround = (x, y, vBoard) => {
        const size = vBoard.length;
        if(vBoard[x][y].n === 0){
            vBoard[x][y].o = true;
            for(let row=-1; row<2; row++){
                if(x+row < 0 || x+row >= size) continue;
                for(let col=-1; col<2; col++){
                    if(y+col < 0 || y+col >= size) continue;
                    if(vBoard[x+row][y+col].n === 0 && !vBoard[x+row][y+col].o){
                        vBoard[x+row][y+col].o = true;
                        vBoard = this.revealEmptyCellsAround(x+row, y+col, vBoard);
                    }else if(vBoard[x+row][y+col].n !== 0 && !vBoard[x+row][y+col].o){
                        vBoard[x+row][y+col].o = true;
                    }
                }
            }
        }else{
            vBoard[x][y].o = true;
        }
        return vBoard;
    }

    onCellClick = (cell) => {
        let gamestatus = '';
        if(cell.m){
            this.revealBoard();
            gamestatus = DOM;
        }else{
            let vBoard = JSON.parse(JSON.stringify(this.state.virtualBoard));
            vBoard = this.revealEmptyCellsAround(cell.x, cell.y, vBoard);
            this.setState({
                virtualBoard: vBoard
            });
            gamestatus = this.isGameDone(vBoard) ? END : CLK;
        }
        this.props.onCellClick(gamestatus);
    }

    isGameDone = (vBoard) => {
        const size = vBoard.length;
        for(let i=0; i<size; i++){
            for(let j=0; j<size; j++){
                if(!vBoard[i][j].o && !vBoard[i][j].f){
                    return false;
                }
            }
        }
        return true;
    }

    onCellContextMenu = (n, cell) => {
        let vBoard = JSON.parse(JSON.stringify(this.state.virtualBoard));
        if(n === 1){
            vBoard[cell.x][cell.y].f = false;
        }else if(n === -1){
            vBoard[cell.x][cell.y].f = true;
        }
        this.setState( {virtualBoard : vBoard});
        const gamestatus = this.isGameDone(vBoard) ? END : CLK;
        this.props.onCellContextMenu(n, gamestatus);
    }

    revealBoard = () => {
        let vBoard = JSON.parse(JSON.stringify(this.state.virtualBoard));
        for(let i=0, rows=vBoard.length; i<rows; i++){
            for(let j=0, cols=vBoard[i].length; j<cols; j++){
                vBoard[i][j].o = true;
            }
        }
        this.setState({
            virtualBoard : vBoard
        });
    }

    render(){
        return(
        <div className="board">
        {   this.state.virtualBoard.map((row,index) => (
                <div className="row" key={index}>
                {   row.map(cell => (
                        <Cell key={cell.k} info={cell}  gamestatus={this.props.gamestatus} 
                        onClick={this.onCellClick} onContextMenu={this.onCellContextMenu} />))
                }
                </div>))
        }
        </div> );
    }
}
export default Board;