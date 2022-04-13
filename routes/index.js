var express = require('express');
var router = express.Router();

var jugadores;
var tablero;
var turno;

const marcas = ['x', 'o'];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.put('/empezar', function (request, response) {
  turno = 0;
  jugadores = request.body.jugadores;
  jugadores.push('Finalizado');
  tablero = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' '],
  ];

  response.setHeader('Content-Type', 'application/json');  
  response.send({turno: jugadores[turno], tablero: tablero});
});

router.put('/movimiento', function (request, response) {
  const columna = request.body.columna;
  const fila = request.body.fila;
  const jugador = request.body.jugador;
  var ganador = '';

  if(jugador === jugadores[turno]){
    if(tablero[fila][columna] === ' '){
      tablero[fila][columna] = marcas[turno];
      turno = (turno + 1) % 2;
    }
  }

  response.setHeader('Content-Type', 'application/json');  
  response.send({turno: jugadores[turno], tablero: tablero, ganador: ganador});
});

module.exports = router;
