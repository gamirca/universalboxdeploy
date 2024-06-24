import React, { useState, useEffect, useContext, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Navbar';
import { AuthContext } from '../../context/AuthContext';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useOrdenacao } from '../../context/useOrdenacao';

interface Cliente {
  ClienteId: string;
  ClienteNome: string;
  ClienteCpf: string;
  ClienteTelefone: string;
  ClienteCep: string;
}

function Clientes() {
  const { email } = useContext(AuthContext);

  console.log(email + "- pagina de clientes");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [deletarCliente, setDeletarCliente] = useState<{ ClienteId: string }>({ ClienteId: '' });
  const { itens: clientesOrdenados, solicitarOrdenacao, obterClassNamesPara } = useOrdenacao(clientes);

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroCpf, setFiltroCpf] = useState('');
  const [filtroTelefone, setFiltroTelefone] = useState('');
  const [filtroCep, setFiltroCep] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('/apicliente');
        if (!response.ok) {
          throw new Error('Erro ao obter os dados');
        }
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    fetchClientes();
  }, []);

  const DeleteCliente = async () => {
    await fetch('/deletarCliente', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(deletarCliente)
    }).then(res => res.json());
  };

  const DeleteClienteState = async (clienteId: string) => {
    console.log(clienteId);
    setDeletarCliente({ ClienteId: clienteId });
  };

  useEffect(() => {
    if (deletarCliente.ClienteId !== '') {
      DeleteCliente();
    }
  }, [deletarCliente]);

  const handleFiltroNome = (e: ChangeEvent<HTMLInputElement>) => setFiltroNome(e.target.value);
  const handleFiltroCpf = (e: ChangeEvent<HTMLInputElement>) => setFiltroCpf(e.target.value);
  const handleFiltroTelefone = (e: ChangeEvent<HTMLInputElement>) => setFiltroTelefone(e.target.value);
  const handleFiltroCep = (e: ChangeEvent<HTMLInputElement>) => setFiltroCep(e.target.value);

  const clientesFiltrados = clientesOrdenados.filter(cliente => {
    return (
      (cliente.ClienteNome?.toLowerCase().includes(filtroNome.toLowerCase()) ?? true) &&
      (cliente.ClienteCpf?.toLowerCase().includes(filtroCpf.toLowerCase()) ?? true) &&
      (cliente.ClienteTelefone?.toLowerCase().includes(filtroTelefone.toLowerCase()) ?? true) &&
      (cliente.ClienteCep?.toLowerCase().includes(filtroCep.toLowerCase()) ?? true)
    );
  });

  const renderIconeOrdenacao = (chave: keyof Cliente) => {
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
        <h2>Lista de Clientes</h2>
        <Link to="/cadastrocliente" className="btn btn-primary mb-3">Cadastrar Novo Cliente</Link>

        <div className="row mb-3">
          <div className="col">
            <input type="text" className="form-control" placeholder="Nome" value={filtroNome} onChange={handleFiltroNome} />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="CPF" value={filtroCpf} onChange={handleFiltroCpf} />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="Telefone" value={filtroTelefone} onChange={handleFiltroTelefone} />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="CEP" value={filtroCep} onChange={handleFiltroCep} />
          </div>
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col" onClick={() => solicitarOrdenacao('ClienteId')} className={obterClassNamesPara('ClienteId')}>
                ID {renderIconeOrdenacao('ClienteId')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('ClienteNome')} className={obterClassNamesPara('ClienteNome')}>
                Nome {renderIconeOrdenacao('ClienteNome')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('ClienteCpf')} className={obterClassNamesPara('ClienteCpf')}>
                CPF {renderIconeOrdenacao('ClienteCpf')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('ClienteTelefone')} className={obterClassNamesPara('ClienteTelefone')}>
                Telefone {renderIconeOrdenacao('ClienteTelefone')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('ClienteCep')} className={obterClassNamesPara('ClienteCep')}>
                CEP {renderIconeOrdenacao('ClienteCep')}
              </th>
              <th scope="col">Ação</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.ClienteId}>
                <td>{cliente.ClienteId}</td>
                <td>{cliente.ClienteNome}</td>
                <td>{cliente.ClienteCpf}</td>
                <td>{cliente.ClienteTelefone}</td>
                <td>{cliente.ClienteCep}</td>
                <td>
                  <button className="btn btn-outline-secondary btn-sm quantidade-btn delete-btn" onClick={() => DeleteClienteState(cliente.ClienteId)}>
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

export default Clientes;
