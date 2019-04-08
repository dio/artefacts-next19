import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Main from './Main';
import MembersContextProvider from './contexts/MembersProvider';

function App() {
  return (
    <MembersContextProvider>
      <Router>
        <Route path="/" component={Main} />
      </Router>
    </MembersContextProvider>
  );
}

export default App;
