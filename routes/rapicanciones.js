module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });

    app.delete("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}
        let email = res.usuario;
        usuarioEsAutorCancion(email, criterio, function (errors) {
            if (errors != null && errors.length > 0){
                res.status(403);
                res.json({
                    errores: errors
                })
            }
            else {
                gestorBD.eliminarCancion(criterio, function (canciones) {
                    if (canciones == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.send(JSON.stringify(canciones));
                    }
                });
            }
        })

    });

    app.post("/api/cancion", function(req, res) {
        let cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio,
        }
        // ¿Validar nombre, genero, precio?
        validarDatosCrearCancion(cancion, function (errors) {
            if (errors != null && errors.length > 0){
                res.status(403);
                res.json({
                    errores: errors
                });
            }
            else {
                gestorBD.insertarCancion(cancion, function (id) {
                    if (id == null) {
                        errors.push("se ha producido un error");
                        res.status(500);
                        res.json({
                            errores: errors
                        })
                    } else {
                        res.status(201);
                        res.json({
                            mensaje: "canción insertada",
                            _id: id
                        });
                    }
                });
            }
        });
    });

    app.put("/api/cancion/:id", function(req, res) {

        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };

        let cancion = {}; // Solo los atributos a modificar
        if ( req.body.nombre != null)
            cancion.nombre = req.body.nombre;
        if ( req.body.genero != null)
            cancion.genero = req.body.genero;
        if ( req.body.precio != null)
            cancion.precio = req.body.precio;
        validarDatosActualizarCancion(cancion, function(errors){
            if (errors != null && errors.length > 0){
                res.status(403);
                res.json({
                    errores: errors
                });
            }
            else {
                gestorBD.modificarCancion(criterio, cancion, function (result) {
                    if (result == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.json({
                            mensaje: "canción modificada",
                            _id: req.params.id
                        })
                    }
                });
            }
        })
    });

    app.post('/api/autenticar', function(req, res){
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email : req.body.email,
            password : seguro
        }

        gestorBD.obtenerUsuarios(criterio, function(usuarios){
            if (usuarios == null || usuarios.length == 0){
                res.status(401); //Unauthorized
                res.json({
                    autenticado :false
                })
            }
            else{
                let token = app.get('jwt').sign(
                    {usuario: criterio.email , tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    token : token
                })
            }
        })
    })

    function validarDatosCrearCancion(cancion, functionCallback) {
        let errors = new Array();
        if (cancion.nombre === null || typeof cancion.nombre === 'undefined' || cancion.nombre === "")
            errors.push("El nombre de la cancion no puede estar vacio")
        if (cancion.genero === null || typeof cancion.genero === 'undefined' || cancion.genero === "")
            errors.push("El genero de la cancion no puede estar vacio")
        if (cancion.precio === null || typeof cancion.precio === 'undefined' || cancion.precio < 0)
            errors.push("El precio de la cancion no puede eser menor que 0")
        if (errors.length <= 0)
            functionCallback(null);
        else
            functionCallback(errors);
    }

    function usuarioEsAutorCancion(usuario, cancionid, functionCallback){
        let errors = new Array();

        gestorBD.obtenerCanciones(cancionid, function (canciones) {
            if (canciones[0].autor !== usuario) {
                errors.push("El usuario en sesión no tiene los privilegios necesarios para realizar esta acción");
                functionCallback(errors);
            }
            else {
                functionCallback(null);
            }
        })
    }

    function validarDatosActualizarCancion(cancion, functionCallback){
        let errors = new Array();
        if (cancion.nombre === null || typeof cancion.nombre === 'undefined' || cancion.nombre === "")
            errors.push("El nombre de la cancion no puede estar vacio")
        if (cancion.genero === null || typeof cancion.genero === 'undefined' || cancion.genero === "")
            errors.push("El genero de la cancion no puede estar vacio")
        if (cancion.precio === null || typeof cancion.precio === 'undefined' || cancion.precio < 0)
            errors.push("El precio de la cancion no puede eser menor que 0")
        if (errors.length <= 0)
            functionCallback(null);
        else
            functionCallback(errors);
    }
}
