// src/App.jsx
// Main application component

import React from 'react';
import StoryEngine from './components/StoryEngine';

function App() {
  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      <StoryEngine className="w-full h-full" />
    </div>
  );
}

export default App;
