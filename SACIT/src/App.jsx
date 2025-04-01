import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesComponent from './router/AppRouter.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  return (
    <Router>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <RoutesComponent />
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
