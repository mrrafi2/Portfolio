import React from 'react';
import Home from './components/home';
import Footer from './components/Footer';
import styles from './App.module.css';
import Layout from './components/layout';

const App = () => {
  return (
    <div className={styles.app}>
   
   <Layout>
   <Home />
   </Layout>
    
    
    </div>
  );
};

export default App;
