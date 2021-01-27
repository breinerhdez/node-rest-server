const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");

const Usuario = require("../models/usuario");
const {
  verificarToken,
  verificarAdminRole,
} = require("../middlewares/autenticacion");

const app = express();

app.get("/usuario", [verificarToken, verificarAdminRole], function (req, res) {
  let page = req.query.page || 0;
  page = Number(page);
  // se maneja con números de página
  if (req.query.page && Number(req.query.page) >= 1) {
    console.log("página indicada: ", req.query.page);
    page--;
  }
  // límite de registros por página
  let limit = req.query.limit || 3;
  limit = Number(limit);
  // página actual por el número de registros esperados por página
  let skip = page * limit;

  let filter = { estado: true };
  let project = "nombre email estado role google";

  Usuario.find(filter, project)
    .limit(limit)
    .skip(skip)
    .exec(async (err, result) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      let total = await Usuario.countDocuments(filter);

      res.json({
        ok: true,
        total,
        total_in_page: result.length,
        usuarios: result,
      });
    });
});

app.post("/usuario", [verificarToken, verificarAdminRole], function (req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  // guardando el registro
  usuario.save((err, result) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: result,
    });
  });
});

app.put("/usuario/:id", [verificarToken, verificarAdminRole], function (req, res) {
  let id = req.params.id;
  // let body = req.body;
  // configurando los campos que sí son permitidos con underscore
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    function (err, result) {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: result,
      });
    }
  );
});

app.delete("/usuario/:id", [verificarToken, verificarAdminRole], function (req, res) {
  let id = req.params.id;

  let update = {
    estado: false,
  };

  Usuario.findByIdAndUpdate(id, update, { new: true }, (err, result) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: result,
    });
  });

  /*Usuario.findByIdAndRemove(id, (err, result) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!result) {
      return res.status(400).json({
        ok: false,
        err: { message: "El usuario no existe" },
      });
    }

    res.json({
      ok: true,
      usuario: result,
    });
  });*/
});

module.exports = app;
