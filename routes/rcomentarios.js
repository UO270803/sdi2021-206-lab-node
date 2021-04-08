module.exports = function(app, swig, gestorBD) {
    app.post('/comentarios/:cancion_id', function (req, res) {
        if ( req.session.usuario == null)
            res.send("Usuario no identificado");
        else {
            let comentario = {
                autor: req.session.usuario,
                comentario: req.body.texto,
                cancion_id: gestorBD.mongo.ObjectID(req.params.cancion_id)
            }

            gestorBD.insertarComentarios(comentario, function (cancion_id) {
                if (cancion_id == null)
                    res.send("Error al insertar comentario")
                else
                    res.redirect('/cancion/' + req.params.cancion_id);
            });
        }
    });
};