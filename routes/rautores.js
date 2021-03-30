module.exports = function(app, swig) {
    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/autores-agregar.html', {

        });


        res.send(respuesta);
    })
    app.post('/autor', function(req, res){
        let respuesta = "";

        if (req.body.nombre.trimEnd() == '')
            respuesta += "Nombre no enviado en la petición <br>";
        else
            respuesta += "Autor: " + req.body.nombre + "<br>";
        if (req.body.grupo.trimEnd() == '')
            respuesta += "Grupo no enviado en la peticion" + "<br>";
        else
            respuesta += "Grupo: " + req.body.grupo + "<br>";

        respuesta += "Rol: " + req.body.rol;
        res.send(respuesta);
    })
    app.get("/autores", function(req, res) {
        let autores = [ {
            "nombre" : "Cantante 1",
            "grupo" : "Grupo 1",
            "rol": "cantante"
        },{
            "nombre" : "Guitarrista 2",
            "grupo" : "Grupo 2",
            "rol": "guitarrista"
        },{
            "nombre" : "Bateria 3",
            "grupo" : "Grupo 3",
            "rol": "bateria"
        }];
        let respuesta = swig.renderFile('views/autores.html',{
            autores : autores
        });

        res.send(respuesta);
    });

    app.get("/autores/*", function (req, res){
        res.redirect("/autores");
    })
};