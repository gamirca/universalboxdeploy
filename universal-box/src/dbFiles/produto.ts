// Produto.tsx
export interface IProduto {
    produtoId: string;
    produtoNome: string;
    fornecedorNome: string;
    produtoModelo: string;
    produtoPreco: number;
    produtoQuantidade: number;
}

class Produto implements IProduto {
    constructor(
        public produtoId: string,
        public produtoNome: string,
        public fornecedorNome: string,
        public produtoModelo: string,
        public produtoPreco: number,
        public produtoQuantidade: number
    ) {}
}

export default Produto;
