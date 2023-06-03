import { YalReader } from "./yalReader";

export class YalpReader {
  constructor(simulation, file) {
    this.number = 0;
    this.simulation = simulation;
    this.tokenCopy = [];
    this.tokens = [];
    this.productions = []; //en este se guardara la producion principal para que se pueda utlizar en el closure
    this.productions_copy = [];
    this.conjuntos = []; //en este se guardaran todos los posible conjuntos que se pueden llegar a armar
    this.conjuntos_number = []; // en este se guardaran el numero que pertenecen cada conjunto
    this.ciclo = []; //tendra lo de conjuntos pero sirve para utilizarlo en el ciclo para encontrar nuevos y sus transiciones respectivas
    this.transiciones = []; //en este tendra la transicion correspondiente de cada conjunto
    // nombre del archivo que se abrira
    let reader = new YalReader(file);
    let result = reader.analize();
    let token_functions = result[1];

    for (let sublist of token_functions) {
      if (sublist[1].includes("return")) {
        sublist[1] = sublist[1].replace("return ", "");
      }
    }
    this.tokenFunctions = token_functions;
  }

  startConstruct() {
    let divided = false;
    let comment = false;
    let token = false;
    let temporal = [];
    let expresion = true;
    let functionName = "";

    for (let x of this.simulation) {
      if (x[0] === "/*") {
        comment = true;
      }

      if (!comment) {
        if (x[0] === "%%") {
          divided = true;
        }

        // Reading the productions
        if (divided) {
          if (expresion) {
            if (x[0] === "minusword") {
              functionName = x[1][0].toUpperCase();
              expresion = false;
            }
          } else {
            if (x[0] === "minusword") {
              temporal.push(x[1][0].toUpperCase());
            }
            if (x[0] === "mayusword") {
              temporal.push(x[1]);
            }
            if (x[0] === "|") {
              this.productions.push([functionName, temporal]);
              temporal = [];
            }
            if (x[0] === ";") {
              if (temporal.length > 0) {
                this.productions.push([functionName, temporal]);
                temporal = [];
              }
              expresion = true;
            }
          }

          // Reading the tokens
        } else {
          if (x[0] === "%token") {
            token = true;
          }
          if (x[0] === "IGNORE") {
            token = false;
          }

          if (token) {
            if (x[0] === "mayusword") {
              this.tokens.push(x[1]);
              this.tokenCopy.push(x[1]);
            }
          } else {
            if (x[0] === "mayusword") {
              const index = this.tokens.indexOf(x[1]);
              if (index > -1) {
                this.tokens.splice(index, 1);
                this.tokenCopy.splice(index, 1);
              }
            }
          }
        }

        if (x[0] === "*/") {
          comment = false;
        }
      }

      // Change the tokens with their respective shape
      for (let x = 0; x < this.tokens.length; x++) {
        for (let y of this.tokenFunctions) {
          if (this.tokens[x] === y[1]) {
            this.tokens[x] = y[0];
            break;
          }
        }
      }

      // Change the productions their tokens or final states by their respective shape
      for (let x of this.productions) {
        for (let y = 0; y < x[1].length; y++) {
          for (let z of this.tokenCopy) {
            if (x[1][y] === z) {
              const index = this.tokenCopy.indexOf(z);
              x[1][y] = this.tokens[index];
            }
          }
        }
      }
    }
  }

  subsetConstruction() {
    // create the initial
    let value = this.productions[0][0];
    this.productions.unshift([value + "'", [value]]);
    this.productions_copy = JSON.parse(JSON.stringify(this.productions));

    // add '.' for all at the beginning for work
    for (let x of this.productions) {
      x[1].unshift(".");
    }

    // initial construct
    this.clousure([this.productions[0]]);

    // continue while there are data
    while (this.ciclo.length > 0) {
      this.goto(this.ciclo.shift());
    }

    // once finished also add the acceptance transition
    let initial_state = this.productions[0][0]; // state that must search for accept
    for (let x of this.conjuntos) {
      for (let y of x) {
        let accept_index = y[1].indexOf(".");
        if (accept_index - 1 >= 0) {
          if (
            y[0] === initial_state &&
            y[1][accept_index - 1] === initial_state.slice(0, -1)
          ) {
            let final_index = this.conjuntos.indexOf(x);
            this.transiciones.push([
              this.conjuntos_number[final_index],
              "$",
              "accept",
            ]);
          }
        }
      }
    }
  }

  clousure(item, elem = null, cicle = null) {
    let closure_Array = [...item];

    // start searching
    let length = 0;
    while (length !== closure_Array.length) {
      length = closure_Array.length;

      for (let x of closure_Array) {
        let index = x[1].indexOf(".");
        if (index + 1 < x[1].length) {
          index += 1;
          let val = x[1][index];

          // search for all those that start with the val
          for (let y of this.productions) {
            if (y[0] === val && !closure_Array.includes(y)) {
              closure_Array.push(y);
            }
          }
        }
      }
    }

    let sorted_items = closure_Array.sort((a, b) => (a[0] > b[0] ? 1 : -1));

    if (!this.conjuntos.includes(sorted_items)) {
      this.conjuntos.push(sorted_items);
      this.conjuntos_number.push(this.number);
      this.number += 1;
      this.ciclo.push(sorted_items);
    }

    // add transitions if elem and cycle are not empty
    if (elem !== null && cicle !== null) {
      let start_index = this.conjuntos.indexOf(cicle);
      let end_index = this.conjuntos.indexOf(sorted_items);
      this.transiciones.push([
        this.conjuntos_number[start_index],
        elem,
        this.conjuntos_number[end_index],
      ]);
    }
  }

  goto(ciclo) {
    // obtain the tokens or elements to test
    let elements = [];
    for (let x of ciclo) {
      let index = x[1].indexOf(".");
      if (index + 1 < x[1].length) {
        if (!elements.includes(x[1][index + 1])) {
          elements.push(x[1][index + 1]);
        }
      }
    }

    // find all that are .elements and from these move the . one position
    for (let x of elements) {
      let temporal = [];
      for (let y of ciclo) {
        let index = y[1].indexOf(".");
        if (index + 1 < y[1].length) {
          if (y[1][index + 1] === x) {
            temporal.push({ ...y });
          }
        }
      }

      // move the . one position to the right
      for (let z of temporal) {
        let index = z[1].indexOf(".");
        if (index + 1 < z[1].length) {
          let a = z[1][index];
          let b = z[1][index + 1];
          z[1][index] = b;
          z[1][index + 1] = a;
        }
      }

      // send it to the closure
      this.clousure(temporal, x, ciclo);
    }
  }
}
