const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


//==============================
// Obtener productos
//==============================
app.get('/productos', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    conteos: conteo
                });

            })



        })
});

//==============================
// Obtener producto por id
//==============================
app.get('/producto/:id', (req, res) => {
    let id = req.params.id;

    Producto.findById({ _id: id })
        .populate('usuario')
        .populate('categoria')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });

        })

});

//==============================
// Buscar productos
//==============================
app.get('/producto/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regexp = new RegExp(termino, 'i');

    Producto.find({ nombre: regexp })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });

        })

});

//==============================
// Crear un producto
//==============================
app.post('/producto', verificaToken, (req, res) => {
    // regresa la nueva categoria
    let body = req.body;
    let usuarioToken = req.usuario._id;
    let categoria = body.categoria;
    let nombre = body.nombre; //String, required: [true, 'El nombre es necesario'] },
    let precioUni = body.precioUni; //{ type: Number, required: [true, 'El precio únitario es necesario'] },
    let descripcion = body.descripcion; //{ type: String, required: false },
    let disponible = body.disponible; //{ type: Boolean, required: true, default: true },

    let producto = new Producto({
        usuario: usuarioToken,
        categoria,
        nombre,
        precioUni,
        descripcion,
        disponible
    });

    producto.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

//==============================
// Actualizar producto
//==============================
app.put('/producto/:id', (req, res) => {
    let id = req.params.id;
    let nombre = req.body.nombre;
    let desc = req.body.descripcion;

    Producto.findByIdAndUpdate(id, { nombre: nombre, descripcion: desc }, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: productoDB
        });

    });
});


//==============================
// Borrar producto
//==============================
app.delete('/producto/:id', function(req, res) {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: productoBorrado
        });

    });
});


module.exports = app;