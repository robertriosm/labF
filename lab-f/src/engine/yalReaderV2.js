class YalReader {
  constructor(file) {
    this.file = file;
  }

  analize() {
    // These will hold all the "let" statements
    let funciones = [];
    let filter_funciones = [];

    // These will hold the regex
    let regex = [];
    let filter_regex = [];

    // To hold the words and see what to do with them according to the function they have
    let token_regex = [];
    let token_functios = [];
    let word = "";

    // read the file
    let lines = this.file;

    let activeRule = false;

    // Separate if they are "let" or "rule"
    for (let l of lines) {
      if (activeRule) {
        if (l === "|") {
          if (regex[regex.length - 1] === "|") {
            word += l;
          } else {
            if (word !== "") {
              word = "";
            }
            regex.push(l.trim());
          }
        } else {
          if (l !== "\n" && l !== "\t") {
            word += l;
            if (word.includes("{") && word.includes("}")) {
              word = word.trim();
              regex.push(word);
              word = "";
            }
            if (word.includes("(*") && word.includes("*)")) {
              word = "";
            }
          } else if (l === "\n") {
            if (word) {
              if (!word.includes("{")) {
                word = word.trim();
                if (word !== "") {
                  regex.push(word);
                }
              }
              word += " ";
            }
          }
        }
      } else {
        word += l;

        if (word.includes("\n")) {
          if (word.length > 0) {
            if (word.includes("let")) {
              word = word.trim();
              word = word.substring(3).trim();
              funciones.push(word);
            }
            if (word.includes("rule")) {
              activeRule = true;
            }
            word = "";
          }
        }
      }
    }

    regex = regex.filter(Boolean); // filter out falsy values

    for (let x = 0; x < regex.length; x++) {
      let temporary_array = [];
      let temporary_word = "";
      let token_active = false;

      for (let l of regex[x]) {
        if (token_active) {
          if (l === "}") {
            temporary_word = temporary_word
              .replace(/'/g, "")
              .replace(/"/g, "")
              .trim();
            temporary_array.push(temporary_word);
            token_regex.push(temporary_array[0]);
            token_regex.push("|");
            temporary_word = "";
            token_functios.push(temporary_array);
            break;
          }
          temporary_word += l;
        } else {
          temporary_word += l;
          if (l === "{") {
            temporary_word = temporary_word
              .slice(0, -1)
              .replace(/'/g, "")
              .replace(/"/g, "")
              .trim();
            temporary_array.push(temporary_word);
            temporary_word = "";
            token_active = true;
          }
        }
      }

      if (
        temporary_word &&
        !temporary_word.includes("|") &&
        temporary_word.length > 0
      ) {
        temporary_word = temporary_word.trim();
        temporary_array.push(temporary_word);
        temporary_array.push("");
        token_regex.push(temporary_array[0]);
        token_regex.push("|");
        token_functios.push(temporary_array);
      }
    }

    token_regex.pop();

    for (let x = 0; x < regex.length; x++) {
      let temporary_word = "";
      for (let l of regex[x]) {
        temporary_word += l;
        if (temporary_word.includes("{")) {
          temporary_word = temporary_word.slice(0, -1).trim();
          break;
        }
        if (temporary_word.includes("(*")) {
          if (temporary_word[0] === "(") {
            temporary_word = temporary_word.slice(0, -2).trim();
            break;
          }
        }
      }

      if (
        (temporary_word.match(/'/g) || []).length === 2 ||
        (temporary_word.match(/"/g) || []).length === 2
      ) {
        temporary_word = temporary_word.substring(1, temporary_word.length - 1);
      }

      regex[x] = temporary_word;
    }

    for (let x of regex) {
      if (x.length !== 0) {
        if ((x.match(/"/g) || []).length === 2) {
          x = x.substring(1, x.length - 1);
        }
        filter_regex.push(x);
      }
    }

    for (let f of funciones) {
      let deletable_array = [];
      let temporal_array = [];
      let [nombre, definicion] = f.split("=");
      nombre = nombre.trim();
      definicion = definicion.trim();
      temporal_array.push(nombre);
      let word = "";

      if (definicion[0] === "[") {
        definicion = definicion.slice(1, -1);

        for (let x of definicion) {
          word += x;

          if (word[0] === '"' || word[0] === "'") {
            if ((word.match(/'/g) || []).length === 2) {
              word = word.slice(1, -1);

              if (word.length === 2) {
                if (word === "\\s") {
                  word = " ";
                } else {
                  word = word;
                }
                deletable_array.push(word.charCodeAt(0));
              } else {
                if (word === " ") {
                  word = " ";
                  deletable_array.push(word.charCodeAt(0));
                } else {
                  deletable_array.push(word.charCodeAt(0));
                }
              }
              word = "";
            }

            if ((word.match(/"/g) || []).length === 2) {
              word = word.slice(1, -1);
              let temporary_word = "";

              if (word.includes(String.fromCharCode(92))) {
                for (let y of word) {
                  temporary_word += y;

                  if (
                    (
                      temporary_word.match(
                        new RegExp(String.fromCharCode(92), "g")
                      ) || []
                    ).length === 2
                  ) {
                    let temp_word =
                      temporary_word.slice(0, -1) === "\\s"
                        ? " "
                        : temporary_word.slice(0, -1);
                    word = temp_word;
                    deletable_array.push(word.charCodeAt(0));
                    temporary_word = temporary_word.slice(2);
                  }
                }

                if (temporary_word.length !== 0) {
                  let temp_word =
                    temporary_word === "\\s" ? " " : temporary_word;
                  word = temp_word;
                  deletable_array.push(word.charCodeAt(0));
                }
              } else {
                word = [...word];

                for (let w = 0; w < word.length; w++) {
                  word[w] = word[w].charCodeAt(0);
                }
                deletable_array.push(...word);
              }
            }
          } else {
            deletable_array.push(word);
            word = "";
          }
        }
      } else {
        let tokens = [];
        let token_actual = "";

        for (let caracter of definicion) {
          if (token_actual.includes("]")) {
            let palabra = "";
            let array = [];
            array.push("(");

            token_actual = token_actual.slice(1, -1);

            for (let tok of token_actual) {
              palabra += tok;

              if ((palabra.match(/'/g) || []).length === 2) {
                palabra = palabra.charCodeAt(1);
                array.push(palabra);
                array.push("|");
                palabra = "";
              }
            }

            array[array.length - 1] = ")";
            tokens.push(...array);
            token_actual = "";
          }

          if ((token_actual.match(/'/g) || []).length === 2) {
            if (!token_actual.includes("[")) {
              token_actual = token_actual.charCodeAt(1);
              tokens.push(token_actual);
              token_actual = "";
            }
          }

          if ("()*.?+|.".includes(caracter)) {
            if (!token_actual.includes("'")) {
              if (token_actual) {
                if (token_actual.length === 1) {
                  token_actual = token_actual.charCodeAt(0);
                }
                tokens.push(token_actual);
                token_actual = "";
              }
              if (caracter === ".") {
                caracter = caracter.charCodeAt(0);
              }
              tokens.push(caracter);
            } else {
              token_actual += caracter.trim();
            }
          } else {
            token_actual += caracter.trim();
          }
        }
        if (token_actual) {
          tokens.push(token_actual);
        }

        deletable_array.push(...tokens);
      }

      temporal_array.push(deletable_array);

      filter_funciones.push(temporal_array);
    }

    for (let x = 0; x < filter_funciones.length; x++) {
      let isFunc = true;

      for (let c of ["+", "*", "(", ")", "?", "|"]) {
        if (filter_funciones[x][1].includes(c)) {
          isFunc = false;
        }
      }

      if (!isFunc) {
        let temporal_array = [];
        for (let y of filter_funciones[x][1]) {
          temporal_array.push(y);
          temporal_array.push(".");
        }

        for (let z = 0; z < temporal_array.length; z++) {
          if (temporal_array[z] === "(" && temporal_array[z + 1] === ".") {
            temporal_array[z + 1] = "";
          }
          if (temporal_array[z] === ")" && temporal_array[z - 1] === ".") {
            temporal_array[z - 1] = "";
          }
          if (temporal_array[z] === "*" && temporal_array[z - 1] === ".") {
            temporal_array[z - 1] = "";
          }
          if (temporal_array[z] === "|" && temporal_array[z - 1] === ".") {
            temporal_array[z - 1] = "";
          }
          if (temporal_array[z] === "+" && temporal_array[z - 1] === ".") {
            temporal_array[z - 1] = "";
          }
          if (temporal_array[z] === "?" && temporal_array[z - 1] === ".") {
            temporal_array[z - 1] = "";
          }
        }
        temporal_array = temporal_array.filter((element) => element !== "");
        filter_funciones[x][1] = temporal_array.slice(0, -1);
      } else {
        let ascii_array = [];
        let newString_Array = [];

        if (filter_funciones[x][1].includes("-")) {
          for (let z = 0; z < filter_funciones[x][1].length; z++) {
            if (filter_funciones[x][1][z] === "-") {
              for (
                let i = filter_funciones[x][1][z - 1];
                i <= filter_funciones[x][1][z + 1];
                i++
              ) {
                ascii_array.push(i);
              }
            }
          }

          for (let i of ascii_array) {
            newString_Array.push(i);
          }

          filter_funciones[x][1] = newString_Array;
        }

        newString_Array = [];
        for (let y of filter_funciones[x][1]) {
          newString_Array.push(y);
          newString_Array.push("|");
        }

        newString_Array = newString_Array.slice(0, -1);
        filter_funciones[x][1] = newString_Array;
      }
    }

    for (let func of filter_funciones) {
      func[1].unshift("(");
      func[1].push(")");
    }

    let functionNames = [];

    for (let x of filter_funciones) {
      functionNames.push(x[0]);
    }
    functionNames.push("|");

    for (let x = 0; x < filter_regex.length; x++) {
      if (!functionNames.includes(filter_regex[x])) {
        if (filter_regex[x].length === 1) {
          filter_regex[x] = filter_regex[x].charCodeAt(0);
        }
      }
      if (filter_regex[x] === "|" && filter_regex[x - 1] === "|") {
        filter_regex[x] = filter_regex[x].charCodeAt(0);
      }
    }

    let temporalNewRegex = [];

    for (let x = 0; x < filter_regex.length; x++) {
      if (filter_regex[x] !== "|") {
        temporalNewRegex.push("(");
        temporalNewRegex.push(filter_regex[x]);
        temporalNewRegex.push(".");
        temporalNewRegex.push("#" + token_regex[x]);
        temporalNewRegex.push(")");
      } else {
        temporalNewRegex.push(filter_regex[x]);
      }
    }

    filter_regex = temporalNewRegex;

    let final_regex = [];

    for (let rege of filter_regex) {
      let existe = false;

      for (let func of filter_funciones) {
        if (rege === func[0]) {
          existe = true;

          let regex_temporal = [];
          regex_temporal.push(...func[1]);

          let largo = 0;
          while (largo !== regex_temporal.length) {
            largo = regex_temporal.length;
            let i = 0;
            let regex_evaluacion = [];

            while (i < regex_temporal.length) {
              let existe2 = false;
              for (let x of filter_funciones) {
                if (regex_temporal[i] === x[0]) {
                  existe2 = true;
                  regex_evaluacion.push(...x[1]);
                  regex_evaluacion.push(...regex_temporal.slice(i + 1));
                  regex_temporal = regex_evaluacion;
                  i = regex_temporal.length;
                  regex_evaluacion = [];
                  break;
                }
              }

              if (!existe2) {
                regex_evaluacion.push(regex_temporal[i]);
                i++;
              }
            }
            final_regex.push(...regex_temporal);
          }
        }
      }

      if (!existe) {
        if (typeof rege === "string") {
          if (rege.length > 1 && !rege.includes("#")) {
            let temporal = ["("];

            for (let i of rege) {
              temporal.push(i.charCodeAt(0));
              temporal.push(".");
            }

            temporal.splice(temporal.length - 1, 1, ")");
            final_regex.push(...temporal);
          } else {
            final_regex.push(rege);
          }
        } else {
          final_regex.push(rege);
        }
      }
    }

    return { final_regex, token_functios };
  }
}
