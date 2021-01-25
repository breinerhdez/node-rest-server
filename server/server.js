require("./config/config");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// usando las rutas del usuario
app.use(require("./routes/usuario"));

mongoose.connect(
  process.env.URLDB,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, res) => {
    if (err) throw err;

    console.log("Base de datos: ONLINE");
  }
);

app.listen(process.env.PORT, () => {
  console.log("App run on PORT: " + process.env.PORT);
});
