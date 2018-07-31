import React from 'react';
import MineSweeper from './MineSweeper';
import SnakesLadders from './SnakesLadders';
import TicTacToe from './TicTacToe';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb){
        this.isAuthenticated = true;
        setTimeout(cb, 100); //imitate external auth
    },
    signout(cb){
        this.isAuthenticated = false;
        setTimeout(cb, 100);
    }
}

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            redirectToReferrer: false
        }
    }

    login = () => {
        fakeAuth.authenticate( () => {
            this.setState({
                redirectToReferrer: true
            });
        });
    }

    render = () => {
        const {from} = this.props.location.state || {from: {pathName: "/"}};
        if(this.state.redirectToReferrer){ return <Redirect to={from} />;}
        return (
            <div>
                <p style={{color: "white"}}>Login to view {from.pathname}</p>
                <button onClick={this.login}>Login</button>
            </div>
        );
    }
}

const PrivateRoute = ({component: Component, ...rest}) => 
    (<Route {...rest} render={ props => 
        fakeAuth.isAuthenticated ? <Component {...props}/> : <Redirect to={{pathname: "/login", state: {from: props.location}}}/>} 
    />);

const PlayArea = () => (
    <Router>
        <div>
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/">PlayArea</Link>
                    </div>
                    <ul className="nav navbar-nav">
                        <li className="active"><Link to="/minesweeper">MineSweeper</Link></li>
                        <li><Link to="/snakesladders">Snakes&Ladders</Link></li>
                        <li><Link to="/tictactoe">Tic-Tac-Toe</Link></li>
                    </ul>
                </div>
            </nav>
            <PrivateRoute path="/minesweeper" component={MineSweeper} />
            <Route path="/login" component={Login} />
            <Route path="/snakesladders" component={SnakesLadders} />
            <Route path="/tictactoe" component={TicTacToe} />
        </div>
    </Router>
);

export default PlayArea;