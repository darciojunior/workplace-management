import './App.css';

import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';

import Logo from './components/templates/Logo';
import Header from './components/templates/Header';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Logo />
        <Header />
        <Routes />
      </div>
    </BrowserRouter>
  );
}

export default App;