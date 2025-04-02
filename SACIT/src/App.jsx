import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesComponent from './router/AppRouter.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function App() {

  return (
    <Router>
      <RoutesComponent />
    </Router>
  )
}

export default App
