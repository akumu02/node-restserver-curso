// const jwt = require('jsonwebtoken');

// // =======================
// // Verificar token
// // =======================
// let verificaToken = (req, res, next) => {
//     let token = req.get('token');

//     jwt.verify(token, process.env.seed, (err, decoded) => {

//         if (err) {
//             return res.status(401).json({
//                 ok: false,
//                 err
//             });
//         }

//         req.usuario = decoded.usuario;
//         next();
//     });

//     next();

// };


// module.exports = {
//     verificaToken
// }

const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.seed, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();
    })

}

// =======================
// Verifica admin role
// =======================
let verificaAdmin_Role = (req, res, next) => {

    let role = req.usuario.role;

    if (role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            message: 'No es admin'
        });
    }

    next();

}

module.exports = { verificaToken, verificaAdmin_Role }