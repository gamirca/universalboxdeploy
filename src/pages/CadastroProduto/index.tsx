import React, { useState, useEffect, ChangeEvent } from 'react';
import Navbar from '../../Navbar';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Fornecedor {
  FornecedorId: number;
  Empresa: string;
}

function CadastroProduto() {
  const navigate = useNavigate();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [produto, setProduto] = useState({ ProdutoNome: '', FornecedorId: 0, ProdutoModelo: '', ProdutoPreco: 0, ProdutoQuantidade: 0 });

  // Buscar lista de fornecedores
  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const response = await fetch('https://universalboxdeploy.vercel.app/apifornecedor');
        if (!response.ok) {
          throw new Error('Erro ao obter os dados');
        }
        const data = await response.json();
        console.log(data);
        setFornecedores(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    fetchFornecedores();
  }, []);

  const setInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduto(prevState => ({
      ...prevState,
      [name]: name === 'ProdutoPreco' ? parseFloat(value) : name === 'ProdutoQuantidade' ? parseInt(value) : value
    }));
  };

  const setFornecedorSel = (selectedOption: { value: number }) => {
    setProduto(prevState => ({
      ...prevState,
      FornecedorId: selectedOption.value
    }));
  };

  const createProduto = async () => {
    await fetch('/criar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(produto)
    }).then(res => res.json());

    navigate('/produtos');
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title">Cadastrar Produto</h1>
                <div className="form-group">
                  <input
                    className="form-control mb-3"
                    placeholder="Nome"
                    name="ProdutoNome"
                    value={produto.ProdutoNome}
                    onChange={setInput} />

                  <Select
                    className="mb-3"
                    placeholder="Fornecedor"
                    options={fornecedores.map(fornecedor => ({ value: fornecedor.FornecedorId, label: fornecedor.Empresa }))}
                    onChange={(e) => setFornecedorSel(e as { value: number })}
                  />

                  <input
                    className="form-control mb-3"
                    placeholder="Modelo"
                    name="ProdutoModelo"
                    value={produto.ProdutoModelo}
                    onChange={setInput} />

                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Preco"
                    name="ProdutoPreco"
                    value={produto.ProdutoPreco}
                    onChange={setInput} />

                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Quantidade"
                    name="ProdutoQuantidade"
                    value={produto.ProdutoQuantidade}
                    onChange={setInput} />
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={createProduto}>
                  Cadastrar Novo Produto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroProduto;
