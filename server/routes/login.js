const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuario");

const app = express();

app.post("/login", async (req, res) => {
  try {
    let body = req.body;
    // consultar usuario en la base de datos
    let usuario = await Usuario.findOne({ email: body.email });

    // validar si existe el usuario
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "001: Usuario o contraseña incorrectos",
        },
      });
    }

    // validar si es la contraseña correcta
    if (!bcrypt.compareSync(body.password, usuario.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "002: Usuario o contraseña incorrectos",
        },
      });
    }

    // generar el token
    let token = jwt.sign({ usuario }, process.env.JWT_SIGN_SECRET, {
      expiresIn: parseInt(process.env.JWT_EXPIRES_IN),
    });

    // entregar la respuesta
    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      err,
    });
  }

  // sin utilizar el async await
  /*Usuario.findOne({ email: body.email }, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "001: Usuario o contraseña incorrectos",
        },
      });
    }

    if (!bcrypt.compareSync(body.password, usuario.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "002: Usuario o contraseña incorrectos",
        },
      });
    }

    res.json({
      ok: true,
      usuario,
      token: "456",
    });
  });*/
});

module.exports = app;
