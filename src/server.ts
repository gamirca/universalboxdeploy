import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sql, { PoolOptions, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const API_PORT = process.env.PORT || 5555;
const app = express();

// const config: PoolOptions = {
//   host: 'universalbox.c56eiikm60x9.us-east-2.rds.amazonaws.com',
//   user: 'admin',
//   database: 'UniversalBox',
//   password: '12345678',
//   port: Number(process.env.DB_PORT) || 3307
// };

const config: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  database: process.env.DB_DBNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 3307
};

const jwtSecret = 'your_secret_key'; // Substitua por uma chave secreta segura

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


//#region Produtos
app.get('/api', async (req: Request, res: Response) => {
  try {
    let pool = await sql.createPool(config);
    let [produtos] = await pool.query<RowDataPacket[]>('SELECT * from UniversalBox.Produtos');
    console.log('Produtos retornados do banco:', produtos);
    res.send(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/criar', async (req: Request, res: Response) => {
  try {
    let pool = await sql.createPool(config);
    await pool.query('INSERT INTO UniversalBox.Produtos (ProdutoNome, FornecedorNome, ProdutoModelo, ProdutoPreco, ProdutoQuantidade) VALUES (?, ?, ?, ?, ?)',
      [req.body.ProdutoNome, req.body.FornecedorNome, req.body.ProdutoModelo, req.body.ProdutoPreco, req.body.ProdutoQuantidade]);
    let [produtos] = await pool.query<RowDataPacket[]>('SELECT * from UniversalBox.Produtos');
    console.log('Produtos após criação:', produtos);
    res.send(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.delete('/deletar', async (req: Request, res: Response) => {
  try {
    let pool = await sql.createPool(config);
    await pool.query('DELETE FROM UniversalBox.Produtos WHERE ProdutoId = ?', [req.body.ProdutoId]);
    console.log('Produto deletado com ID:', req.body.ProdutoId);
    res.send({ message: 'Produto deletado' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.put('/atualizarQuantidade', async (req: Request, res: Response) => {
  try {
    const { ProdutoId, Quantidade } = req.body;
    let pool = await sql.createPool(config);

    // Atualizar a quantidade do produto no banco de dados
    await pool.query(
      'UPDATE UniversalBox.Produtos SET ProdutoQuantidade = ? WHERE ProdutoId = ?',
      [Quantidade, ProdutoId]
    );

    console.log(`Quantidade do produto com ID ${ProdutoId} atualizada para ${Quantidade}`);

    res.send({ message: 'Quantidade atualizada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

//#endregion

//#region Clientes

app.get('/apicliente', async (req: Request, res: Response) => {
  try {
    let pool = await sql.createPool(config);
    let [clientes] = await pool.query<RowDataPacket[]>('SELECT * from UniversalBox.Clientes');
    console.log('Clientes retornados do banco:', clientes);
    res.send(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/criarcliente', async (req: Request, res: Response) => {
  try {
    let pool = await sql.createPool(config);
    await pool.query('INSERT INTO UniversalBox.Clientes (ClienteNome, ClienteCpf, ClienteTelefone, ClienteCep) VALUES (?, ?, ?, ?)',
      [req.body.ClienteNome, req.body.ClienteCpf, req.body.ClienteTelefone, req.body.ClienteCep]);
    let [clientes] = await pool.query<RowDataPacket[]>('SELECT * from UniversalBox.Clientes');
    console.log('Clientes após criação:', clientes);
    res.send(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.delete('/deletarCliente', async (req, res) => {
  try {
    console.log(req.body.ClienteId)
    let pool = await sql.createPool(config);
    let deletarCliente = await pool.query(
      `DELETE FROM UniversalBox.Clientes
            WHERE ClienteId = ${req.body.ClienteId}
       `)
  }
  catch (error) {
    console.log(error);
  }
})

//#endregion

//#region Pedidos

app.get('/apipedido', async (req, res) => {
  try {
    let pool = await sql.createPool(config);
    let pedidos = await pool.query(
      `SELECT pe.PedidoId, pr.ProdutoNome, cl.ClienteNome, pe.Quantidade, pe.DataEntrega, pe.Status, pe.ProdutoId
            FROM UniversalBox.Pedidos pe
            JOIN UniversalBox.Produtos pr ON pr.ProdutoId = pe.ProdutoId
            JOIN UniversalBox.Clientes cl ON cl.ClienteId = pe.ClienteId`);
    res.send(pedidos[0]);
  }
  catch (error) {
    console.log(error);
  }
});

app.put('/apipedidoporid', async (req, res) => {
  try {
    console.log('testeeeee' + req)
    let pool = await sql.createPool(config);
    let pedidos = await pool.query(
      `SELECT pe.PedidoId, pr.ProdutoNome, cl.ClienteNome, pe.Quantidade, pe.DataEntrega, pe.Status, pe.PedidoId, pe.ProdutoId, pe.ClienteId
            FROM UniversalBox.Pedidos pe
            JOIN UniversalBox.Produtos pr ON pr.ProdutoId = pe.ProdutoId
            JOIN UniversalBox.Clientes cl ON cl.ClienteId = pe.ClienteId
            WHERE pe.PedidoId = ${req.body.PedidoId}`);
    res.send(pedidos[0]);
  }
  catch (error) {
    console.log(error);
  }
});

app.post('/criarpedido', async (req, res) => {
  try {
    let pool = await sql.createPool(config);
    let criarPedidos = await pool.query(
      `INSERT INTO UniversalBox.Pedidos
                 (ProdutoId, ClienteId, Quantidade, DataEntrega, Status)
                 VALUES
                ('${req.body.ProdutoId}',
               '${req.body.ClienteId}',
                '${req.body.Quantidade}',
                '${req.body.DataEntrega}',
                1);`
    )
    const result = JSON.parse(JSON.stringify(criarPedidos))
    let ajusteQuantidade = await pool.query(
      `UPDATE UniversalBox.Produtos p
             join UniversalBox.Pedidos pe on pe.ProdutoId = p.ProdutoId
             SET p.ProdutoQuantidade = p.ProdutoQuantidade - pe.Quantidade
             WHERE p.ProdutoId = ${req.body.ProdutoId} AND pe.PedidoId = ${result[0].insertId}`
    )

    let pedidos = await pool.query(`SELECT * from UniversalBox.Pedidos`);
    res.send(pedidos[0]);
  }
  catch (error) {
    console.log(error);
  }
});

app.delete('/deletarpedido', async (req, res) => {
  try {
    let pool = await sql.createPool(config);
    let deletarPedido = await pool.query(
      `DELETE FROM UniversalBox.Pedidos
            WHERE PedidoId = ${req.body.PedidoId}
       `)
  }
  catch (error) {
    console.log(error);
  }
})
//#endregion

//#region Fornecedores
app.get('/apifornecedor', async (req, res) => {
  try {
    let pool = await sql.createPool(config);
    let fornecedores = await pool.query(
      `SELECT * from UniversalBox.Fornecedores`);
    res.send(fornecedores[0]);
  }
  catch (error) {
    console.log(error);
  }
});


app.post('/criarfornecedor', async (req, res) => {
  try {
    let pool = await sql.createPool(config);
    let criarFornecedores = await pool.query(
      `INSERT INTO UniversalBox.Fornecedores (Empresa, Responsavel, Telefone, Cnpj) VALUES
            ('${req.body.FornecedorEmpresa}',
            '${req.body.FornecedorResponsavel}',
            '${req.body.FornecedorTelefone}',
            '${req.body.FornecedorCnpj}')`
    )
    let fornecedores = await pool.query(`SELECT * from UniversalBox.Pedidos`);
    res.send(fornecedores[0]);
  }
  catch (error) {
    console.log(error);
  }
});

app.delete('/deletarfornecedor', async (req, res) => {
  try {
    console.log(req.body.ClienteId)
    let pool = await sql.createPool(config);
    let deletarPedido = await pool.query(
      `DELETE FROM UniversalBox.Fornecedores
            WHERE FornecedorId = ${req.body.FornecedorId}
       `)
  }
  catch (error) {
    console.log(error);
  }
})
//#endregion

//#region Usuarios

app.post('/apiusuario', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Email ou senha não fornecidos');
    return res.status(400).send('Email e senha são obrigatórios');
  }

  try {
    let pool = await sql.createPool(config);
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM UniversalBox.Usuarios WHERE Email = ?', [email]);
    console.log('Resultado da consulta ao banco para o email:', email, rows);

    if (rows.length > 0) {
      const user = rows[0];
      console.log('Usuário encontrado:', user);

      if (user.Senha === password) {
        const token = jwt.sign({ email: user.Email }, jwtSecret, { expiresIn: '1h' });
        console.log('Validação de senha bem-sucedida. Token gerado:', token);
        return res.json({ token, email: user.Email });
      } else {
        console.log('Senha incorreta fornecida para o email:', email);
        return res.status(401).send('Senha incorreta');
      }
    } else {
      console.log('Usuário não encontrado para o email:', email);
      return res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
});

app.post('/criarUsuario', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    let pool = await sql.createPool(config);
    let criarUsuario = await pool.query(
      `INSERT INTO UniversalBox.Usuarios (Email, Username, Senha) VALUES
            ('${email}',
            '${username}',
            '${password}')`
    )
    const result = JSON.parse(JSON.stringify(criarUsuario));
    let [user] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM UniversalBox.Usuarios WHERE UsuarioId = ${result[0].insertId}`
    )

    const token = jwt.sign({ email: user[0].Email }, jwtSecret, { expiresIn: '1h' });
    console.log('Validação de senha bem-sucedida. Token gerado:', token);
    return res.json({ token, email: user[0].Email });
  }
  catch (error) {
    console.log(error);
  }
});


//#endregion

app.listen(API_PORT, () => console.log(`Listening on ${API_PORT}`));