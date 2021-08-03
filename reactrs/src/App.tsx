import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'
import './App.css';
import './Zokrates';

function App() {
  return (
    <div className="App">
      <div className="Center">
        <span>{window.statusMessage}</span>
        <ProgressBar animated now={window.progress} />
      </div>
    </div>
  );
}

export default App;
