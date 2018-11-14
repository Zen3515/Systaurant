import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';

import Home from './home';
import Login from './login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
      </div>
    );
  }
}

export default App;
