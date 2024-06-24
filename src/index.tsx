import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Clientes from './pages/Cliente';
import CadastroCliente from './pages/CadastroCliente';
import Login from './pages/Login';
import CadastroFornecedor from './pages/CadastroFornecedor';
import Home from './pages/Home';
import Produtos from './pages/Produtos';
import './styles/global.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import CadastroProduto from './pages/CadastroProduto';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);