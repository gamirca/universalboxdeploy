import React, { useState, useEffect, ChangeEvent } from 'react';
import Navbar from '../../Navbar';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import Status from '../../enums/Status';
import { useLocation } from 'react-router-dom';

interface Produto {
    ProdutoId: number;
    ProdutoNome: string;
}

interface Cliente {
    ClienteId: number;
    ClienteNome: string;
}

interface Pedido {
    PedidoId: number;
    ProdutoId: number;
    ClienteId: number;
    ProdutoNome: string;
    ClienteNome: string;
    Quantidade: number;
    DataEntrega: Date;
    Status: Status
}

function EdicaoPedido() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState<{ ProdutoId: number }>({ ProdutoId: 0 });
    const [clienteSelecionado, setClienteSelecionado] = useState<{ ClienteId: number }>({ ClienteId: 0 });
    const [quantidade, setQuantidade] = useState<number>(0);
    const [dataEntrega, setDataEntrega] = useState(new Date());
    const [status, setStatus] = useState<number>(0);
    const navigate = useNavigate();  // Uso do useNavigate aqui no topo do componente

    const location = useLocation();
    const pedido = location.state

    // Buscar valores dos selects
    useEffect(() => {
        const fetchData = async () => {
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

        fetchData();
    }, []);

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

    const setStat = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setStatus(parseInt(value));
    };

    const mapProduto = () => {
        return produtos.map(produto => ({ value: produto.ProdutoId, label: produto.ProdutoNome }))
    }


    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h1 className="card-title">Editar Pedido</h1>
                                <div className="form-group">
                                    <Select
                                        className="mb-3"
                                        placeholder="Produto"
                                        defaultValue={mapProduto().filter((produto) => produto.value === pedido?.ProdutoId)}
                                        options={mapProduto()}
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
                                        value={pedido.Quantidade}
                                        onChange={setInput}
                                    />
                                    <input
                                        type="date"
                                        className="form-control mb-3"
                                        placeholder="Data de Entrega"
                                        name="DataEntrega"
                                        value={pedido.DataEntrega}
                                        onChange={setData}
                                    />
                                    <input
                                        type="enum"
                                        className="form-control mb-3"
                                        placeholder="Data de Entrega"
                                        name="DataEntrega"
                                        value={pedido.Status}
                                        onChange={setData}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EdicaoPedido;