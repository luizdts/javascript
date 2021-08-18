const { response } = require("express"); // puxa o express
const express = require("express"); 
const app = express(); // armazena o express
const bodyParser = require("body-parser"); // Linkar o bodyparser instalado via npm
const connection = require("./database/database");
const Pergunta = require("./database/Perguntas");
const Resposta = require("./database/Resposta");

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Autenticação realizada com sucesso.");
    })
    .catch((msgError) => {
        console.log("Ocorreu um erro.")
    });


app.set('view engine', 'ejs'); // Habilita a utilização do EJS
app.use(express.static('public')); // a aplicação aceita arquivos estáticos (arquivos CSS e etc)

// BodyParser
app.use(bodyParser.urlencoded({extended: false})); // Utilizando bodyParser para codificar a url
app.use(bodyParser.json()); // bodyParser para exportar arquivos .json

// Rotas
app.get("/", (req,res) => {
    Pergunta.findAll({ raw: true, order: [
        ['id','DESC'] // desc = decrescente, asc = crescente
    ] }).then(perguntas => {
        res.render('index', {  // O Express renderiza o arquivo index.ejs diretamente da pasta views 
            perguntas: perguntas
        });
    });   
});
app.get("/perguntar", (req,res) => {
    res.render("perguntar")
});

app.post("/salvarpergunta", (req,res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });

});

app.get("/pergunta/:id",(req,res) =>{
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id},
    }).then(pergunta => {
        if(pergunta != undefined){ // Pergunta encontrada
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            })
            
        } else { // pergunta não encontrada
            res.redirect("/");
        }
    });
});

app.post("/responder",(req,res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId); // A saída será a resposta para o índice da pergunta
    });
});


app.listen(8081,() => {
    console.log("App rodando") // Rota de conexão
});