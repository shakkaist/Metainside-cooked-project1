import React from 'react';
    import SnakeGame from './SnakeGame';

    const App: React.FC = () => {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <SnakeGame />
        </div>
      );
    };

    export default App;
