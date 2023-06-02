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
    let reader = YalReader(file);
    // CHECK HERE
    let [ye, token_functions] = reader.analize();

    for (let sublist of token_functions) {
      if (sublist[1].includes("return")) {
        sublist[1] = sublist[1].replace("return ", "");
      }
    }
    this.tokenFunctions = token_functions;
  }
  startConstruct() {}
  subsetConstruction() {}
  clousure() {}
  goto() {}
}
