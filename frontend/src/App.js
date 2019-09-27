import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Main from './pages/Main';
import Authentication from './components/Authentication';

import logo from './images/yt_logo_rgb_dark.png';

export default function App() {
  return (
    <section className="container">
      <div className="logo" style={{ backgroundImage: `url(${logo})` }} />
      <h1>Live Stream Notification</h1>
      <BrowserRouter>
        <Route path="/" component={Main} />
        <Route path="/authenticate" component={Authentication} />
      </BrowserRouter>
    </section>
  );
}
