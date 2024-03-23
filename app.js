const express = require("express");
const app = express();
const path = require("path");
const indexRouter=require('./src/routes/index.routes')

const port = 3030;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,'src/views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.get("/login", (req, res) => res.render("users/login"));
app.get("/registro", (req, res) => res.render("users/register"));
app.get("/create", (req, res) => res.render("products/product-create"));
app.get("/edit", (req, res) => res.render("products/product-edit"));

app.get("*", (req, res) => res.status(404).send("404 not found. <br> ¡Houston, tenemos un problema!"));

app.listen(port, () => console.log(`Servidor Corriendo en el puerto ${port}`));