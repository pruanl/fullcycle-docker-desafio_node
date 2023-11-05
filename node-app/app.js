const express = require('express');
const mysql = require('mysql');

const app = express();

const config_db = {
  host: 'database',
  user: 'root',
  password: 'root',
  database: 'node_api'
}

const db = mysql.createConnection(config_db);

db.connect((err) => {
  if(err){
    throw err;
  }
  console.log('MySql Connected...');

  const createTableQuery = `CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT,
    nome VARCHAR(255),
    PRIMARY KEY (id)
  )`;

  db.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Tabela "usuarios" criada!');
  });

  //verifica se existe usuarios, se existir não cria mais
  const query = "select * from usuarios;";

  db.query(query, (err, result) => {
    if (err) throw err;
    if(result.length == 0){
      console.log('Nenhum usuario encontrado, criando...');
     
      const addUsersQuery = `INSERT INTO usuarios (nome) VALUES ('pedro ruan'), ('mel maggie')`;

      db.query(addUsersQuery, (err, result) => {
        if (err) throw err;
        console.log('Nomes adicionados com sucesso!');
      });
    }else{
      console.log('Usuarios encontrados!');
    }
  });
  
});

const queryUsers = "select * from usuarios;";

app.get('/', (req, res) => {
  db.query(queryUsers, (err, results) => {
      if (err) {
          // Verificar se a resposta já foi enviada
          if (!res.headersSent) {
              res.json(results); // Enviar a resposta apenas se ela ainda não foi enviada
          }
          // Lidar com o erro de outra forma, talvez logando ou enviando uma resposta de erro
          console.error(err);
      } else {
          if (!res.headersSent) {

              let html = '<h1>Full Cycle Rocks!</h1>';
              html += '<ul>';
              results.forEach(result => {
                  html += `<li>${result.nome}</li>`;
              });
              html += '</ul>';
              res.send(html);
          }
      }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
