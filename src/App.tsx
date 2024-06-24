import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Clientes from './pages/Cliente';
import CadastroCliente from './pages/CadastroCliente';
import Login from './pages/Login';
import CadastroFornecedor from './pages/CadastroFornecedor';
import Home from './pages/Home';
import Produtos from './pages/Produtos';
import CadastroProduto from './pages/CadastroProduto';
import { AuthProvider } from './context/AuthContext';
import RotasPrivadas from './context/RotasPrivadas';
import Pedidos from './pages/Pedidos';
import CadastroPedido from './pages/CadastroPedido'
import Fornecedores from './pages/Fornecedores';
import CadastroUsuario from './pages/CadastroUsuario';
import EdicaoPedido from './pages/EdicaoPedido';

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="navbarcomponent" element={<Navbar />} />
            <Route path="cadastroUsuario" element={<CadastroUsuario />} />
            <Route element={<RotasPrivadas />}>
              <Route path="/" element={<Home />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="cadastrocliente" element={<CadastroCliente />} />
              <Route path="produtos" element={<Produtos />} />
              <Route path="cadastroProduto" element={<CadastroProduto />} />
              <Route path="fornecedores" element={<Fornecedores />} />
              <Route path="cadastroFornecedor" element={<CadastroFornecedor />} />
              <Route path="pedidos" element={<Pedidos />} />
              <Route path="cadastroPedido" element={<CadastroPedido />} />
              <Route path="edicaoPedido" element={<EdicaoPedido />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>
  );
};


export default App;


