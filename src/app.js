const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path'); // Permite trabajar las rutas de node
const exphbs = require('express-handlebars'); // Permite traer handlebars para express

// Initializations
const app = express();
require('./database');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); // Apunta a la carpeta 'views'
app.engine('.hbs', exphbs({ // Configuración de motor de plantillas
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares => Funciones que se ejecutan antes de llegar a las rutas.
// Configuración para subir imágenes
app.use(morgan('dev')); // Mostrar mensajes cortos por la consola
app.use(express.json()); // Para el título de la imagen
app.use(express.urlencoded({ extended: false })); // Para entender datos desde formulario
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname)); // Para cambiar el nombre de la imagen
    }
});
app.use(multer({ storage }).single('image')); // Esta al tanto de la carga de Imágenes, Nombre del campo html encargado de subir las imágenes

// Routes
app.use(require('./routes')); // Busca por defecto el archivo index

module.exports = app;
