import React from 'react';
import Board from './components/Board';

const App: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '16px' }}>Vrit Tech</h1>
      <Board />
    </div>
  );
};

export default App;
