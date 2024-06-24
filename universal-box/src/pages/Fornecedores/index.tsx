import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../Navbar';
import { useOrdenacao } from '../../context/useOrdenacao';

interface Fornecedor {
  FornecedorId: string;
  Empresa: string;
  Responsavel: string;
  Telefone: string;
  Cnpj: string;
}

function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [deletarFornecedor, setDeletarFornecedor] = useState<{ FornecedorId: string }>({ FornecedorId: '' });
  const { itens: fornecedoresOrdenados, solicitarOrdenacao, obterClassNamesPara } = useOrdenacao(fornecedores);

  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [filtroResponsavel, setFiltroResponsavel] = useState('');
  const [filtroTelefone, setFiltroTelefone] = useState('');
  const [filtroCnpj, setFiltroCnpj] = useState('');

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await fetch('/apifornecedor');
        if (!response.ok) {
          throw new Error('Erro ao obter os dados');
        }
        const data = await response.json();
        setFornecedores(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    buscarDados();
  }, []);

  const deletarFornecedorAPI = async () => {
    await fetch('/deletarfornecedor', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(deletarFornecedor)
    }).then(res => res.json());
  };

  const deletarFornecedorEstado = (fornecedorId: string) => {
    console.log(fornecedorId);
    setDeletarFornecedor({ FornecedorId: fornecedorId });
  };

  useEffect(() => {
    if (deletarFornecedor.FornecedorId !== '') {
      deletarFornecedorAPI();
    }
  }, [deletarFornecedor]);

  const handleFiltroEmpresa = (e: ChangeEvent<HTMLInputElement>) => setFiltroEmpresa(e.target.value);
  const handleFiltroResponsavel = (e: ChangeEvent<HTMLInputElement>) => setFiltroResponsavel(e.target.value);
  const handleFiltroTelefone = (e: ChangeEvent<HTMLInputElement>) => setFiltroTelefone(e.target.value);
  const handleFiltroCnpj = (e: ChangeEvent<HTMLInputElement>) => setFiltroCnpj(e.target.value);

  const fornecedoresFiltrados = fornecedoresOrdenados.filter(fornecedor => {
    return (
      (fornecedor.Empresa?.toLowerCase().includes(filtroEmpresa.toLowerCase()) ?? true) &&
      (fornecedor.Responsavel?.toLowerCase().includes(filtroResponsavel.toLowerCase()) ?? true) &&
      (fornecedor.Telefone?.toLowerCase().includes(filtroTelefone.toLowerCase()) ?? true) &&
      (fornecedor.Cnpj?.toLowerCase().includes(filtroCnpj.toLowerCase()) ?? true)
    );
  });

  const renderIconeOrdenacao = (chave: keyof Fornecedor) => {
    if (!obterClassNamesPara(chave)) {
      return <FontAwesomeIcon icon={faSortUp} className="sort-icon" />;
    }
    if (obterClassNamesPara(chave) === 'ascendente') {
      return <FontAwesomeIcon icon={faSortUp} className="sort-icon" />;
    }
    return <FontAwesomeIcon icon={faSortDown} className="sort-icon" />;
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2>Lista de Fornecedores</h2>
        <Link to="/cadastrofornecedor" className="btn btn-primary mb-3">Cadastrar Novo Fornecedor</Link>

        <div className="row mb-3">
          <div className="col">
            <input type="text" className="form-control" placeholder="Empresa" value={filtroEmpresa} onChange={handleFiltroEmpresa} />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="Responsável" value={filtroResponsavel} onChange={handleFiltroResponsavel} />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="Telefone" value={filtroTelefone} onChange={handleFiltroTelefone} />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="CNPJ" value={filtroCnpj} onChange={handleFiltroCnpj} />
          </div>
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col" onClick={() => solicitarOrdenacao('FornecedorId')} className={obterClassNamesPara('FornecedorId')}>
                ID {renderIconeOrdenacao('FornecedorId')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('Empresa')} className={obterClassNamesPara('Empresa')}>
                Empresa {renderIconeOrdenacao('Empresa')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('Responsavel')} className={obterClassNamesPara('Responsavel')}>
                Responsável {renderIconeOrdenacao('Responsavel')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('Telefone')} className={obterClassNamesPara('Telefone')}>
                Telefone {renderIconeOrdenacao('Telefone')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('Cnpj')} className={obterClassNamesPara('Cnpj')}>
                CNPJ {renderIconeOrdenacao('Cnpj')}
              </th>
              <th scope="col">Ação</th>
            </tr>
          </thead>
          <tbody>
            {fornecedoresFiltrados.map((fornecedor) => (
              <tr key={fornecedor.FornecedorId}>
                <td>{fornecedor.FornecedorId}</td>
                <td>{fornecedor.Empresa}</td>
                <td>{fornecedor.Responsavel}</td>
                <td>{fornecedor.Telefone}</td>
                <td>{fornecedor.Cnpj}</td>
                <td>
                  <button className="btn btn-outline-secondary btn-sm quantidade-btn delete-btn" onClick={() => deletarFornecedorEstado(fornecedor.FornecedorId)}>
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

export default Fornecedores;
