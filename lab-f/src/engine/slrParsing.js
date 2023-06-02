export class SLRPARSING {
  constructor(transitions, conjuntos, numbers, reglas) {
    this.transitions = transitions;
    this.conjuntos = conjuntos;
    this.reglas = reglas;
    this.Noterminales = [];

    this.state = numbers;
    this.first = [];
    this.action_filas = [];
    this.action = [];
    this.goto_filas = [];
    this.goto = [];

    for (let x of this.reglas) {
      if (!this.Noterminales.includes(x[0])) {
        this.Noterminales.push(x[0]);
      }
    }
  }

  constructTable() {
    // primero divirlos por sus secciones correspondietes
    for (let x of this.transitions) {
      if (x[1] === x[1].toUpperCase()) {
        if (!this.goto_filas.includes(x[1])) {
          this.goto_filas.push(x[1]);
        }
      } else {
        if (!this.action_filas.includes(x[1])) {
          this.action_filas.push(x[1]);
        }
      }
    }
    this.action_filas.sort((a, b) => b - a);
    let first = this.reglas[0][1][0];

    // primero llenar el goto
    for (let x of this.state) {
      for (let y of this.goto_filas) {
        for (let z of this.transitions) {
          if (z[0] === x && z[1] === y) {
            this.goto.push([x, y, z[2]]);
          }
        }
      }
    }
    // comenzar la armada de action pero los shift
    for (let x of this.state) {
      for (let y of this.action_filas) {
        for (let z of this.transitions) {
          if (z[0] === x && z[1] === y) {
            if (y === "$") {
              this.action.push([x, y, "acc"]);
            } else {
              this.action.push([x, y, "s" + z[2].toString()]);
            }
          }
        }
      }
    }
    // obtener los primeros o FIRST
    for (let x of this.reglas) {
      let largo = 0;
      let visitados = [];
      let inicial = x[0];
      visitados.push(inicial);

      while (largo !== visitados.length) {
        largo = visitados.length;
        for (let y of visitados) {
          for (let z of this.reglas) {
            if (y === z[0]) {
              if (!visitados.includes(z[1][0])) {
                visitados.push(z[1][0]);
              }
            }
          }
        }
      }
      // agarrar los terminales
      let agregar = [];
      for (let y of visitados) {
        if (this.action_filas.includes(y)) {
          agregar.push(y);
        }
      }
      if (!this.first.includes([inicial, agregar])) {
        this.first.push([inicial, agregar]);
      }
    }

    // TODO CHECK THIS.FIRST AND FIRST

    // armar la action pero con el de follow/replace
    for (let x = 0; x < this.conjuntos.length; x++) {
      // ubicacion, seria el primer parametro para el [x, ... ,...]
      for (let y of this.conjuntos[x]) {
        if (y[1][y[1].length - 1] === ".") {
          let indice = y[1].indexOf(".");
          if (y[1][indice - 1] !== first) {
            let trans_copy = y;
            let ind = y.indexOf(".");
            if (ind !== -1) {
              trans_copy[1].splice(ind, 1);
            }
            for (let z = 0; z < this.reglas.length; z++) {
              if (this.reglas[z] === trans_copy) {
                let transaction = this.follow(trans_copy[0], first); // transaction sera el parametro [x,w,z]
                for (let w of transaction) {
                  this.action.push([x, w, "r" + z.toString()]);
                }
              }
              // enviar y obtener el follow del parametro
            }
          }
        }
      }
    }
  }

  follow(state, accept_state) {
    accept_state += "'";
    let revisar = [];
    revisar.push(state);
    let largo = 0;
    let transactions = [];

    // primero encontrar en si este forma parte de alguno otro
    while (largo !== revisar.length) {
      largo = revisar.length;
      for (let y of revisar) {
        for (let x of this.reglas) {
          if (x[1].includes(y)) {
            let indiceNoterminal = x[1].indexOf(y);
            // revisar si es terminal
            if (indiceNoterminal === x[1].length - 1) {
              if (!revisar.includes(x[0])) {
                revisar.push(x[0]);
              }

              // revisar si no es terminal y la siguiente de el es no terminal tambien
            } else {
              // agregar el first del siguiente
              if (indiceNoterminal + 1 < x[1].length) {
                if (this.Noterminales.includes(x[1][indiceNoterminal + 1])) {
                  for (let z of this.first) {
                    if (z[0] === x[1][indiceNoterminal + 1]) {
                      for (let w of z[1]) {
                        if (!transactions.includes(w)) {
                          transactions.push(w);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    for (let x of revisar) {
      for (let y of this.reglas) {
        if (y[1].includes(x)) {
          let indice = y[1].indexOf(x);
          if (
            indice + 1 < y[1].length &&
            !this.Noterminales.includes(y[1][indice + 1])
          ) {
            if (!transactions.includes(y[1][indice + 1])) {
              transactions.push(y[1][indice + 1]);
            }
          }
        }
      }
    }

    // revisar si tiene el estado de aceptacion y en este caso agregar el $
    if (revisar.includes(accept_state)) {
      transactions.push("$");
    }

    return transactions;
  }
}
