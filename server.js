const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
// const path = require("path");
// const { Cliente } = require("pg");
const { Client } = require("pg");

// Create a new client object
const client = new Client({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

client.connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch(err => {
    console.error("Connection Error", err.stack)
  });
client.end()
  .then(() => {
    console.log("Client connection closed");
  })
  .catch(err => {
    console.error("Connection Error", err.stack)
  });

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/quemsomos", (req, res) => {
  console.log("Servidor rodando em http://localhost:${port}");
});

app.get("/acompanhamento", (req, res) => {
  res.render("acompanhamento");
});

app.get("/cadastrase", (req, res) => {
  res.render("cadastrase");
});

app.get("/serviços", verificarAutenticacao, async (req, res) => {
  const result = await ondblclick.query("SELECT * FROM cliente");
  console.log(result.rows);
  res.render("serviços", {
    serviços: result.rows,
    usuario: req.session.usuario,
  });
});

app.post("/cadastrase", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.send("Todos os campos são obrigatórios");
  }
  await ondblclick.query(
    "INSERT INTO cliente (nome, email, senha) VALUES ($1, $2, $3)",
    [nome, email, senha],
  );
  res.send("Cadastrado com sucesso");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  console.log(email, senha);
  const cliente = await db.query(
    "SELECT * FROM cliente WHERE email = $1, senha = $2",
    [email, senha],
  );
  console.log(result.rows.length);
  if (result.rows.length === 0) {
    return res.send("Usuário ou senha incorretos");
  }
  req.session.usuario = cliente;
  res.redirect("/serviços");

  const user = result.rows[0];
  if (user.senha != senha) {
    return res.send("Usuário ou senha incorretos");
  }
  req.session.usuario = user;
  res.redirect("/serviços");
});

app.get("/servicos", verificarAutenticacao, async (req, res) => {
  const result = await ondblclick.query("SELECT * FROM cliente");
  console.log(result.rows);
  res.render("serviços", {
    serviços: result.rows,
    usuario: req.session.usuario,
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

function verificarAutenticacao(req, res, next) {
  if (!req.session.usuario) {
    next();
  } else {
    res.redirect("/serviços");
  }
}

// app.use(
//   session({
//     secret: "seu-segredo",
//     resave: false,
//     saveUninitialized: true,

//   })
// )
