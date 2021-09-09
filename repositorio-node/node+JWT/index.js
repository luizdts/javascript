const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");

const secret = "secret";
app.use(cors()); 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


function auth(req, res, next){
    const authToken = req.headers['authorization'];
    if(authToken != undefined){
        const bearer = authToken.split(' ');
        var token = bearer[1];

        jwt.verify(token,secret,(err, data) => {
            if(err){
                res.status(401).json({err: "Token inválido!"});
            } else {
                req.token = token;
                req.loggedUser = { id: data.id , email: data.email};
                next();
                console.log(data);
            }
        })
    } else {
        res.status(401).json({err: "Token inválido!"});
    }

    next();
}

var DB = { // BD falso...
    games: [
        {
        id: 2,
        title: "COD MW1",
        year: 2009,
        price: 60
        },
        {
            id: 3,
            title: "Sea of Thieves",
            year: 2018,
            price: 40
        },
        {
            id: 4,
            title: 'Minecraft',
            year: 2012,
            price: 20
        }
    ],
    users: [
        {
            id: 1,
            name: "Fulano",
            email: "fulano@email.com",
            pwd: "12345"
        },
        {
            id: 2,
            name: "Zezinho",
            email: "zezinho@email.com",
            pwd: "zezinho123"
        }
    ]
}


app.get('/games',auth,(req, res) => {  // chamada GET da API
    res.status(200).json({user: req.loggedUser, games: DB.games});
});

app.get('/game/:id',auth, (req,res) => { // chamada GET de um jogo específico
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);
        var game = DB.games.find(g => g.id == id);

        if(game != undefined){
            res.statusCode = 200;
            res.json(game);
        } else { 
            res.sendStatus(404);
        }

    }
});

app.post('/game',auth, (req, res) => { // chamada POST para cadastrar um novo jogo
    var { title, price, year } = req.body;

    DB.games.push({
        id: 33,
        title,
        price,
        year
    });

    res.sendStatus(200);
});

app.delete('/game/:id',auth, (req, res) => {  // chamada DELETE para deletar algum dos jogos
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);
        var index = DB.games.findIndex(g => g.id == id);

        if(index == -1){
            res.sendStatus(404);
        } else {
            DB.games.splice(index,1);
            res.sendStatus(200);
        }
    }

})

app.put('/game/:id',auth, (req,res) => { // chamada PUT para alterar alguma informação dos jogos
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);
        var game = DB.games.find(g => g.id == id);

        if(game != undefined){

            var { title, price, year } = req.body;

            if(title != undefined){
                game.title = title;
            }
            if(price != undefined){
                game.price = price;
            }
            if(year != undefined){
                game.year = year
            }
            
            res.sendStatus(200);
            
        } else { 
            res.sendStatus(404);
        }

    }
})

app.post("/auth", (req, res) =>{
    var { email, pwd } = req.body;

    if(email != undefined) {

        var user = DB.users.find( u => u.email == email);

        if(user != undefined){
            if(user.pwd == pwd) {

                jwt.sign({id: user.id, email: user.email},secret,{expiresIn:'4h'},(err, token) => {
                    if(err){
                        res.status(400).json({err: "Falha interna..."})
                    } else {
                        res.status(200).json({token: token});
                    }
                });

            } else {
                res.status(401).json({err:"Credenciais inválidas!"});
            }

        } else {
            res.status(404).json({err: "E-mail não existe!"})
        }

    } else {
        res.status(400).json({err: "E-mail inválido!"});
    }
})

app.listen(3333, () => {   // atribuição à porta local 3333
    console.log('API inicializada...');
});
