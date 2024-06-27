import React, { useState, ChangeEvent } from 'react';
import Navbar from '../../Navbar';
import { useNavigate } from 'react-router-dom';

function CadastroFornecedor() {
  const [fornecedores, setFornecedores] = useState({ FornecedorEmpresa: '', FornecedorResponsavel: '', FornecedorTelefone: '', FornecedorCnpj: '' });
  const navigate = useNavigate();  // Uso do useNavigate aqui no topo do componente

  const setInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(value);
    setFornecedores(prevState => ({
      ...prevState,
      [name]: name === 'FornecedorId' ? parseInt(value) : value
    }));
  }

  const createFornecedor = async () => {
    const newData = await fetch('/criarfornecedor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(fornecedores)
    })
      .then(res => res.json());
    console.log(newData);
    navigate('/fornecedores');

  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title">Cadastrar Fornecedor</h1>
                <div className="form-group">
                  <input
                    className="form-control mb-3"
                    placeholder="Empresa"
                    name="FornecedorEmpresa"
                    value={fornecedores.FornecedorEmpresa}
                    onChange={setInput} />

                  <input
                    className="form-control mb-3"
                    placeholder="Responsavel"
                    name="FornecedorResponsavel"
                    value={fornecedores.FornecedorResponsavel}
                    onChange={setInput} />

                  <input
                    className="form-control mb-3"
                    placeholder="Telefone"
                    name="FornecedorTelefone"
                    value={fornecedores.FornecedorTelefone}
                    onChange={setInput} />

                  <input

                    className="form-control mb-3"
                    placeholder="CNPJ"
                    name="FornecedorCnpj"
                    value={fornecedores.FornecedorCnpj}
                    onChange={setInput} />
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={createFornecedor}>
                  Cadastrar Novo Fornecedor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroFornecedor;