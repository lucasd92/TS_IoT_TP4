var express = require('express');
var router = express.Router();

var jugadores;
var tablero;
var turno;
var ganador;

const marcas = ['x', 'o'];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.put('/empezar', function (request, response) {
  turno = 0;
  ganador = '';
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
  

  if(jugador === jugadores[turno]){
    if(tablero[fila][columna] === ' '){
      tablero[fila][columna] = marcas[turno];
      turno = (turno + 1) % 2;
    }
    if(((tablero[0][0] === tablero[1][0]) && (tablero[1][0] === tablero[2][0]) && (tablero[1][0] === 'o') ) ||
      ((tablero[0][1] === tablero[1][1]) && (tablero[1][1] === tablero[2][1]) && (tablero[1][1] === 'o') ) ||
      ((tablero[0][2] === tablero[1][2]) && (tablero[1][2] === tablero[2][2]) && (tablero[1][2] === 'o') ) ||
      ((tablero[0][0] === tablero[0][1]) && (tablero[0][1] === tablero[0][2]) && (tablero[0][1] === 'o') ) ||
      ((tablero[1][0] === tablero[1][1]) && (tablero[1][1] === tablero[1][2]) && (tablero[1][1] === 'o') ) ||
      ((tablero[2][0] === tablero[2][1]) && (tablero[2][1] === tablero[2][2]) && (tablero[2][1] === 'o') ) ||
      ((tablero[0][0] === tablero[1][0]) && (tablero[1][0] === tablero[2][0]) && (tablero[1][0] === 'x') ) ||
      ((tablero[0][1] === tablero[1][1]) && (tablero[1][1] === tablero[2][1]) && (tablero[1][1] === 'x') ) ||
      ((tablero[0][2] === tablero[1][2]) && (tablero[1][2] === tablero[2][2]) && (tablero[1][2] === 'x') ) ||
      ((tablero[0][0] === tablero[0][1]) && (tablero[0][1] === tablero[0][2]) && (tablero[0][1] === 'x') ) ||
      ((tablero[1][0] === tablero[1][1]) && (tablero[1][1] === tablero[1][2]) && (tablero[1][1] === 'x') ) ||
      ((tablero[2][0] === tablero[2][1]) && (tablero[2][1] === tablero[2][2]) && (tablero[2][1] === 'x') ) ||
      ((tablero[0][0] === tablero[1][1]) && (tablero[1][1] === tablero[2][2]) && (tablero[1][1] === 'o') ) ||
      ((tablero[2][0] === tablero[1][1]) && (tablero[1][1] === tablero[0][2]) && (tablero[0][2] === 'o') ) ||
      ((tablero[0][0] === tablero[1][1]) && (tablero[1][1] === tablero[2][2]) && (tablero[1][1] === 'x') ) ||
      ((tablero[2][0] === tablero[1][1]) && (tablero[1][1] === tablero[0][2]) && (tablero[0][2] === 'x') )){
      // Doy por finalizada la partida y declaro ganador
      turno = 2;
      ganador = jugador;
    }
  }

  response.setHeader('Content-Type', 'application/json');  
  response.send({turno: jugadores[turno], tablero: tablero, ganador: ganador});
});

module.exports = router;
