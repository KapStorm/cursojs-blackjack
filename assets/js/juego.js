const modulo = (() => {
    'use strict'
    
    let deck         = [];
    const tipos      = ['C', 'D', 'H', 'S'],
          especiales = ['J', 'Q', 'K'];

          
    let puntosJugadores = [];

    // Referencias HTML
    const btnNuevoJuego = document.querySelector('#btnNuevoJuego'),     
          btnPedir      = document.querySelector('#btnPedir'),
          btnDetener    = document.querySelector('#btnDetener');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML         = document.querySelectorAll('small');

    // Funciones
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];

        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');
        
        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    const crearDeck = () => {
        deck = [];

        for(let i = 2; i <= 10; i++) {
            for(let tipo of tipos) {
                deck.push(`${i}${tipo}`)
            }
        }

        for(let tipo of tipos) {
            for(let especial of especiales) {
                deck.push(`${especial}${tipo}`)
            }
            deck.push(`A${tipo}`);
        }
        
        return _.shuffle(deck);
    }

    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        } 
        return deck.pop();
    }

    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ?
                (valor === 'A') ? 11 : 10
                    : parseInt(valor);
    }

    // Turno: 0 primer jugador, ultimo turno sera la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] += valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `./assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');

        divCartasJugadores[turno].append(imgCarta);
    }

    const determinarGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {
            if (puntosComputadora === puntosMinimos) {
                alert('Empate');
            } else if (puntosMinimos > 21) {
                alert('Perdiste');
            } else if (puntosComputadora > 21) {
                alert('Ganaste');
            } else if (puntosMinimos > puntosComputadora) {
                alert('Ganaste');
            } else {
                alert('Perdiste');
            }
        }, 50);
    }

    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        
        do {
            const carta = pedirCarta();

            puntosComputadora += acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);
        } while ((puntosComputadora < puntosMinimos));
       
        determinarGanador();
    }   

    // Eventos
    btnNuevoJuego.addEventListener('click', () => {
        inicializarJuego();
    });

    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;

            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;

        turnoComputadora([puntosJugadores[0]]);
    });

    return {
        nuevoJuego: inicializarJuego,
    };
})();