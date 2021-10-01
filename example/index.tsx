import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stopwatch } from './src/stopwatch';
import { configureMakeLoggable } from '../src';

configureMakeLoggable({
  storeConsoleAccess: true,
})

ReactDOM.render(<Stopwatch />, document.getElementById('root'));
