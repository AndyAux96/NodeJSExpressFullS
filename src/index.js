const Express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const fileUpload = require('express-fileupload'); //Subir fotos
var fs = require('fs'); //Subir fotos




var app = Express();
var PORT = 49146;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Método para subir fotos 
app.use(fileUpload());
app.use('/Photos', Express.static(__dirname + '/Photos'));

//Conexión con la BDD
var conexSql = mysql.createConnection({
    host: 'localhost',
    database: 'bddempleados',
    user: 'root',
    password: 'skatesk8'
});


app.use(cors());

//Puerto para verificar si conecta
app.listen(PORT, () => {
    conexSql.connect(function (err) {
        if (err) {
            throw err
        } else {
            console.log("Conexión exitosa");
        }
    });
    console.log(`El servidor esta corriendo en el puerto: http://localhost:${PORT}`);

});

app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/api/departament', (req, res) => {
    var query = `select * from bddempleados.Departament;`;
    conexSql.query(query, function (err, rows, fields) {
        if (err) {
            res.send('fallo en respuesta');
        } else {
            res.send(rows);
        }
    });
});

app.post('/api/departament', (req, res) => {
    var query = `insert into bddempleados.Departament(DepartamentName) VALUE(?)`;
    var values = [
        req.body['DepartamentName']
    ]
    conexSql.query(query, values, function (err, rows, fields) {
        if (err) {
            res.send('fallo en respuesta');
        } else {
            res.json('Added Succesfull');
        }
    });
});
app.put('/api/departament', (req, res) => {
    var query = `UPDATE bddempleados.Departament set DepartamentName=? where DepartamentId=?`;
    var values = [
        req.body['DepartamentName'],
        req.body['DepartamentId']
    ]
    conexSql.query(query, values, function (err, rows, fields) {
        if (err) {
            res.send('fallo en respuesta');
        } else {
            res.json('Updated Succesfull');
        }
    });
});

app.delete('/api/departament/:id', (req, res) => {
    var query = `Delete from bddempleados.Departament where DepartamentId=?`;
    var values = [
        parseInt(req.params.id)
    ]
    conexSql.query(query, values, function (err, rows, fields) {
        if (err) {
            res.send('fallo en respuesta');
        } else {
            res.json('Deleted Succesfull');
        }
    });
});

app.get('/api/employee', (req, res) => {
    var query = `select * from bddempleados.Employee`;
    conexSql.query(query, function (err, rows, fields) {
        if (err) {
            res.send('fallo en respuesta');
        } else {
            res.send(rows);
        }
    });
});

app.post('/api/employee', (req, res) => {
    var query = `insert into bddempleados.Employee(EmployeeName, Departament, DateOfJoining, PhotoFileName) VALUE(?,?,?,?)`;
    var values = [
        req.body['EmployeeName'],
        req.body['Departament'],
        req.body['DateOfJoining'],
        req.body['PhotoFileName']
    ];
    conexSql.query(query, values, function (err, rows, fields) {
        if (err) {
            res.send('fallo en respuesta');
        } else {
            res.json('Added Succesfull');
        }
    });
});
app.put('/api/employee', (req, res) => {
    var query = `UPDATE bddempleados.employee set EmployeeName=?,Departament=?,DateOfJoining=?,PhotoFileName=? where EmployeeId=?`;
    var values = [
        req.body['EmployeeName'],
        req.body['Departament'],
        req.body['DateOfJoining'],
        req.body['PhotoFileName'],
        req.body['EmployeeId'],
    ]
    conexSql.query(query, values, function (err, rows, fields) {
        if (err) {
            res.send('fallo en respuesta');
        } else {
            res.json('Updated Succesfull');
        }
    });
});

app.delete('/api/employee/:id', (req, res) => {
    var query = `Delete from bddempleados.employee where EmployeeId=?`;
    var values = [
        parseInt(req.params.id)
    ]
    conexSql.query(query, values, function (err, rows, fields) {
        if (err) {
            res.send('fallo en respuesta');
        } else {
            res.json('Deleted Succesfull');
        }
    });
});

//Endpoint para subir fotos forma 1
app.post('/api/employee/savefile', (req, res) => {
    fs.writeFile("./Photos/" + req.files.img.name, req.files.img.data, function (err) {
        if (err) {
            return
            console.log(err);
        }
        res.json(req.files.img.name);

    })
});

//Forma 2
app.post('/api/employee/sv', (req, res) => {
    // Verifica si hay archivos en la solicitud
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }

    // El nombre del input de tipo archivo es 'image'
    let img = req.files.image;

    // Verificar si la imagen es undefined
    if (!req.files.image) {
        return res.status(400).send('El archivo de imagen es undefined.');
    }

    // Guarda el archivo en el sistema de archivos
    img.mv(`./Photos/${img.name}`, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Archivo subido exitosamente');
    });
});