import { Router, RouteComponentProps } from '@reach/router';
import React from 'react';

import './App.css';

import Introduction from './pages/introduction';
import Layout from './components/layout';
import API from './pages/api';
import Highlighter from './components/highlighter/highlighter';
import GalleryPanel from './components/gallery-panel';

const HomeWrapper = (props: RouteComponentProps) => {
  return <GalleryPanelWrapper />;
};

const IntroductionWrapper = (props: RouteComponentProps) => {
  return (
    <article>
      <Highlighter>
        <Introduction />
      </Highlighter>
    </article>
  );
};

const APIWrapper = (props: RouteComponentProps) => {
  return (
    <article>
      <Highlighter>
        <API />
      </Highlighter>
    </article>
  );
};
const GalleryPanelWrapper = (props: RouteComponentProps) => {
  return <GalleryPanel></GalleryPanel>;
};
// const AllIconKeys = Object.keys(AllIcons);

function App() {
  return (
    <Layout>
      <Router>
        <HomeWrapper path="/"></HomeWrapper>
        <IntroductionWrapper path="/introduction"></IntroductionWrapper>
        <APIWrapper path="/api"></APIWrapper>
      </Router>
    </Layout>
  );
}

export default App;
