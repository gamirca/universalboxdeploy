import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../Navbar';

const Home = () => {
    return (
      <div>
        <Navbar /> {/* Incluindo a barra de navegação */}
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Produtos</h5>
                  <p className="card-text">Veja nossa seleção de produtos incríveis.</p>
                  <Link to="/produtos" className="btn btn-primary">Ver Produtos</Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Clientes</h5>
                  <p className="card-text">Descubra informações sobre nossos clientes.</p>
                  <Link to="/clientes" className="btn btn-primary">Ver Clientes</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default Home