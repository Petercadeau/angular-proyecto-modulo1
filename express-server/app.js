var express = require("express"),
    cors = require('cors');
var app = express();
/*
// Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});*/

app.use(express.json());
app.use(cors());
app.listen(3000, () => console.log("Server runing on port 3000"));

var ciudades = ["Paris", "Barcelona", "Madrid", "Quito ", "Barranquilla", "Guayaquil", "Buenos Aires", "Nuew York"];

app.get("/ciudades", (req, res, next) => res.json(
    ciudades.filter(
        (c) => c.toLowerCase().indexOf(
            req.query.q.toString().toLowerCase()) > -1
    )
));

var misDestinos = [];

app.get("/my", (req, res, next) => res.json(misDestinos));
app.post("/my", (req, res, next) => {
    console.log(req.body);
    misDestinos.push(req.body.nuevo);
    res.json(misDestinos);
});

app.get("/api/translation", (req, res, next) => res.json([
    { lang: req.query.lang, key: 'HOLA', value: 'HOLA ' + req.query.lang }
]));