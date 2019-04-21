const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//==============================
// Mostrar todas las categorias
//==============================
app.get('/categoria', (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    categorias
                });

            })



        })
});


//==============================
// Mostrar una categoria por id
//==============================
app.get('/categoria/:id', (req, res) => {
    // Categoria.findById(...);
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

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

    })
});


//==============================
// Crear nueva categoria
//==============================
app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    let body = req.body;
    let usuarioToken = req.usuario._id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuarioToken
    });

    categoria.save((err, categoriaDB) => {
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
// Actualizar categoria
//==============================
app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let desc = req.body.descripcion;

    Categoria.findByIdAndUpdate(id, { descripcion: desc }, { new: true, runValidators: true }, (err, categoriaDB) => {

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
// Eliminar categoria
//==============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            usuario: categoriaBorrada
        });

    });
});




module.exports = app;