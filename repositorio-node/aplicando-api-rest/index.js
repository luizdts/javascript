//necessária instalação do yarn via (npm install yarn --global)

const express = require('express');
const server = express();
server.use(express.json());
// CRUD => Create, Read, Update, Delete <=
const cursos = ['Node', 'Javascript', 'C', 'C++'];


// middleware anônimo global

server.use((req,res, next) => {
    console.log(`Url carregada: ${req.url}`); // Puxa a página carregada

    return next();
});

function checkCurso(req, res, next){ // valida o nome do curso, se não existir exibe um BadRequest
    if(!req.body.name){ // essa função representa um middleware
        return res.status(400).json({ error: "Nome do curso é obrigatória"})
    };
    return next();
};

function checkIndexCurso(req, res, next){ // verifica se o índice utilizado existe um curso
    const curso = cursos[req.params.index];
    if(!curso){
        return res.status(400).json({error: "Valor inexistente."});

    }
    return next();
};

server.get("/cursos", (req,res) => {
    return res.json(cursos); // lista os cursos existentes

});

server.get("/cursos/:index", checkIndexCurso,(req,res) => { // Route params
    const {index} = req.params;

    return res.json(cursos[index]);
});

server.post('/cursos', checkCurso, (req,res) => {
    const { name } = req.body;
    cursos.push(name); // insere um novo dado na lista dos cursos

    return res.json(cursos); // retorna um json

});
 // Alterando com PUT
server.put('/cursos/:index', checkCurso, checkIndexCurso, (req,res) => {
    const { index } = req.params;
    const { name } = req.body;

    cursos[index] = name;

    return res.json(cursos);

});

 // Deletando um curso existente

 server.delete('/cursos/:index', checkIndexCurso, (req,res) => {
    const { index } = req.params;
    cursos.splice(index, 1);
    
    return res.json(cursos);

 });

server.listen(4444);