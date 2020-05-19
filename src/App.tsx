import React, { useRef, useEffect } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import CardView from './components/CardView';
import { UnControlled as CodeMirror } from 'react-codemirror2'
import CodeEditor from './components/CardEditor';
import CommandEditor from './components/CommandEditor';
import Session from './components/Session';
// import Session from './components/Session';
// import Statistics from './components/Statistics';

export default function App() {

  return (
    <>
      <div className="navbar">
        <NavBar></NavBar>
      </div>
      <div className="container">
        <CodeEditor></CodeEditor>
        <CommandEditor></CommandEditor>
        <CardView></CardView>
        <Session></Session>
      </div>
    </>
  );
}
