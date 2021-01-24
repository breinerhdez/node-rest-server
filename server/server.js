require("./config/config");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/usuario", function (req, res) {
  res.send("GET LISTAR");
});

app.post("/usuario", function (req, res) {
  let user = req.body;
  res.json(user);
});

app.put("/usuario/:id", function (req, res) {
  let { id } = req.params;
  res.send("PUT ACTUALIZAR - " + id);
});

app.delete("/usuario", function (req, res) {
  let { id } = req.body;

  if (!id) {
    res.status(400).send(`El parámetro id es requerido.`);
  } else {
    res.send(`El id a ser eliminado es ${id}.`);
  }
});

app.listen(process.env.PORT, () => {
  console.log("App run on PORT: " + process.env.PORT);
});
