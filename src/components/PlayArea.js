import React from 'react';
import Home from './Home';
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
        console.log('Rendering Login module');
        const {from} = this.props.location.state || {from: {pathName: "/"}};
        if(this.state.redirectToReferrer || fakeAuth.isAuthenticated){ return <Redirect to={from} />;}
        else{ return (
                <div>
                    <h3 style={{color: "red"}}><b><u>Login to start playing </u></b></h3><button onClick={this.login}>Login</button>
                </div>
            );
        }
    }
}

//use withRouter HOC in order to inject match, history and location in your component props
//const { match, location, history } = this.props  (props will contain objects for match, location and history)
//<div>{location.pathname}</div>  OR history.push("/newpath")
const AuthToken = withRouter(({history})=>
    fakeAuth.isAuthenticated ? <p style={{color:"green", textAlign: "right"}}>Welcome! <button onClick={() => fakeAuth.signout(()=>history.push("/"))}>SignOut</button></p>
                            : <p style={{color:"red", textAlign: "right"}}></p>
                    );

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
                        <li><Link to="/minesweeper">MineSweeper</Link></li>
                        <li><Link to="/snakesladders">Snakes&Ladders</Link></li>
                        <li><Link to="/tictactoe">Tic-Tac-Toe</Link></li>
                    </ul>
                </div>
            </nav>
            <AuthToken />
            <PrivateRoute exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/minesweeper" component={MineSweeper} />
            <PrivateRoute path="/snakesladders" component={SnakesLadders} />
            <PrivateRoute path="/tictactoe" component={TicTacToe} />
        </div>
    </Router>
);

export default PlayArea;