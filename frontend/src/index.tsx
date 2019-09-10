import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { IndexedDBAppClient } from './client/idb';
import { GlobalContainer } from './shared';

const container = document.getElementById('root');
if (!container) {
  throw new Error('DOM container is missing');
}

ReactDOM.render(
  <BrowserRouter>
    <GlobalContainer>
      <App client={new IndexedDBAppClient()}/>
    </GlobalContainer>
  </BrowserRouter>,
  container
);
