const chai = require("chai");
const chaiHttp = require("chai-http");
const res = require("express/lib/response");
const server = require("../app");
const should = chai.should();

chai.use(chaiHttp);

// inicia primer jugador con tablero vacío
//cuando juega, se ocupa casilla y le toca al segundo
//cuando juega el segundo, 2 casillas ocupadas con marcas diferentes y le toca al primero
//Si juega fuera de su turno, el tablero no cambia
//Si juega en misma casilla, el tablero no cambia y le vuelve a tocar al mismo
// si hay 3 iguales en una columna,  gana el jugador correspondiente
// si hay 3 iguales en una fila,  gana el jugador correspondiente
// si hay 3 iguales en una diagonal, gana el jugador correspondiente
// si se completan las 9 casillas y nadie gana, entonces es empate

describe("Juego de TaTeTi", () => {    
    let juego = {
        jugadores: ['Juan', 'Pedro']
    }
    let movimientos = [
        { jugador: 'Juan', columna: 0, fila: 0 },
        { jugador: 'Pedro', columna: 1, fila: 0 },
        { jugador: 'Juan', columna: 1, fila: 0 },
        { jugador: 'Juan', columna: 0, fila: 2 },
        { jugador: 'Pedro', columna: 1, fila: 1 },
        { jugador: 'Juan', columna: 0, fila: 1 },

        { jugador: 'Juan', columna: 0, fila: 0 },
        { jugador: 'Pedro', columna: 0, fila: 1 },
        { jugador: 'Juan', columna: 1, fila: 0 },
        { jugador: 'Pedro', columna: 1, fila: 1 },
        { jugador: 'Juan', columna: 2, fila: 2 },
        { jugador: 'Pedro', columna: 2, fila: 1 },   

        { jugador: 'Juan', columna: 1, fila: 1 },
        { jugador: 'Pedro', columna: 1, fila: 2 },
    ]
    describe("Se empieza un juego nuevo", () => {
        it("Todos los casilleros estan vacios y le toca mover al primer jugador", (done) => {
            chai.request(server)
            .put("/empezar")
            .send(juego)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.to.be.json;
                res.body.should.be.a('object');
                // Le toca mover al primer jugador
                res.body.should.have.property('turno').eql('Juan');
                // Todos los casilleros estan vacios
                res.body.should.have.property('tablero').eql([
                    [' ', ' ', ' '],
                    [' ', ' ', ' '],
                    [' ', ' ', ' '],
                ]);
                done();
            })
        });
    });
    describe("El primer jugador hace su primer movimiento", () => {
        it("El casillero queda ocupado y le toca al otro jugador", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos[0])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('turno').eql('Pedro');
                    res.body.should.have.property('tablero').eql([
                        ['x', ' ', ' '],
                        [' ', ' ', ' '],
                        [' ', ' ', ' '],
                    ]);
                    done()
                })
        });
    });
    describe("El segundo jugador hace su primer movimiento", () => {
        it("El casillero queda ocupado y le toca al otro jugador", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server).put("/movimiento").send(movimientos[0]).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos[1])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('turno').eql('Juan');
                    res.body.should.have.property('tablero').eql([
                        ['x', 'o', ' '],
                        [' ', ' ', ' '],
                        [' ', ' ', ' '],
                    ]);
                    done()
                });
        });
    });
    describe("El segundo jugador hace un movimiento fuera de su turno", () => {
        it("El tablero no cambia y recibo el nombre del jugador al que le toca", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server).put("/movimiento").send(movimientos[0]).end();
            chai.request(server).put("/movimiento").send(movimientos[1]).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos[2])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('turno').eql('Juan');
                    res.body.should.have.property('tablero').eql([
                        ['x', 'o', ' '],
                        [' ', ' ', ' '],
                        [' ', ' ', ' '],
                    ]);
                    done()
                });
        });
    });
    describe("El primer jugador hace un movimiento en una casilla ocupada", () => {
        it("El tablero no cambia y recibo el nombre del jugador al que le toca", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server).put("/movimiento").send(movimientos[0]).end();
            chai.request(server).put("/movimiento").send(movimientos[1]).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos[2])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('turno').eql('Juan');
                    res.body.should.have.property('tablero').eql([
                        ['x', 'o', ' '],
                        [' ', ' ', ' '],
                        [' ', ' ', ' '],
                    ]);
                    done()
                });
        });
    });
    describe("Si hay 3 marcas iguales en una columna", () => {
        it("Finaliza el juego y se da por ganador al jugador", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server).put("/movimiento").send(movimientos[0]).end();
            chai.request(server).put("/movimiento").send(movimientos[1]).end();
            chai.request(server).put("/movimiento").send(movimientos[2]).end();
            chai.request(server).put("/movimiento").send(movimientos[3]).end();
            chai.request(server).put("/movimiento").send(movimientos[4]).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos[5])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('turno').eql('Finalizado');
                    res.body.should.have.property('ganador').eql('Juan');
                    res.body.should.have.property('tablero').eql([
                        ['x', 'o', ' '],
                        ['x', 'o', ' '],
                        ['x', ' ', ' '],
                    ]);
                    done()
                });
        });
    });
    describe("Si hay 3 marcas iguales en una fila", () => {
        it("Finaliza el juego y se da por ganador al jugador", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server).put("/movimiento").send(movimientos[6]).end();
            chai.request(server).put("/movimiento").send(movimientos[7]).end();
            chai.request(server).put("/movimiento").send(movimientos[8]).end();
            chai.request(server).put("/movimiento").send(movimientos[9]).end();
            chai.request(server).put("/movimiento").send(movimientos[10]).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos[11])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('turno').eql('Finalizado');
                    res.body.should.have.property('ganador').eql('Pedro');
                    res.body.should.have.property('tablero').eql([
                        ['x', 'x', ' '],
                        ['o', 'o', 'o'],
                        [' ', ' ', 'x'],
                    ]);
                    done()
                });
        });
    });
    describe("Si hay 3 marcas iguales en una diagonal", () => {
        it("Finaliza el juego y se da por ganador al jugador", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server).put("/movimiento").send(movimientos[6]).end();
            chai.request(server).put("/movimiento").send(movimientos[7]).end();
            chai.request(server).put("/movimiento").send(movimientos[12]).end();
            chai.request(server).put("/movimiento").send(movimientos[13]).end();
            chai.request(server).put("/movimiento").send(movimientos[10]).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos[11])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('turno').eql('Finalizado');
                    res.body.should.have.property('ganador').eql('Juan');
                    res.body.should.have.property('tablero').eql([
                        ['x', ' ', ' '],
                        ['o', 'x', 'o'],
                        [' ', 'o', 'x'],
                    ]);
                    done()
                });
        });
    });

});
