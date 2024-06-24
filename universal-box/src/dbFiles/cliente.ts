// Cliente.tsx
export interface ICliente {
    clienteId: string;
    clienteNome: string;
    clienteCpf: string;
    clienteTelefone: string;
    clienteCep: string;
  }
  
  class Cliente implements ICliente {
      clienteId: string;
      clienteNome: string;
      clienteCpf: string;
      clienteTelefone: string;
      clienteCep: string;
  
      constructor(
          clienteId: string,
          clienteNome: string,
          clienteCpf: string,
          clienteTelefone: string,
          clienteCep: string
      ) {
          this.clienteId = clienteId;
          this.clienteNome = clienteNome;
          this.clienteCpf = clienteCpf;
          this.clienteTelefone = clienteTelefone;
          this.clienteCep = clienteCep;
      }
  }
  
  export default Cliente;
  