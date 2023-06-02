// import { Graphviz } from "graphviz-react";

export class DirectDFA {
  constructor(postfix) {
    this.postfix = postfix;
    // print("this.postfix: ",this.postfix)
    // agregar el # de ultimo para la cadena
    this.postfix.push("#");
    this.postfix.push(".");
    // Nueva lista vacía que se utiliza para ordenar correspondientemente cuando se obtienen los valores
    this.nueva_lista = [];

    this.deletable_firstPos = [];
    this.deletable_lastPos = [];
    this.deletable_nullable = [];

    this.newPostfix = [];
    this.nullable = [];
    this.firstPos = [];
    this.lastPos = [];
    this.followPos = [];
    this.q = [];
    this.enumerate();
    this.startConstruct();
    this.follopostConstruct();
  }

  enumerate() {
    for (let i = 1; i < 1000; i++) {
      let value = i;
      this.q.push(value);
    }

    // si los valores son distintos a *|.?+ darles un valor numerico
    for (const x of this.postfix) {
      if (!["*", "|", ".", "?", "+", "ε"].includes(x)) {
        this.newPostfix.push(this.q.shift());
      } else {
        this.newPostfix.push(x);
      }
    }
  }

  startConstruct() {
    for (const node of this.newPostfix) {
      if (!["*", "|", ".", "?", "+", "ε"].includes(node.toString())) {
        if (node === "*") {
        } else if (node === "*") {
          this.nullable.push(true);
          this.firstPos.push(
            this.deletable_firstPos[this.deletable_firstPos.length - 1]
          );
          this.lastPos.push(
            this.deletable_lastPos[this.deletable_lastPos.length - 1]
          );

          this.deletable_nullable.push(true);
          this.deletable_firstPos.push(
            this.deletable_firstPos[this.deletable_firstPos.length - 1]
          );
          this.deletable_lastPos.push(
            this.deletable_lastPos[this.deletable_lastPos.length - 1]
          );

          // eliminar uno de cada uno
          this.deletable_nullable.splice(this.deletable_nullable.length - 2, 1);
          this.deletable_firstPos.splice(this.deletable_firstPos.length - 2, 1);
          this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
        } else if (node === "|") {
          // revisar si es nullable
          let c1 = this.deletable_nullable[this.deletable_nullable.length - 2];
          let c2 = this.deletable_nullable[this.deletable_nullable.length - 1];

          if (c1 === true || c2 === true) {
            this.nullable.push(true);
            this.deletable_nullable.push(true);
          } else {
            this.nullable.push(false);
            this.deletable_nullable.push(false);
          }

          // eliminar las dos primeras del nullable
          this.deletable_nullable.splice(this.deletable_nullable.length - 2, 1);
          this.deletable_nullable.splice(this.deletable_nullable.length - 2, 1);

          // agregar el firstpos
          let first = [];
          first = first.concat(
            this.deletable_firstPos[this.deletable_firstPos.length - 2]
          );
          first = first.concat(
            this.deletable_firstPos[this.deletable_firstPos.length - 1]
          );
          first.sort((a, b) => a - b);
          this.firstPos.push(first);
          this.deletable_firstPos.push(first);

          // eliminar las dos primeras firstpos
          this.deletable_firstPos.splice(this.deletable_firstPos.length - 2, 1);
          this.deletable_firstPos.splice(this.deletable_firstPos.length - 2, 1);

          // agregar el lastpos
          let last = [];
          last = last.concat(
            this.deletable_lastPos[this.deletable_lastPos.length - 2]
          );
          last = last.concat(
            this.deletable_lastPos[this.deletable_lastPos.length - 1]
          );
          last.sort((a, b) => a - b);
          this.lastPos.push(last);
          this.deletable_lastPos.push(last);

          // eliminar las primeras dos lastpos
          this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
          this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
        } else if (node === ".") {
          // revisar si es nullable
          let c1 = this.deletable_nullable[this.deletable_nullable.length - 2];
          let c2 = this.deletable_nullable[this.deletable_nullable.length - 1];

          if (c1 === true && c2 === true) {
            this.nullable.push(true);
            this.deletable_nullable.push(true);
          } else {
            this.nullable.push(false);
            this.deletable_nullable.push(false);
          }

          // eliminar los dos c1 y c2
          this.deletable_nullable.splice(this.deletable_nullable.length - 2, 1);
          this.deletable_nullable.splice(this.deletable_nullable.length - 2, 1);

          // agregar el firstpos
          if (c1 === true) {
            let first = [];
            first = first.concat(
              this.deletable_firstPos[this.deletable_firstPos.length - 2]
            );
            first = first.concat(
              this.deletable_firstPos[this.deletable_firstPos.length - 1]
            );
            first.sort((a, b) => a - b);
            this.firstPos.push(first);
            this.deletable_firstPos.push(first);
            //eliminar las dos primeras first
            this.deletable_firstPos.splice(
              this.deletable_firstPos.length - 2,
              1
            );
            this.deletable_firstPos.splice(
              this.deletable_firstPos.length - 2,
              1
            );
          } else {
            let first = [];
            first = first.concat(
              this.deletable_firstPos[this.deletable_firstPos.length - 2]
            );
            this.firstPos.push(first);
            this.deletable_firstPos.push(first);
            // eliminar las dos primeras first
            this.deletable_firstPos.splice(
              this.deletable_firstPos.length - 2,
              1
            );
            this.deletable_firstPos.splice(
              this.deletable_firstPos.length - 2,
              1
            );
          }
          // agregar el lastpos
          if (c2 === true) {
            let last = [];
            last = last.concat(
              this.deletable_lastPos[this.deletable_lastPos.length - 2]
            );
            last = last.concat(
              this.deletable_lastPos[this.deletable_lastPos.length - 1]
            );
            last.sort((a, b) => a - b);
            this.lastPos.push(last);
            this.deletable_lastPos.push(last);
            // eliminar las dos primeras last
            this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
            this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
          } else {
            let last = [];
            last = last.concat(
              this.deletable_lastPos[this.deletable_lastPos.length - 1]
            );
            this.lastPos.push(last);
            this.deletable_lastPos.push(last);
            //eliminar las dos primeras last
            this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
            this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
          }
        } else if (node === "?") {
          this.nullable.push(true);
          this.firstPos.push(
            this.deletable_firstPos[this.deletable_firstPos.length - 1]
          );
          this.lastPos.push(
            this.deletable_lastPos[this.deletable_lastPos.length - 1]
          );

          this.deletable_nullable.push(true);
          this.deletable_firstPos.push(
            this.deletable_firstPos[this.deletable_firstPos.length - 1]
          );
          this.deletable_lastPos.push(
            this.deletable_lastPos[this.deletable_lastPos.length - 1]
          );

          // eliminar cada uno
          this.deletable_nullable.splice(this.deletable_nullable.length - 2, 1);
          this.deletable_firstPos.splice(this.deletable_firstPos.length - 2, 1);
          this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
        } else if (node === "+") {
          // revisar si es nullabel
          let c1 = this.deletable_nullable[this.deletable_nullable.length - 1];

          if (c1 === true) {
            this.nullable.push(true);
            this.deletable_nullable.push(true);
          } else {
            this.nullable.push(false);
            this.deletable_nullable.push(false);
          }

          // eliminar el del nullabel
          this.deletable_nullable.splice(this.deletable_nullable.length - 2, 1);

          // insertar el firstpos y lastpos
          this.firstPos.push(
            this.deletable_firstPos[this.deletable_firstPos.length - 1]
          );
          this.lastPos.push(
            this.deletable_lastPos[this.deletable_lastPos.length - 1]
          );

          this.deletable_firstPos.push(
            this.deletable_firstPos[this.deletable_firstPos.length - 1]
          );
          this.deletable_lastPos.push(
            this.deletable_lastPos[this.deletable_lastPos.length - 1]
          );

          // eliminar uno de fist y las
          this.deletable_firstPos.splice(this.deletable_firstPos.length - 2, 1);
          this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
        } else if (node === "ε") {
          this.nullable.push(true);
          this.firstPos.push([]);
          this.lastPos.push([]);

          this.deletable_nullable.push(true);
          this.deletable_firstPos.push([]);
          this.deletable_lastPos.push([]);
        }
      } else {
        this.nullable.push(false);
        this.firstPos.push([node]);
        this.lastPos.push([node]);

        this.deletable_nullable.push(false);
        this.deletable_firstPos.push([node]);
        this.deletable_lastPos.push([node]);
      }
    }
  }

  follopostConstruct() {
    this.deletable_firstPos = [];
    this.deletable_lastPos = [];

    // guardar todos los valores para el followpost
    for (let val = 0; val < this.newPostfix.length; val++) {
      if (
        !["*", "|", ".", "?", "+"].includes(this.newPostfix[val].toString())
      ) {
        this.followPos.push([this.newPostfix[val]]);
      }
    }

    for (let val = 0; val < this.newPostfix.length; val++) {
      let isnodes = [];
      let addnodes = [];

      if (this.newPostfix[val] === "*") {
        isnodes = isnodes.concat(
          this.deletable_lastPos[this.deletable_lastPos.length - 1]
        );
        addnodes = addnodes.concat(
          this.deletable_firstPos[this.deletable_firstPos.length - 1]
        );

        for (let nod = 0; nod < this.followPos.length; nod++) {
          if (this.followPos[nod][0].includes(isnodes)) {
            if (this.followPos[nod].length > 1) {
              for (let x of addnodes) {
                if (!this.followPos[nod][1].includes(x)) {
                  this.followPos[nod][1].push(x);
                }
              }
              this.followPos[nod][1].sort((a, b) => a - b);
            } else {
              this.followPos[nod].push(addnodes);
            }
          }
        }

        this.deletable_firstPos.push(this.firstPos[val]);
        this.deletable_lastPos.push(this.lastPos[val]);

        this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
        this.deletable_firstPos.splice(this.deletable_firstPos.length - 2, 1);
      } else if (this.newPostfix[val] === "+") {
        isnodes = isnodes.concat(
          this.deletable_lastPos[this.deletable_lastPos.length - 1]
        );
        addnodes = addnodes.concat(
          this.deletable_firstPos[this.deletable_firstPos.length - 1]
        );

        for (let nod = 0; nod < this.followPos.length; nod++) {
          if (isnodes.includes(this.followPos[nod][0])) {
            if (this.followPos[nod].length > 1) {
              for (let x of addnodes) {
                if (!this.followPos[nod][1].includes(x)) {
                  this.followPos[nod][1].push(x);
                }
              }
              this.followPos[nod][1].sort((a, b) => a - b);
            } else {
              this.followPos[nod].push(addnodes);
            }
          }
        }

        this.deletable_firstPos.push(this.firstPos[val]);
        this.deletable_lastPos.push(this.lastPos[val]);

        this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
        this.deletable_firstPos.splice(this.deletable_firstPos.length - 2, 1);
      } else if (this.newPostfix[val] === ".") {
        let c1 = this.deletable_lastPos[this.deletable_lastPos.length - 2];
        let c2 = this.deletable_firstPos[this.deletable_firstPos.length - 1];
        isnodes = isnodes.concat(c1);
        addnodes = addnodes.concat(c2);

        for (let nod = 0; nod < this.followPos.length; nod++) {
          if (isnodes.includes(this.followPos[nod][0])) {
            if (this.followPos[nod].length > 1) {
              for (let x of addnodes) {
                if (!this.followPos[nod][1].includes(x)) {
                  this.followPos[nod][1].push(x);
                }
              }
              this.followPos[nod][1].sort((a, b) => a - b);
            } else {
              this.followPos[nod].push(addnodes);
            }
          }
        }

        this.deletable_firstPos.push(this.firstPos[val]);
        this.deletable_lastPos.push(this.lastPos[val]);

        this.deletable_firstPos.splice(this.deletable_firstPos.length - 2, 1);
        this.deletable_firstPos.splice(this.deletable_firstPos.length - 2, 1);

        this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
        this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
      } else if (this.newPostfix[val] === "|") {
        this.deletable_firstPos.push(this.firstPos[val]);
        this.deletable_lastPos.push(this.lastPos[val]);

        this.deletable_firstPos.splice(this.deletable_firstPos.length - 2, 1);
        this.deletable_firstPos.splice(this.deletable_firstPos.length - 2, 1);

        this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
        this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
      } else if (this.newPostfix[val] === "?") {
        this.deletable_firstPos.push(this.firstPos[val]);
        this.deletable_lastPos.push(this.lastPos[val]);

        this.deletable_firstPos.splice(this.deletable_firstPos.length - 2, 1);
        this.deletable_lastPos.splice(this.deletable_lastPos.length - 2, 1);
      } else if (this.newPostfix[val].includes("#")) {
        console.log(this.newPostfix[val]);
      } else {
        this.deletable_firstPos.push(this.firstPos[val]);
        this.deletable_lastPos.push(this.lastPos[val]);
      }
    }

    //agregar el ultimo un signo ∅ ya que es el #
    this.followPos[this.followPos.length - 1].push(["∅"]);

    //revisar de cada uno de los followpos construidos y revisar si entre ellos tiene #
    for (let lar = 0; lar < this.followPos.length; lar++) {
      for (let value = 0; value < this.newPostfix.length; value++) {
        if (this.followPos[lar][0] === this.newPostfix[value]) {
          if (this.postfix[value].includes("#")) {
            this.followPos[lar][1] = ["∅"];
          }
        }
      }
    }
  }

  Dstate() {
    let sNode = this.firstPos[this.firstPos.length - 1];

    //nodo final
    let final = [];
    for (let x of this.followPos) {
      if (x[1].includes("∅")) {
        final.push(x[0]);
      }
    }

    //aqui tendra todos los nodos de los cuales viajara
    let P0 = [];
    P0.push(sNode);

    //obtener las variables que utiliza
    this.variables = [];
    for (let x of this.postfix) {
      if (!"|.*+?".includes(x)) {
        if (!x.includes("#")) {
          if (!this.variables.includes(x)) {
            this.variables.push(x);
          }
        }
      }
    }

    let tabla = [];
    for (let x of P0) {
      // [1,2,3]
      let conjuntos = [];
      conjuntos.push(x);
      for (let alfa of this.variables) {
        // a, b
        let movement = [];
        movement.push(alfa);
        let con = [];
        for (let y of x) {
          // 1,2,3
          for (let l = 0; l < this.postfix.length; l++) {
            if (this.newPostfix[l] === y && this.postfix[l] === alfa) {
              for (let w of this.followPos) {
                if (w[0] === y) {
                  for (let z of w[1]) {
                    if (!con.includes(z)) {
                      con.push(z);
                    }
                  }
                }
              }
            }
          }
        }
        con.sort((a, b) => a - b);
        if (!P0.includes(con) && con.length !== 0) {
          P0.push(con);
        }
        if (con.length !== 0) {
          movement.push(con);
          conjuntos.push(movement);
        }
        if (!tabla.includes(conjuntos)) {
          tabla.push(conjuntos);
        }
      }
    }

    for (let sub_array of tabla) {
      if (sub_array.length > 1) {
        for (let i = 1; i < sub_array.length; i++) {
          let new_element = [sub_array[0], sub_array[i][0], sub_array[i][1]];
          this.nueva_lista.push(new_element);
        }
      } else {
        this.nueva_lista.push(sub_array);
      }
    }
    // Impresión de la nueva lista convertir la nueva lista en A,B,C ...
    let q = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    //obtener todos los nodos
    let node = [];
    let alfanode = [];
    for (let x of this.nueva_lista) {
      if (!node.includes(x[0])) {
        node.push(x[0]);
        alfanode.push(q.splice(0, 1)[0]);
      }
    }
    //comenzar a reemplazarlo por alfabetos
    for (let x of this.nueva_lista) {
      if (x.length > 1) {
        for (let y = 0; y < node.length; y++) {
          if (x[0] === node[y]) {
            x[0] = alfanode[y];
          }
          if (x[2] === node[y]) {
            x[2] = alfanode[y];
          }
        }
      } else {
        for (let y = 0; y < node.length; y++) {
          if (x[0] === node[y]) {
            x[0] = "vacio";
          }
        }
      }
    }

    //this.nueva_lista = [sublista for sublista in this.nueva_lista if 'vacio' not in sublista]
    let temp_nueva_list = [];
    for (const sublista of this.nueva_lista) {
      if (!sublista.includes("vacio")) {
        temp_nueva_list.push(sublista);
      }
    }
    this.nueva_lista = temp_nueva_list;

    let start = [];
    let end = [];
    let endHash = [];
    // obtener los nuevos iniciales y finales

    for (let ele = 0; ele < node.length; ele++) {
      if (node[ele] === sNode) {
        start = start.concat(alfanode[ele]);
      }

      for (let f of final) {
        if (node[ele].includes(f)) {
          end = end.concat(alfanode[ele]);
          for (let val = 0; val < this.newPostfix.length; val++) {
            if (f === this.newPostfix[val]) {
              endHash.append(this.postfix[val]);
            }
          }
        }
      }
    }
    //en caso que solo es un nodo
    if (node.length === 1) {
      end = end.concat(alfanode[0]);
    }

    //se guardan los nuevos iniciales y finales correspondientes

    let sfPoint = [];
    sfPoint.push(start);
    sfPoint.push(end);
    sfPoint.push(endHash);

    return [this.nueva_lista, sfPoint];
  }

  DirectGraph(directAFD, sfPoint) {
    //let inicio = sfPoint[0];
    //let final = sfPoint[1];
    let q_list = [];
    let q = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    // guardar los valores de q utilizados
    for (let l of directAFD) {
      for (let q_search of q) {
        if (q_search === l[0]) {
          if (!q_list.includes(q_search)) {
            q_list.push(q_search);
          }
        }
        if (q_search === l[2]) {
          if (!q_list.includes(q_search)) {
            q_list.push(q_search);
          }
        }
      }
    }
    // let f = Graphviz(comment = "afd Directo")
    // inicio_listo = True

    // for name in q_list:
    //     if name in final:
    //         f.node(str(name), shape="doublecircle",fillcolor="#ee3b3b",style="filled")
    //     elif name in inicio:
    //         f.node(str(name),fillcolor="#7fff00",style="filled")
    //     else:
    //         f.node(str(name))
    // f.node("", shape="plaintext")
    // for l in directAFD:
    //     for val in inicio:
    //         if val in l and l[0] == val:
    //             if(inicio_listo):
    //                 f.edge("",str(l[0]),label = "")
    //                 inicio_listo = False
    //     if len(l) > 1:
    //         if type(l[1]) == int:
    //             print("l[1]: ",l[1])
    //             l[1] = chr(l[1])
    //         f.edge(str(l[0]),str(l[2]),label = str(l[1]))
    //     else:
    //         f.node(str(l[0]))
    // f.render("afd Directo", view = True)
  }
}
