import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../Navbar';
import { useOrdenacao } from '../../context/useOrdenacao';

interface Produto {
  ProdutoId: string;
  ProdutoNome: string;
  FornecedorNome: string;
  ProdutoModelo: string;
  ProdutoPreco: number;
  ProdutoQuantidade: number;
}

function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [deletarProduto, setDeletarProduto] = useState<{ ProdutoId: string }>({ ProdutoId: '' });
  const { itens: produtosOrdenados, solicitarOrdenacao, obterClassNamesPara } = useOrdenacao(produtos);

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroFornecedor, setFiltroFornecedor] = useState('');
  const [filtroModelo, setFiltroModelo] = useState('');
  const [filtroPreco, setFiltroPreco] = useState('');
  const [filtroQuantidade, setFiltroQuantidade] = useState('');

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await fetch('/api');
        if (!response.ok) {
          throw new Error('Erro ao obter os dados');
        }
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    buscarDados();
  }, []);

  const deletarProdutoAPI = async () => {
    await fetch('/deletar', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(deletarProduto)
    }).then(res => res.json());
  };

  const deletarProdutoEstado = (produtoId: string) => {
    console.log(produtoId);
    setDeletarProduto({ ProdutoId: produtoId });
  };

  useEffect(() => {
    if (deletarProduto.ProdutoId !== '') {
      deletarProdutoAPI();
    }
  }, [deletarProduto]);

  const handleFiltroNome = (e: ChangeEvent<HTMLInputElement>) => setFiltroNome(e.target.value);
  const handleFiltroFornecedor = (e: ChangeEvent<HTMLInputElement>) => setFiltroFornecedor(e.target.value);
  const handleFiltroModelo = (e: ChangeEvent<HTMLInputElement>) => setFiltroModelo(e.target.value);
  const handleFiltroPreco = (e: ChangeEvent<HTMLInputElement>) => setFiltroPreco(e.target.value);
  const handleFiltroQuantidade = (e: ChangeEvent<HTMLInputElement>) => setFiltroQuantidade(e.target.value);

  const produtosFiltrados = produtosOrdenados.filter(produto => {
    return (
      (produto.ProdutoNome?.toLowerCase().includes(filtroNome.toLowerCase()) ?? true) &&
      (produto.FornecedorNome?.toLowerCase().includes(filtroFornecedor.toLowerCase()) ?? true) &&
      (produto.ProdutoModelo?.toLowerCase().includes(filtroModelo.toLowerCase()) ?? true) &&
      (filtroPreco === '' || produto.ProdutoPreco === parseFloat(filtroPreco)) &&
      (filtroQuantidade === '' || produto.ProdutoQuantidade === parseInt(filtroQuantidade))
    );
  });

  const renderIconeOrdenacao = (chave: keyof Produto) => {
    if (!obterClassNamesPara(chave)) {
      return <FontAwesomeIcon icon={faSortUp} className="sort-icon" />;
    }
    if (obterClassNamesPara(chave) === 'ascendente') {
      return <FontAwesomeIcon icon={faSortUp} className="sort-icon" />;
    }
    return <FontAwesomeIcon icon={faSortDown} className="sort-icon" />;
  };

  const atualizarQuantidade = async (produtoId: string, novaQuantidade: number) => {
    try {
      const response = await fetch('/atualizarQuantidade', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ ProdutoId: produtoId, Quantidade: novaQuantidade })
      });
  
      if (!response.ok) {
        throw new Error('Erro ao atualizar a quantidade');
      }
  
      // Atualizar o estado local dos produtos
      setProdutos(produtos.map(produto =>
        produto.ProdutoId === produtoId ? { ...produto, ProdutoQuantidade: novaQuantidade } : produto
      ));
    } catch (error) {
      console.error('Erro ao atualizar a quantidade:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2>Lista de Produtos</h2>
        <Link to="/cadastroproduto" className="btn btn-primary mb-3">Cadastrar Novo Produto</Link>

        <div className="row mb-3">
          <div className="col">
            <input type="text" className="form-control" placeholder="Nome" value={filtroNome} onChange={handleFiltroNome} />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="Fornecedor" value={filtroFornecedor} onChange={handleFiltroFornecedor} />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="Modelo" value={filtroModelo} onChange={handleFiltroModelo} />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="Preço" value={filtroPreco} onChange={handleFiltroPreco} />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="Quantidade" value={filtroQuantidade} onChange={handleFiltroQuantidade} />
          </div>
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col" onClick={() => solicitarOrdenacao('ProdutoId')} className={obterClassNamesPara('ProdutoId')}>
                ID {renderIconeOrdenacao('ProdutoId')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('ProdutoNome')} className={obterClassNamesPara('ProdutoNome')}>
                Nome {renderIconeOrdenacao('ProdutoNome')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('FornecedorNome')} className={obterClassNamesPara('FornecedorNome')}>
                Fornecedor {renderIconeOrdenacao('FornecedorNome')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('ProdutoModelo')} className={obterClassNamesPara('ProdutoModelo')}>
                Modelo {renderIconeOrdenacao('ProdutoModelo')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('ProdutoPreco')} className={obterClassNamesPara('ProdutoPreco')}>
                Preço {renderIconeOrdenacao('ProdutoPreco')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('ProdutoQuantidade')} className={obterClassNamesPara('ProdutoQuantidade')}>
                Quantidade {renderIconeOrdenacao('ProdutoQuantidade')}
              </th>
              <th scope="col">Ação</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map((produto) => (
              <tr key={produto.ProdutoId}>
                <td>{produto.ProdutoId}</td>
                <td>{produto.ProdutoNome}</td>
                <td>{produto.FornecedorNome}</td>
                <td>{produto.ProdutoModelo}</td>
                <td>{produto.ProdutoPreco}</td>
                <td>
                  <button className="btn btn-outline-secondary quantidade-btn" onClick={() => atualizarQuantidade(produto.ProdutoId, produto.ProdutoQuantidade - 1)}>-</button>
                  {produto.ProdutoQuantidade}
                  <button className="btn btn-outline-secondary quantidade-btn" onClick={() => atualizarQuantidade(produto.ProdutoId, produto.ProdutoQuantidade + 1)}>+</button>
                </td>
                <td>
                  <button className="btn btn-outline-secondary btn-sm quantidade-btn delete-btn" onClick={() => deletarProdutoEstado(produto.ProdutoId)}>
                    <FontAwesomeIcon icon={faTrash} className="trash-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Produtos;
