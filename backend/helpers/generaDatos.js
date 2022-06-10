// Generador de identificadores únicos para campos que sean unique
const { v4: uuidv4 } = require('uuid');
// Incluir los models que necesitemos para almacenar datos
const Modelo = require('../models/modelo.model');
const Pago = require('../models/payment.model');
const Proyecto = require('../models/project.model');
const Catalogo = require('../models/catalog.model');
const Escena = require('../models/escena.model');
const Cliente = require('../models/client.model');
const Rrss = require('../models/rrss.model');
const bcrypt = require('bcryptjs');


// Cargar el archivo de configuración
// dentro de config() pasamos el path (la ruta) donde está el archivo .env
require('dotenv').config({ path: '../.env' });
// Cargamos nuestra librería de conexión a la BD, con la ruta adecuada
const { dbConnection } = require('../database/configdb');
dbConnection();

const unico = uuidv4();
var catalogos = [];
var clientes = [];
var modelos = [];
var proyectos = [];

const rrss = async() => {
    const tipoR = ['Instagram', 'Twitter'];
    const tipo = tipoR[Math.floor((Math.random() * (tipoR.length - 1)))];
    const followers = Math.floor(Math.random() * 30) + 1;
    const temas = [
        ["Iluminación", Math.floor(Math.random() * 400) + 0],
        ["Minimalista", Math.floor(Math.random() * 200) + 0],
        ["Sostenibilidad de muebles", Math.floor(Math.random() * 500) + 0],
        ["Ofertas navideñas", Math.floor(Math.random() * 1000) + 0],
        ["Black Friday", Math.floor(Math.random() * 1300) + 0],

    ]
    let fechas = [];
    // console.log('seguidores', followers);
    for (let i = 0; i < followers; i++) {
        fechas.push(new Date());
    }
    const datos = {
        tipo: tipo,
        followers: followers,
        temas: temas,
        fecha: fechas,
    };
    console.log('rrss', datos);
    const nuevoRrss = new Rrss(datos);
    await nuevoRrss.save();
}



const nuevosDatos = async(index, valor) => {
    //Creación Catalogo
    const nombreC = ["Tikamoon", "Werdön", "Plebo", "Awes"];
    const fabricanteCatalogo = ["Construcción"];
    const nombres = ["Luis", "Pedro", "Alex"];
    const precioCatalogo = [23.99, 35.50, 58.36, 72.12];
    const imagenCatalogo = "hab" + (Math.floor(Math.random() * 4) + 1) + ".jpg";
    const nombreCatalogo = nombreC[Math.floor((Math.random() * (nombreC.length - 1)))];
    const num_modelos = Math.floor(Math.random() * 15) + 1;
    const fabricante = fabricanteCatalogo[Math.floor((Math.random() * (fabricanteCatalogo.length - 1)))] + " " + nombres[Math.floor((Math.random() * (nombres.length - 1)))];;
    const precio = precioCatalogo[Math.floor((Math.random() * (precioCatalogo.length - 1)))];
    const fecha = new Date();
    let models = [];

    const datosCatalogo = {
        nombre: nombreCatalogo,
        num_modelos: num_modelos,
        fabricante: fabricante,
        precio: precio,
        models: models,
        imagen: imagenCatalogo,
        fecha: fecha
    };
    //console.log('Catalogo', datosCatalogo);
    const nuevoCatalogo = new Catalogo(datosCatalogo);
    await nuevoCatalogo.save();
    catalogos.push(nuevoCatalogo);

    //Creación Modelo
    // const objetoModelo = ["Taburete"];
    const objetoModelo = ["Mesa", "Silla", "Cama", "Sillón", "Taburete", "Perchero", "Encimera", "Fregadero", "Lámpara", "Zapatero", "Bañera", "Ducha", "Armario", "Espejo", "Lavamanos", "Váter", "Televisión"];
    const detalleMesa = ["Escritorio", "Salón", "de Noche", "para TV"];
    const detalleSilla = ["Giratoria de Escritorio"];
    const detalleCama = ["Individual"];
    const detalleLamp = ["de Mesa"];
    const forma = ["cuadrada", "redonda", "ovalada", "rectangular", "original"];
    const material = ["cristal", "madera", "poliester", "plastico"];
    const habitacion = ["salon", "cocina", "dormitorio", "banyo"];
    let colorModelo = [
        ["#ff0000", "rojo vivo"],
        ["#4dffd2", "verde menta"],
        ["#ffff99", "amarillo pastel"],
        ["#ffffff", "blanco"],
    ];

    let archivoModelo = [
        ["algo", "armariooscuro"]
    ];

    const objModelo = objetoModelo[Math.floor((Math.random() * (objetoModelo.length - 1)))];
    let nombreModelo = objModelo;
    const tagsModelo = [];
    let imagenesModelo = [];
    let descripcionModelo = '';

    let imagenModelo = '';
    let medida_ancho = Math.floor(Math.random() * 210) + 20;
    let medida_alto = Math.floor(Math.random() * 210) + 20;
    let medida_largo = Math.floor(Math.random() * 210) + 20;

    if (objModelo == 'Mesa') {
        tagsModelo.push('mesa');
        nombreModelo = objModelo + ' ' + detalleMesa[Math.floor((Math.random() * (detalleMesa.length - 1)))];
        imagenModelo = 'mesa' + (Math.floor(Math.random() * 4) + 1) + ".jpg";

        if (nombreModelo == 'Mesa Escritorio') {
            colorModelo = [
                ["#ffffff", "blanco"],
            ];

            imgs = ['escritorio.png'];
            imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
            imagenModelo = 'escritorio.png';
            archivoModelo = [
                ["blanco", "escritorio"],
            ]

            medida_ancho = 120;
            medida_alto = 75;
            medida_largo = 48;

            descripcionModelo = "Mesa de escritorio grande y elegante, hecho de madera de roble, material altamente resistente y duradero."

        } else if (nombreModelo == 'Mesa para TV') {
            colorModelo = [
                ["#160F0D", "marrón oscuro"],
                ["#D2AD8B", "amarillo arena"],
                ["#454D78", "azul marino"],
                ["#5E2772", "púrpura"],
            ];

            imgs = ['mesa_render_tv.png'];
            imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
            imgs = ['mesa_render_amarillo.png'];
            imagenesModelo.push({ color: colorModelo[1][1], imagenes: imgs });
            imgs = ['mesa_render_azul.png'];
            imagenesModelo.push({ color: colorModelo[2][1], imagenes: imgs });
            imgs = ['mesa_render_lila.png'];
            imagenesModelo.push({ color: colorModelo[3][1], imagenes: imgs });

            imagenModelo = 'mesa_render_tv.png';
            archivoModelo = [
                ["marrón oscuro", "mesa_tv"],
                ["amarillo arena", "mesa_tv_marron_claro"],
                ["azul marino", "mesa_azul"],
                ["púrpura", "mesa_morado"],
            ]

            medida_ancho = 165;
            medida_alto = 41;
            medida_largo = 35;

            descripcionModelo = "Mesa para la televisión del salón, fabricada con madera de pino, buen aislantetérmico y eléctrico."


        } else if (nombreModelo == 'Mesa de Noche') {
            colorModelo = [
                ["#987D69", "marrón claro"],
                ["#402D2D", "marrón oscuro"],
            ];

            imgs = ['mesita.png', 'mesita2.png', 'mesita3.png', 'mesita4.png'];
            imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
            imgs = ['mesita_oscuro.png', 'mesita_oscuro2.png', 'mesita_oscuro3.png', 'mesita_oscuro4.png'];
            imagenesModelo.push({ color: colorModelo[1][1], imagenes: imgs });

            imagenModelo = 'mesita.png';
            archivoModelo = [
                ["marrón claro", "mesita_noche"],
                ["marrón oscuro", "mesita_noche_oscuro"],

            ]
            medida_ancho = 42;
            medida_alto = 42;
            medida_largo = 34;

            descripcionModelo = "Mesita de noche de madera de arce, muy sencilla y bonita."


        } else if (nombreModelo == 'Mesa Salón') {
            colorModelo = [
                ["#BC9268", "marrón"],
            ];

            imgs = ['mesa_salon.png', 'mesa_salon2.png', 'mesa_salon3.png', 'mesa_salon4.png'];
            imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
            imagenModelo = 'mesa_salon.png';

            archivoModelo = [
                ["marrón", "mesa_salon"],
            ]

            medida_ancho = 94;
            medida_alto = 36;
            medida_largo = 54;

            descripcionModelo = "Mesa ideal para decorar el salón, fabricada con madera de haya, material muy popular por su gran calidad, duradera."


        }
    } else if (objModelo == 'Silla') {
        tagsModelo.push('silla');
        nombreModelo = objModelo + ' ' + detalleSilla[Math.floor((Math.random() * (detalleSilla.length - 1)))];
        imagenModelo = 'silla' + (Math.floor(Math.random() * 4) + 1) + ".jpg";

        if (nombreModelo == 'Silla Giratoria de Escritorio') {
            colorModelo = [
                ["#000000", "negro"],
            ];

            imgs = ['sillaEscritorio.png'];
            imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
            imagenModelo = 'sillaEscritorio.png';

            archivoModelo = [
                ["negro", "silla"],
            ]

            medida_ancho = 46;
            medida_alto = 88;
            medida_largo = 41;

            descripcionModelo = "Silla ideal para oficina, acabados en cuero y fibra de carbono";

        }

    } else if (objModelo == 'Cama') {
        nombreModelo = objModelo + ' ' + detalleCama[Math.floor((Math.random() * (detalleCama.length - 1)))];
        tagsModelo.push('cama');

        if (nombreModelo == 'Cama Individual') {
            colorModelo = [
                ["#ffffff", "blanco"],
                ["#967451", "marrón"],
                ["#6172CC", "lila"],
                ["#FF6A43", "rojo coral"],
                ["#537818", "verde césped"],

            ];

            imgs = ['cama.png'];
            imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
            imgs = ['cama_marron.png', 'cama_marron2.png', 'cama_marron3.png', 'cama_marron4.png'];
            imagenesModelo.push({ color: colorModelo[1][1], imagenes: imgs });
            imgs = ['cama_lila.png', 'cama_lila2.png', 'cama_lila3.png', 'cama_lila4.png'];
            imagenesModelo.push({ color: colorModelo[2][1], imagenes: imgs });
            imgs = ['cama_rojo.png', 'cama_rojo2.png', 'cama_rojo3.png', 'cama_rojo4.png'];
            imagenesModelo.push({ color: colorModelo[3][1], imagenes: imgs });
            imgs = ['cama_verde.png', 'cama_verde2.png', 'cama_verde3.png', 'cama_verde4.png'];
            imagenesModelo.push({ color: colorModelo[4][1], imagenes: imgs });
            imagenModelo = 'cama.png';

            medida_ancho = 120;
            medida_alto = 80;
            medida_largo = 190;

            archivoModelo = [
                ["azul", "cama_azul"]

            ]

            descripcionModelo = "Cama individual juvenil, con toques florales, lumier y cabezal fabricados con madera nogal, super resistente a agrietamientos y golpes.";

        } else {
            imagenModelo = 'cama' + (Math.floor(Math.random() * 4) + 1) + ".jpg";
        }
    } else if (objModelo == 'Sillón') {
        colorModelo = [
            ["#ffffff", "blanco"]
        ];
        imgs = ['sillon.png'];
        imagenModelo = 'sillon.png';
        imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
        tagsModelo.push('sillon');

        archivoModelo = [
            ["blanco", "sillon"],
        ]

        medida_ancho = 63;
        medida_alto = 75;
        medida_largo = 49;

        descripcionModelo = "Sillón mullido y cómodo, tapices de cuero de gran calidad y acabados de madera de haya";

    } else if (objModelo == 'Taburete') {
        colorModelo = [
            ["#B38F6F", "marrón"],
            ["#91ff74", "verde manzana"],
            ["#000000", "negro carbón"],
            ["#ffffff", "blanco hielo"],
        ];

        tagsModelo.push('taburete');

        imgs = ['taburete.png', 'taburete2.png', 'taburete3.png'];
        imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
        imgs = ['taburete_verde.png'];
        imagenesModelo.push({ color: colorModelo[1][1], imagenes: imgs });
        imgs = ['taburete_negro.png'];
        imagenesModelo.push({ color: colorModelo[2][1], imagenes: imgs });
        imgs = ['taburete_blanco.png'];
        imagenesModelo.push({ color: colorModelo[3][1], imagenes: imgs });

        imagenModelo = 'taburete.png';

        archivoModelo = [
            ["marrón", "taburete"],
            ["verde manzana", "taburete_verde"],
            ["negro carbón", "taburete_negro"],
            ["blanco hielo", "taburete_blanco"],
        ]

        medida_ancho = 30;
        medida_alto = 65;
        medida_largo = 30;

        descripcionModelo = "Taburete de madera caoba, grano fino y de gran calidad, muy duradera.";
    } else if (objModelo == 'Perchero') {
        tagsModelo.push('perchero');
        colorModelo = [
            ["#B38F6F", "marrón"],
        ];
        imgs = ['perchero.png'];
        imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
        imagenModelo = 'perchero.png';

        archivoModelo = [
            ["marrón", "perchero"]
        ]

        medida_ancho = 24;
        medida_alto = 172;
        medida_largo = 24;

        descripcionModelo = "Perchero de madera de teca, color amarillento miel unidforma con ligeras vetas. Resistente a la putrefacción e insectos.";


    } else if (objModelo == 'Lavamanos') {
        tagsModelo.push('lavamanos');
        colorModelo = [
            ["#453224", "marrón"],
        ];
        imgs = ['lavamanos.png', 'lavamanos2.png'];
        imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
        imagenModelo = 'lavamanos.png';

        archivoModelo = [
            ["marrón", "lavamanos"]
        ]

        medida_ancho = 120;
        medida_alto = 100;
        medida_largo = 62;

        descripcionModelo = "Lavamanos de madera de abeto, color oscuro muy característico, resistente a la humedad";


    } else if (objModelo == 'Zapatero') {
        tagsModelo.push('zapatero');
        colorModelo = [
            ["#ffffff", "blanco"],
        ];

        imgs = ['zapatero.png', 'zapatero2.png'];
        imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
        imagenModelo = 'zapatero.png';
        archivoModelo = [
            ["blanco", "zapatero"]
        ]
        medida_ancho = 60;
        medida_alto = 114;
        medida_largo = 22;

    } else if (objModelo == 'Encimera') {
        tagsModelo.push('encimera');
        colorModelo = [
            ["#ffffff", "blanco"],
            ["#000000", "negro"],
        ];

        imgs = ['encimera.png'];
        imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
        imgs = ['encimera_negra.png'];
        imagenesModelo.push({ color: colorModelo[1][1], imagenes: imgs });

        imagenModelo = 'encimera.png';
        archivoModelo = [
            ["blanco", "encimera"],
            ["negro", "encimera_negra"],
        ]

        medida_ancho = 292;
        medida_alto = 80;
        medida_largo = 74;

        descripcionModelo = "Encimera porcelánica no porosa, no necesita una capa de sellado de protección como lo hacen las de piedra natural.";

    } else if (objModelo == 'Fregadero') {
        tagsModelo.push('fregadero');
        colorModelo = [
            ["#9b9b9b", "gris"],
        ];

        archivoModelo = [
            ["gris", "encimera"],
        ];

        imgs = ['encimera.png'];
        imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
        imagenModelo = 'encimera.png';

        medida_ancho = 292;
        medida_alto = 80;
        medida_largo = 74;

        descripcionModelo = "Fregadero de acero inoxidable de gran calidad.";

    } else if (objModelo == 'Lámpara') {
        nombreModelo = objModelo + ' ' + detalleLamp[Math.floor((Math.random() * (detalleLamp.length - 1)))];
        if (nombreModelo == 'Lámpara de Mesa') {
            tagsModelo.push('lampara');
            colorModelo = [
                ["#ffffff", "blanco"],
            ];
            imgs = ['lamparita.png'];
            imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
            imagenModelo = 'lamparita.png';

            archivoModelo = [
                ["blanco", "lamparita"],
            ];
            medida_ancho = 20;
            medida_alto = 31;
            medida_largo = 20;

            descripcionModelo = "Lámpara de mesa de noche, ideal para iluminar darle un agradable entorno cálido a la habitación";

        }
    } else if (objModelo == 'Ducha') {
        tagsModelo.push('ducha');
        colorModelo = [
            ["#6F6F6F", "gris"],
            ["#203D63", "azul"],
        ];

        imgs = ['ducha.png'];
        imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
        imgs = ['ducha_azul.png'];
        imagenesModelo.push({ color: colorModelo[1][1], imagenes: imgs });

        imagenModelo = 'ducha.png';

        archivoModelo = [
            ["gris", "ducha"],
            ["azul", "ducha_azul"],
        ];

        medida_ancho = 90;
        medida_alto = 90;
        medida_largo = 220;

        descripcionModelo = "Ducha de acero inoxidable y vidreo ultra resistente, aspecto clásico y elegante.";


    } else if (objModelo == 'Armario') {
        tagsModelo.push('armario');
        colorModelo = [
            ["#422F21", "marrón"],
        ];
        imgs = ['armario.png'];
        imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
        imagenModelo = 'armario.png';

        archivoModelo = [
            ["marrón", "armariooscuro"],
        ];

        medida_ancho = 118;
        medida_alto = 211;
        medida_largo = 77;

        descripcionModelo = "Armario de roble, color característico que oscurece con la luz, muy resistente y duradero.";

    } else if (objModelo == 'Espejo') {
        tagsModelo.push('espejo');
        colorModelo = [
            ["#5C5C5C", "gris metálico"],
            ["#90B4E3", "azul"],
            ["#FFBF75", "amarillo ocre"],
        ];
        imgs = ['espejo_render.png', 'espejo_render2.png', 'espejo_render3.png'];
        imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
        imgs = ['espejo_render_azul.png', 'espejo_render_azul2.png', 'espejo_render_azul3.png', 'espejo_render_azul4.png'];
        imagenesModelo.push({ color: colorModelo[1][1], imagenes: imgs });
        imgs = ['espejo_render_amarillo.png', 'espejo_render_amarillo2.png', 'espejo_render_amarillo3.png'];
        imagenesModelo.push({ color: colorModelo[2][1], imagenes: imgs });

        imagenModelo = 'espejo_render.png';
        archivoModelo = [
            ["gris metálico", "espejo"],
            ["azul", "espejo_azul"],
            ["amarillo", "espejo_naranja"]
        ];

        medida_ancho = 64;
        medida_alto = 94;
        medida_largo = 6;

        descripcionModelo = "Espejo de hierro, tintado, acabados muy finos y elegantes.";

    } else if (objModelo == 'Bañera') {
        tagsModelo.push('ducha');
        colorModelo = [
            ["#ffffff", "blanco"],
            ["#61A3B4", "azul"],
            ["#B80000", "roja"],
        ];

        imgs = ['banyera.png', 'banyera2.png'];
        imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
        imgs = ['banyera_azul.png'];
        imagenesModelo.push({ color: colorModelo[1][1], imagenes: imgs });
        imgs = ['banyera_roja.png'];
        imagenesModelo.push({ color: colorModelo[2][1], imagenes: imgs });

        imagenModelo = 'banyera.png';

        archivoModelo = [
            ["blanco", "banyera"],
            ["azul", "banyera_azul"],
            ["roja", "banyera_rojo"],
        ];

        medida_ancho = 56;
        medida_alto = 50;
        medida_largo = 165;

        descripcionModelo = "Bañera de mármol, gran calidad de material, forma simple y minimalista";

    } else if (objModelo == 'Váter') {
        tagsModelo.push('vater');
        colorModelo = [
            ["#ffffff", "blanco mármol"],
            ["#4F7288", "azul pálido"],
            ["#E99A06", "amarillo plátano"],
            ["#7B4F23", "marrón ocre"],
        ];

        imgs = ['wc_render.png', 'wc_render2.png'];
        imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
        imgs = ['wc_render_azul.png', 'wc_render_azul2.png', 'wc_render_azul3.png', 'wc_render_azul4.png'];
        imagenesModelo.push({ color: colorModelo[1][1], imagenes: imgs });
        imgs = ['wc_render_amarillo.png', 'wc_render_amarillo2.png', 'wc_render_amarillo3.png', 'wc_render_amarillo4.png'];
        imagenesModelo.push({ color: colorModelo[2][1], imagenes: imgs });
        imgs = ['wc_render_marron.png', 'wc_render_marron2.png', 'wc_render_marron3.png', 'wc_render_marron4.png'];
        imagenesModelo.push({ color: colorModelo[3][1], imagenes: imgs });

        imagenModelo = 'wc_render.png';

        archivoModelo = [
            ["blanco mármol", "vater"],
            ["azul pálido", "vater_azul"],
            ["amarillo plátano", "vater_naranja"],
            ["marrón ocre", "vater_marron"],
        ];

        medida_ancho = 40;
        medida_alto = 74;
        medida_largo = 45;

        descripcionModelo = "Váter de piedra natural, no porosa, forma simple";

    } else if (objModelo == 'Televisión') {
        tagsModelo.push('tv');
        colorModelo = [
            ["#D43E3C", "rojo pasión"],
            ["#00004C", "azul oscuro"],
            ["#723B0D", "marrón vaca"],
            ["#004213", "verde selva"],
        ];

        imgs = ['tv_render_rojo.png', 'tv_render_rojo2.png', 'tv_render_rojo3.png'];
        imagenesModelo.push({ color: colorModelo[0][1], imagenes: imgs });
        imgs = ['tv_render_azul.png', 'tv_render_azul2.png', 'tv_render_azul3.png', 'tv_render_azul4.png'];
        imagenesModelo.push({ color: colorModelo[1][1], imagenes: imgs });
        imgs = ['tv_render_naranja.png', 'tv_render_naranja2.png', 'tv_render_naranja3.png'];
        imagenesModelo.push({ color: colorModelo[2][1], imagenes: imgs });
        imgs = ['tv_render_verde.png', 'tv_render_verde2.png'];
        imagenesModelo.push({ color: colorModelo[3][1], imagenes: imgs });

        imagenModelo = 'tv_render_azul.png';

        archivoModelo = [
            ["rojo pasión", "tv_rojo"],
            ["azul oscuro", "tv_azul"],
            ["marrón vaca", "tv_marron"],
            ["verde selva", "tv_verde"],
        ]

        medida_ancho = 145;
        medida_alto = 84;
        medida_largo = 53;

        descripcionModelo = "Televisión de 65 pulgadas.";

    } else {
        imagenModelo = 'armario.png';
        tagsModelo.push(objeto[Math.floor((Math.random() * (objeto.length - 1)))]);
        archivoModelo = ["algo", "armariooscuro"];
    }

    tagsModelo.push(forma[Math.floor((Math.random() * (forma.length - 1)))]);
    tagsModelo.push(material[Math.floor((Math.random() * (material.length - 1)))]);
    tagsModelo.push(habitacion[Math.floor((Math.random() * (habitacion.length - 1)))]);
    let precioM = (Math.random() * 320) + 20;
    precioM = precioM.toFixed(2);
    let peso = (Math.random() * 60) + 2;
    peso = peso.toFixed(2);

    let num = Math.floor((Math.random() * (catalogos.length - 1)));
    const nombre_catalogo = catalogos[num]['nombre'];
    const catalogo = catalogos[num]['_id'].toString();

    const datosModelo = {
        nombre: nombreModelo,
        catalogo: catalogo,
        nombre_catalogo: nombre_catalogo,
        descripcion: descripcionModelo,
        medida_ancho: medida_ancho,
        medida_alto: medida_alto,
        medida_largo: medida_largo,
        precio: precioM,
        peso: peso,
        tags: tagsModelo,
        archivo: archivoModelo,
        imagen: imagenModelo,
        imagenes: imagenesModelo,
        colores: colorModelo,
        fecha: fecha,
    };
    // Lo imprimimos por pantalla
    //console.log('modelo', datosModelo);
    const nuevoModelo = new Modelo(datosModelo);
    await nuevoModelo.save();
    modelos.push(nuevoModelo);

    //inserto modelos en catalogos
    // for (let entry of modelos) {
    //     models.push(entry._id.toString());
    // }
    numMC = Math.floor(Math.random() * 10) + 1;
    for (let i = 0; i < numMC; i++) {
        numM = Math.floor(Math.random() * modelos.length);
        models.push(modelos[numM]['_id'].toString());
    }
    // console.log('quiero ver esto', nuevoCatalogo.models);
    nuevoCatalogo.models = models;
    await nuevoCatalogo.save();


    //Creación de Clientes
    const nombreCliente = ["Maria", "Juan", "Carmen", "Pepito"];
    const apellidosCliente = ["García", "Hernández", "Gómez", "Soler", "Rodriguez"];
    const companyCliente = ["Decoración y estilo", "Disseny", "Hermanos Alicante"];
    const palabras = ["construccion.alicante", "diseño_interior_al", "obras_mad"]
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const minus = "abcdefghijklmnopqrstuvwxyz";
    const signos = ",.-_`´+'¡¿|!·~$";
    const direccionCliente = ["Calle", "Avenida"];
    const nombreDireccion = ["Pardo Gimeno", "San Francisco", "Músico Pau Casals", "Pepito Manolito"]
    const planCliente = ["GRATUITO", "BASICO-MENSUAL", "BASICO-ANUAL", "PREMIUM-MENSUAL", "PREMIUM-ANUAL"];

    const nombre = nombreCliente[Math.floor((Math.random() * (nombreCliente.length - 1)))];
    const apellidos = apellidosCliente[Math.floor((Math.random() * (apellidosCliente.length - 1)))] + " " + apellidosCliente[Math.floor((Math.random() * (apellidosCliente.length - 1)))];
    const company = companyCliente[Math.floor((Math.random() * (companyCliente.length - 1)))];
    const nif = (Math.floor(Math.random() * 99999999) + 10000000) + alfabeto[Math.floor((Math.random() * (alfabeto.length - 1)))];
    let nombreEmail = "";
    for (let i = 0; i < 5; i++) {
        nombreEmail += minus[Math.floor((Math.random() * (minus.length - 1)))];
    }
    const email = nombreEmail + '@gmail.com';
    let password = "";
    for (let i = 0; i < 6; i++) {
        password += alfabeto[Math.floor((Math.random() * (alfabeto.length - 1)))];
    }
    password += Math.floor(Math.random() * 10);
    password += signos[Math.floor((Math.random() * (signos.length - 1)))];
    const salt = bcrypt.genSaltSync();
    password = bcrypt.hashSync("123", salt);
    let telefono = "9";
    for (let i = 0; i < 8; i++) {
        telefono += Math.floor(Math.random() * 10);
    }

    const imagen = "perfil" + (Math.floor(Math.random() * 4) + 1) + ".jpg";
    const direccion = direccionCliente[Math.floor((Math.random() * (direccionCliente.length - 1)))] + " " + nombreDireccion[Math.floor((Math.random() * (nombreDireccion.length - 1)))]
    const rol = "ROL_CLIENTE";
    const plan = planCliente[Math.floor((Math.random() * (planCliente.length - 1)))];
    const numProjects = 0
    const numCatalog = 0
    const fechaC = new Date();
    let catalogosC = [];
    const datosCliente = {
        nombre: nombre,
        apellidos: apellidos,
        company: company,
        nif: nif,
        email: email,
        password: password,
        telefono: telefono,
        direccion: direccion,
        imagen: imagen,
        rol: rol,
        plan: plan,
        numProjects: numProjects,
        numCatalog: numCatalog,
        alta: fechaC,
        catalogos: catalogosC
    };
    // Lo imprimimos por pantalla
    console.log(datosCliente);
    // Creamos un objeto de moongose del modelo con los datosCliente a guardar
    const nuevoCliente = new Cliente(datosCliente);
    // Guardamos en BD
    await nuevoCliente.save();
    clientes.push(nuevoCliente);


    //Creación de Pagos

    num = Math.floor((Math.random() * (clientes.length - 1)));
    const nombre_companyia = clientes[num]['company'];
    const companyia = clientes[num]['_id'].toString();
    const planPago = clientes[num]['plan'];

    //sustituir por el precio del plan de pago + catalogos si tiene comprados
    const map = new Map();
    map.set('GRATUITO', 0);
    map.set('BASICO-MENSUAL', 11.99);
    map.set("BASICO-ANUAL", 119.99);
    map.set('PREMIUM-MENSUAL', 30.00);
    map.set('PREMIUM-ANUAL', 265.00);

    // let keys = Array.from(map.keys());
    // const planP = keys[Math.floor(Math.random() * keys.length)];
    const precioP = map.get(planPago);
    const periodoIni = new Date();
    const periodoFin = new Date();
    const fechaP = new Date();
    const datosPago = {
        companyia: companyia,
        nombre_companyia: nombre_companyia,
        plan: planPago,
        periodoIni: periodoIni,
        periodoFin: periodoFin,
        precio: precioP,
        fecha: fechaP,
        fechaC: fecha

    };
    // Lo imprimimos por pantalla
    console.log(datosPago);
    // Creamos un objeto de moongose del modelo con los datosPago a guardar
    const nuevoPago = new Pago(datosPago);
    // Guardamos en BD
    await nuevoPago.save();

    //Creación de proyecto
    const tipoHab = ["Habitación", "Baño", "Salón", "Aseo", "Salón"];
    const tipoAdjetivo = ["Moderna", "Clásica", "Minimalista", ""];
    const edad = ["niña", "joven", "persona mayor"];
    const colores = ["azul", "blanco", "negro", "verde"];
    const posicion = [2, 3, 4, 5, 6]
    const angulo = [22, 13, 44, 35, 76, 120, 135]
    const titulo = tipoHab[Math.floor((Math.random() * (tipoHab.length - 1)))] + " " + tipoAdjetivo[Math.floor((Math.random() * (tipoAdjetivo.length - 1)))];
    const descripcionP = titulo + " para una " + edad[Math.floor((Math.random() * (edad.length - 1)))];
    const notas = "Presupuesto de: " + Math.floor(Math.random() * 12000) + 500 + "€. Su color favorito es " + colores[Math.floor((Math.random() * (colores.length - 1)))]

    const arrayClientes = [
        ["Maria del Mar", "maria.25@gmail.com"],
        ["Elena Albaricoque", "ele_98@gmail.com"],
    ];
    const n_muebles = Math.floor(Math.random() * 10) + 1;
    const imagenProyecto = "render" + (Math.floor(Math.random() * 4) + 1) + ".jpg";
    num = Math.floor((Math.random() * (clientes.length - 1)));
    const nombre_creador = clientes[num]['nombre'] + " " + clientes[num]['apellidos'];
    const cliente = clientes[num]['_id'].toString();

    array = [];
    for (let i = 0; i < n_muebles; i++) {
        num = Math.floor((Math.random() * (modelos.length - 1)));
        x = posicion[Math.floor((Math.random() * (posicion.length - 1)))];
        y = 0;
        z = posicion[Math.floor((Math.random() * (posicion.length - 1)))];
        var float32 = new Float32Array(16);

        numF = Math.floor(Math.random() * 15);
        float32[numF] = 1;

        for (let i = 0; i < 3; i++) {
            numF = Math.floor(Math.random() * 15);
            float32[i] = (Math.random() * 1).toFixed(16);
        }
        for (let i = 0; i < 2; i++) {
            numF = Math.floor(Math.random() * 15);
            float32[i] = -(Math.random() * 1).toFixed(16);
        }
        //rotacion = new mat4.create();
        modelo = modelos[num]['_id'].toString();
        array.push({ modelo, x, y, z, float32 });
    }


    const n = ["María", "ErPepe", "Alex", "Lala"];
    let notificaciones = [];
    nA = n[Math.floor((Math.random() * (n.length - 1)))];
    let notificacion = nA + " ha aceptado tu invitación al proyecto";
    notificaciones.push(notificacion);
    notificacion = "La colección " + nombreC[Math.floor((Math.random() * (nombreC.length - 1)))] + " ha sido descatalogada."
    notificaciones.push(notificacion);
    notificacion = "Hay nuevos muebles disponibles en el catalogo " + nombreC[Math.floor((Math.random() * (nombreC.length - 1)))];
    notificaciones.push(notificacion);

    let comentarios = [];
    const frasesU = ["Puedes girar la mesa 90ºC?", "La lámpara puede ser de color azul más claro?", "Hay una mesa llamada Awos, que me gusta más"];
    const frasesC = ["Así te parece mejor?", "Te gusta?", "Claro, lo muevo hacia la izquierda", "Tenemos los colores que ves en el catálogo"];
    for (let i = 0; i < 10; i++) {
        let comentario = [];
        if (i % 2 == 0) {
            comentario.push(cliente);
            comentario.push(frasesC[Math.floor((Math.random() * (frasesC.length - 1)))]);

        } else {
            comentario.push('id_usuario_final');
            comentario.push(frasesU[Math.floor((Math.random() * (frasesU.length - 1)))]);

        }
        comentario.push(new Date());
        comentarios.push(comentario);
    }


    const estados = ["Terminado", "En desarrollo"];
    const estado = estados[Math.floor((Math.random() * (estados.length - 1)))];

    const datosProyecto = {
        titulo: titulo,
        descripcion: descripcionP,
        notas: notas,
        comentarios: comentarios,
        notificaciones: notificaciones,
        estado: estado,
        creador: cliente,
        nombre_creador: nombre_creador,
        clientes: arrayClientes,
        n_muebles: n_muebles,
        muebles: array,
        fechaC: fechaC,
        imagen: imagenProyecto,
        fecha: fechaC,

    };
    // Lo imprimimos por pantalla
    console.log(datosProyecto);
    // Creamos un objeto de moongose del modelo con los datos a guardar
    const nuevoProyecto = new Proyecto(datosProyecto);
    // Guardamos en BD
    await nuevoProyecto.save();
    proyectos.push(nuevoProyecto);

    //Creación Escenas

    //[x,y,z]
    const tituloEscena = ['Cambio de mueble', 'Versión 2', 'Copia 5', 'Acabado'];
    const imagenEscena = "render" + (Math.floor(Math.random() * 4) + 1) + ".jpg";
    numC = Math.floor((Math.random() * (clientes.length - 1)));
    autor = clientes[numC]['nombre'].toString() + " " + clientes[numC]['apellidos'].toString();
    // autor = autorEscena[Math.floor((Math.random() * (autorEscena.length - 1)))];

    const arrayMuebles = [];
    let coordenadas, proyecto_uid, orientacion, mueble_uid;
    numP = Math.floor((Math.random() * (proyectos.length - 1)));
    proyecto_uid = proyectos[numP]['_id'].toString();

    var float32 = new Float32Array(16);

    numF = Math.floor(Math.random() * 15);
    float32[numF] = 1;

    for (let i = 0; i < 3; i++) {
        numF = Math.floor(Math.random() * 15);
        float32[i] = (Math.random() * 1).toFixed(16);
    }
    for (let i = 0; i < 2; i++) {
        numF = Math.floor(Math.random() * 15);
        float32[i] = -(Math.random() * 1).toFixed(16);
    }

    const orientacionEscena = ['x', 'y', 'z', '-x', '-y', '-z'];

    const random = Math.floor(Math.random() * 15) + 0;
    for (let i = 0; i < random; i++) {
        coordenadas = [{ x: Math.floor(Math.random() * 150) + 0, y: Math.floor(Math.random() * 150) + 0, z: Math.floor(Math.random() * 150) + 0 }];
        orientacion = float32;
        numM = Math.floor((Math.random() * (modelos.length - 1)));
        mueble_uid = modelos[numM]['_id'].toString();
        arrayMuebles.push({ coordenadas: coordenadas, orientacion: orientacion, mueble_uid: mueble_uid });
    }
    const fechaE = new Date();
    const tituloE = tituloEscena[Math.floor((Math.random() * (tituloEscena.length - 1)))];
    const datosEscena = {
        titulo: tituloE,
        proyecto_uid: proyecto_uid,
        muebles: arrayMuebles,
        imagen: imagenEscena,
        autor: autor,
        fechaC: fechaE
    };
    console.log('Escena', datosEscena);
    const nuevaEscena = new Escena(datosEscena);
    await nuevaEscena.save();


    //ASIGNACIÓN DE CATALOGOS

    let c = [];
    numC = Math.floor((Math.random() * (catalogos.length - 1)));

    // console.log('plan cliente', nuevoCliente.plan);
    if (nuevoCliente.plan == 'GRATUITO') {
        const numC = Math.floor((Math.random() * (catalogos.length - 1)));
        c.push(catalogos[numC]['_id'].toString());
    } else if (nuevoCliente.plan == 'BASICO-MENSUAL' || nuevoCliente.plan == 'BASICO-ANUAL') {
        numC = Math.floor((Math.random() * (catalogos.length - 1)));
        for (let i = 0; i < numC && i < 8; i++) {
            const numC = Math.floor((Math.random() * (catalogos.length - 1)));
            c.push(catalogos[numC]['_id'].toString());
        }
    } else {
        numC = Math.floor((Math.random() * (catalogos.length - 1)));
        for (let i = 0; i < numC && i < 30; i++) {
            const numC = Math.floor((Math.random() * (catalogos.length - 1)));
            c.push(catalogos[numC]['_id'].toString());
        }

    }
    nuevoCliente.catalogos = c;
    nuevoCliente.numCatalog = c.length;
    // console.log(nuevoCliente.numCatalog);
    await nuevoCliente.save();

    //ASIGNACIÓN NUM PROYECTOS POR CLIENTE
    cont = 0;
    pos = 0;
    // console.log('cliente actual', nuevoCliente._id.toString());

    if (index == valor - 1) {
        for (let i = 0; i < clientes.length; i++) {
            cont = 0;
            pos = 0;
            for (let entry of proyectos) {
                if (clientes[i]['_id'].toString() == entry.creador.toString()) {
                    pos = i;
                    cont++;
                }
            }
            // console.log('contador', cont);
            // console.log('posicion', pos);
            clientes[pos].numProjects = cont;
            // console.log('numProyectos', clientes[pos].numProjects);
            await clientes[i].save();

        }

        //inserto modelos en catalogos
        for (let i = 0; i < catalogos.length; i++) {
            numMC = Math.floor(Math.random() * modelos.length) + 1;
            let modelosCatalogo = [];
            for (let j = 0; j < numMC; j++) {
                numM = Math.floor(Math.random() * modelos.length);
                modelosCatalogo.push(modelos[numM]['_id'].toString());
            }
            catalogos[i].models = modelosCatalogo;
            await catalogos[i].save();
        }
        // console.log('quiero ver esto', nuevoCatalogo.models);

    }
}

let nombre, segundo, valor, var4 = false;

process.argv.forEach(function(val, index, array) {
    nombre = array[2];
    valor = parseInt(array[3]);
});

if (nombre == 'datos') {
    for (let index = 0; index < valor; index++) {
        nuevosDatos(index, valor);
    }
} else if (nombre == 'rrss') {
    rrss();
}