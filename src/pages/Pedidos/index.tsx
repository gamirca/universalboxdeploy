import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'; // Importa o ícone de edição
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../Navbar';
import { useOrdenacao } from '../../context/useOrdenacao';
import generatePDF from '../Relatórios/Index';
import { format } from "date-fns";
import Status from '../../enums/Status';

interface Pedido {
  PedidoId: number;
  ProdutoNome: string;
  ClienteNome: string;
  Quantidade: number;
  DataEntrega: Date;
  Status: Status;
  ProdutoId: number;
}

const assignColorToStatus = (pedido: number) => {
  if (pedido === 1) {
    return "p-3 mb-2 bg-warning text-dark";
  } else if (pedido === 2) {
    return "p-3 mb-2 bg-dark text-white";
  } else if (pedido === 3) {
    return "p-3 mb-2 bg-success text-white";
  } else if (pedido === 4) {
    return "p-3 mb-2 bg-danger text-white"
  }
};

function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [deletarPedido, setDeletarPedido] = useState<{ PedidoId: number | null }>({ PedidoId: null });
  const { itens: pedidosOrdenados, solicitarOrdenacao, obterClassNamesPara } = useOrdenacao(pedidos);

  const [filtroProduto, setFiltroProduto] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroQuantidade, setFiltroQuantidade] = useState('');

  useEffect(() => {
    const buscarPedidos = async () => {
      try {
        const response = await fetch('/apiPedido');
        if (!response.ok) {
          throw new Error('Erro ao obter os dados');
        }
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    buscarPedidos();
  }, []);

  const deletarPedidoAPI = async () => {
    await fetch('/deletarPedido', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(deletarPedido)
    }).then(res => res.json());
  };

  const deletarPedidoEstado = async (pedidoId: number) => {
    console.log(pedidoId);
    setDeletarPedido({ PedidoId: pedidoId });
  };

  useEffect(() => {
    if (deletarPedido.PedidoId !== null) {
      deletarPedidoAPI();
      window.location.reload();
    }
  }, [deletarPedido]);

  const handleFiltroProduto = (e: ChangeEvent<HTMLInputElement>) => setFiltroProduto(e.target.value);
  const handleFiltroCliente = (e: ChangeEvent<HTMLInputElement>) => setFiltroCliente(e.target.value);
  const handleFiltroQuantidade = (e: ChangeEvent<HTMLInputElement>) => setFiltroQuantidade(e.target.value);

  const pedidosFiltrados = pedidosOrdenados.filter(pedido => {
    return (
      (pedido.ProdutoNome?.toLowerCase().includes(filtroProduto.toLowerCase()) ?? true) &&
      (pedido.ClienteNome?.toLowerCase().includes(filtroCliente.toLowerCase()) ?? true) &&
      (filtroQuantidade === '' || pedido.Quantidade === parseInt(filtroQuantidade))
    );
  });

  const renderIconeOrdenacao = (chave: keyof Pedido) => {
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
        <h2>Lista de Pedidos</h2>
        <Link to="/cadastroPedido" className="btn btn-primary mb-3 mr-3">Cadastrar Novo Pedido</Link>
        <Button className="btn btn-primary mb-3" onClick={() => generatePDF(pedidos)}>Gerar Relatório</Button>

        <div className="row mb-3">
          <div className="col">
            <input type="text" className="form-control" placeholder="Produto" value={filtroProduto} onChange={handleFiltroProduto} />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="Cliente" value={filtroCliente} onChange={handleFiltroCliente} />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="Quantidade" value={filtroQuantidade} onChange={handleFiltroQuantidade} />
          </div>
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col" onClick={() => solicitarOrdenacao('PedidoId')} className={obterClassNamesPara('PedidoId')}>
                ID {renderIconeOrdenacao('PedidoId')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('ProdutoNome')} className={obterClassNamesPara('ProdutoNome')}>
                Produto {renderIconeOrdenacao('ProdutoNome')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('ClienteNome')} className={obterClassNamesPara('ClienteNome')}>
                Cliente {renderIconeOrdenacao('ClienteNome')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('Quantidade')} className={obterClassNamesPara('Quantidade')}>
                Quantidade {renderIconeOrdenacao('Quantidade')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('DataEntrega')} className={obterClassNamesPara('DataEntrega')}>
                Data de Entrega {renderIconeOrdenacao('DataEntrega')}
              </th>
              <th scope="col" onClick={() => solicitarOrdenacao('Status')} className={obterClassNamesPara('Status')}>
                Status {renderIconeOrdenacao('Status')}
              </th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((pedido) => (
              <tr key={pedido.PedidoId}>
                <td>{pedido.PedidoId}</td>
                <td>{pedido.ProdutoNome}</td>
                <td>{pedido.ClienteNome}</td>
                <td>{pedido.Quantidade}</td>
                <td>{pedido.DataEntrega !== undefined && pedido.DataEntrega !== null ? format(new Date(pedido.DataEntrega), "dd/MM/yyyy") : ''}</td>
                <td className={assignColorToStatus(pedido.Status)}>
                  {Status[pedido.Status]}

                </td>
                <td>
                  <button className="btn btn-outline-secondary btn-sm quantidade-btn delete-btn" onClick={() => deletarPedidoEstado(pedido.PedidoId)}>
                    <FontAwesomeIcon icon={faTrash} className="trash-icon" />
                  </button>
                  <button className="btn btn-outline-secondary btn-sm quantidade-btn ml-2 edit-btn">
                    <Link to={'/edicaoPedido'} state={pedido}>
                      <FontAwesomeIcon icon={faEdit} className="edit-icon" />
                    </Link>
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

export default Pedidos;
