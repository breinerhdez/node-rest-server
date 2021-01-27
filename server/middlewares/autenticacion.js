const jwt = require("jsonwebtoken");

/**
 * Verificar Token
 */
let verificarToken = async (req, res, next) => {
  let token = req.get("token");
  try {
    let decoded = await jwt.verify(token, process.env.JWT_SIGN_SECRET);
    req.usuario = decoded.usuario;
    next();
  } catch (err) {
    return res.status(401).json({
      ok: false,
      err,
    });
  }
  // jwt.verify(token, process.env.JWT_SIGN_SECRET, (err, decoded) => {
  //   if (err) {
  //     return res.status(401).json({
  //       ok: false,
  //       err,
  //     });
  //   }

  //   req.usuario = decoded.usuario;
  //   next();
  // });
};

/**
 * Verificar ADMIN_ROLE
 */

let verificarAdminRole = (req, res, next) => {
  let usuario = req.usuario;
  if (usuario.role === "ADMIN_ROLE") {
    next();
  } else {
    return res.status(401).json({
      ok: false,
      err: {
        message: "El usuario no tiene privilegios para esta operación",
      },
    });
  }
};

module.exports = {
  verificarToken,
  verificarAdminRole,
};
