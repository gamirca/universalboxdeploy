import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import logo from '../src/img/LOGOMENOR.png';

function Navbar() {
  const [showText, setShowText] = useState(true);
  const { email, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleText = () => {
    setShowText(!showText);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link to="/">
          <img src={logo} alt="logo" className="logo2" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleText}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${showText ? 'show' : ''}`} id="navbarColor01">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to="/produtos" className="nav-link">Produtos</Link>
            </li>
            <li className="nav-item">
              <Link to="/clientes" className="nav-link">Clientes</Link>
            </li>
            <li className="nav-item">
              <Link to="/fornecedores" className="nav-link">Fornecedores</Link>
            </li>
            <li className="nav-item">
              <Link to="/pedidos" className="nav-link">Pedidos</Link>
            </li>
            {!email ? (
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
            ) : (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
