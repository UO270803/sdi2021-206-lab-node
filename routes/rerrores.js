module.exports = function (app, swig) {
    app.get('/errores', function (req, res) {
        let respuesta = swig.renderFile('views/error.html');
        res.send(respuesta);
    })
}