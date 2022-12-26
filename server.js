// Arquivo: server.js

const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();

// Configure o EJS como o mecanismo de visualização
app.set('view engine', 'ejs');

let flashcards = [];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/create-flashcards', upload.single('document'), (req, res) => {
  // Lê o arquivo enviado
  fs.readFile(req.file.path, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo.');
    }

    // Processa os dados do arquivo para criar flashcards
    const newFlashcards = createFlashcardsFromFileData(data);
    flashcards = flashcards.concat(newFlashcards);
    console.log(flashcards)
    // Renderiza a visualização EJS e envia as flashcards para ela
    res.render('flashcards', { flashcards: flashcards });
  });
});

app.get('/flashcards', (req, res) => {
  res.send(flashcards);
});

app.post('/save-flashcards', (req, res) => {
  fs.writeFile('flashcards.json', JSON.stringify(flashcards), (err) => {
    if (err) {
      return res.status(500).send('Erro ao salvar o arquivo.');
    }
    res.send('Flashcards salvas com sucesso!');
  });
});

app.get('/', (req, res) => {
  // Renderiza a visualização EJS da página principal
  res.render('index');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

function createFlashcardsFromFileData(data) {
  // Aqui você deve escrever o código para processar os dados do arquivo
  // e criar as flashcards. Isso pode incluir dividir o texto em linhas,
  // separar perguntas e respostas, etc.
    const lines = data.split('\n');
    const flashcards = [];
  
    for (let i = 0; i < lines.length; i += 2) {
      const question = lines[i];
      const answer = lines[i + 1];
      flashcards.push({ question, answer });
    }
  
    return flashcards;
  }  
