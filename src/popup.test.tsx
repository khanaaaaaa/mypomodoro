/// <reference types="chrome" />
import React, { useState } from 'react';
import './popup.css';

const Popup: React.FC = () => {
  const [test, setTest] = useState('Loading...');

  React.useEffect(() => {
    setTest('Component Mounted');
  }, []);

  return (
    <div className="popup-container">
      <div className="container">
        <div className="header">
          <h1>Flavortown</h1>
          <div className="subtitle">{test}</div>
        </div>
        <button onClick={() => setTest('Button Clicked!')}>Click Me</button>
      </div>
    </div>
  );
};

export default Popup;
