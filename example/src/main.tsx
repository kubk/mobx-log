import React from 'react';
import ReactDOM from 'react-dom';
import { Stopwatch } from './stopwatch';
import { configureMakeLoggable } from '../../src';

configureMakeLoggable({
  storeConsoleAccess: true,
});

ReactDOM.render(
  <React.StrictMode>
    <Stopwatch />
  </React.StrictMode>,
  document.getElementById('root')
);
