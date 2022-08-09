import React from 'react';
import ReactDOM from 'react-dom';
import { Stopwatch } from './stopwatch';
import { configureDevtools, configureLogger } from '../../src';

configureDevtools({
  storeConsoleAccess: true,
});

ReactDOM.render(<Stopwatch />, document.getElementById('root'));
