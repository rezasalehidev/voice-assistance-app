import React from 'react';
import VoiceAssistant from './components/VoiceAssistant';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Voice Assistant</h1>
      <VoiceAssistant />
    </div>
  );
};

export default App;