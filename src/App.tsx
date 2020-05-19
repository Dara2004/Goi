import React, { useRef, useEffect } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import CardView from './components/CardView';
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';


// import Session from './components/Session';
// import Statistics from './components/Statistics';

export default function App() {

  return (
    <>
      <div className="container">
        <NavBar></NavBar>
        <div>
          <CodeMirror
            value='<h1></h1>'
            options={{
              mode: 'xml',
              theme: 'material',
              lineNumbers: true
            }}
            onChange={(editor, data, value) => {
            }}
          /></div>
        <CardView></CardView>
      </div>
    </>
  );
}
