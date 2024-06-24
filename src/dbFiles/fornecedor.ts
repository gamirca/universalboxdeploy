// Fornecedor.tsx
export interface IFornecedor {
    fornecedorId: string;
    fornecedorEmpresa: string;
    fornecedorResponsavel: string;
    fornecedorTelefone: string;
    fornecedorCNPJ: string;
  }
  
  class Fornecedor implements IFornecedor {
      fornecedorId: string;
      fornecedorEmpresa: string;
      fornecedorResponsavel: string;
      fornecedorTelefone: string;
      fornecedorCNPJ: string;
  
      constructor(
          fornecedorId: string,
          fornecedorEmpresa: string,
          fornecedorResponsavel: string,
          fornecedorTelefone: string,
          fornecedorCNPJ: string
      ) {
          this.fornecedorId = fornecedorId;
          this.fornecedorEmpresa = fornecedorEmpresa;
          this.fornecedorResponsavel = fornecedorResponsavel;
          this.fornecedorTelefone = fornecedorTelefone;
          this.fornecedorCNPJ = fornecedorCNPJ;
      }
  }
  
  export default Fornecedor;
  