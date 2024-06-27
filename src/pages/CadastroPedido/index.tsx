import React, { useState, useEffect, ChangeEvent } from 'react';
import Navbar from '../../Navbar';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

interface Produto {
  ProdutoId: number;
  ProdutoNome: string;
}

interface Cliente {
  ClienteId: number;
  ClienteNome: string;
}

function CadastroPedidos() {
  const [returnedData, setReturnedData] = useState('teste use state');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<{ ProdutoId: number }>({ ProdutoId: 0 });
  const [clienteSelecionado, setClienteSelecionado] = useState<{ ClienteId: number }>({ ClienteId: 0 });
  const [quantidade, setQuantidade] = useState<number>(0);
  const [dataEntrega, setDataEntrega] = useState(new Date());
  const [pedidos, setPedidos] = useState<{ ProdutoId: number; ClienteId: number; Quantidade: number, DataEntrega: Date }>({ ProdutoId: 0, ClienteId: 0, Quantidade: 0, DataEntrega: new Date() });
  const navigate = useNavigate();  // Uso do useNavigate aqui no topo do componente


  // Buscar valores dos selects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://universalboxdeploy.vercel.app/api');
        if (!response.ok) {
          throw new Error('Erro ao obter os dados');
        }
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('https://universalboxdeploy.vercel.app/apicliente');
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

  // Alterar state
  const setProdSel = (selectedOption: { value: number }) => {
    setProdutoSelecionado({ ProdutoId: selectedOption.value });
  };

  const setCliSel = (selectedOption: { value: number }) => {
    setClienteSelecionado({ ClienteId: selectedOption.value });
  };

  const setInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuantidade(parseInt(value));
  };

  const setData = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDataEntrega(new Date(value));
  };

  // Disparar uma função após a alteração do select
  const createPedidoState = async () => {
    if (quantidade > 0 && clienteSelecionado.ClienteId > 0 && produtoSelecionado.ProdutoId > 0 && dataEntrega !== null) {
      setPedidos({
        ProdutoId: produtoSelecionado.ProdutoId,
        ClienteId: clienteSelecionado.ClienteId,
        Quantidade: quantidade,
        DataEntrega: dataEntrega
      });
      console.log(pedidos);
    } else {
      console.log('Alguma informação não foi inserida');
    }
  };

  useEffect(() => {
    if (pedidos.ClienteId > 0 && pedidos.ProdutoId > 0 && pedidos.Quantidade > 0) {
      createPedido();
    }
  }, [pedidos]);

  const createPedido = async () => {
    const newData = await fetch('/criarpedido', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(pedidos),
    }).then((res) => res.json());
    console.log(newData);
    setReturnedData(newData[0]);

    navigate('/pedidos');

  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title">Novo Pedido</h1>
                <div className="form-group">
                  <Select
                    className="mb-3"
                    placeholder="Produto"
                    options={produtos.map((produto) => ({ value: produto.ProdutoId, label: produto.ProdutoNome }))}
                    onChange={(e) => setProdSel(e as { value: number })}
                  />
                  <Select
                    className="mb-3"
                    placeholder="Cliente"
                    options={clientes.map((cliente) => ({ value: cliente.ClienteId, label: cliente.ClienteNome }))}
                    onChange={(e) => setCliSel(e as { value: number })}
                  />
                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Quantidade"
                    name="Quantidade"
                    value={quantidade}
                    onChange={setInput}
                  />
                  <input
                    type="date"
                    className="form-control mb-3"
                    placeholder="Data de Entrega"
                    name="DataEntrega"
                    onChange={setData}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={createPedidoState}
                >
                  Cadastrar Novo Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroPedidos;
