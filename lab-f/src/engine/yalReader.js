export class YalReader {
  constructor(file) {
    this.file = file; // es una lista de filas del file
  }

  analize() {
    //aqui se guardaran todos los let
    let funciones = [];
    let filter_funciones = [];
    //aqui se guardaran los regex
    let regex = [];
    let filter_regex = [];
    //para guardar las palabras y ver que se hara con ello segun la funcion que tengan
    let token_regex = [];
    let token_functios = [];
    let word = "";
    // leer el archivo
    let lines = this.file;

    let activeRule = false;

    // separarlos por si son let o rule
    for (let l of lines) {
      if (activeRule) {
        if (l === "|") {
          if (regex[regex.length - 1] === "|") {
            word += l;
            continue;
            // ojo aqui
          } else {
            if (word !== "") {
              word = "";
            }
            regex.push(l.trim());
          }
        } else {
          if (!["\n", "\t"].includes(l)) {
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
            }
            word += " ";
          }
        }
      } else {
        word += l;

        if (word.includes("\n")) {
          if (word.length > 0) {
            if (word.includes("let")) {
              word = word.trim();
              word = word.slice(3, word.length).trim();
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

    regex = regex.filter((str) => str !== "");

    // obtener los tokens

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
            temporary_word = ""; //    /""/g
            token_functios.push(temporary_array);
            break;
          }
          temporary_word += l;
        } else {
          temporary_word += l;
        }
        if (l === "{") {
          temporary_word = temporary_word
            .slice(0, temporary_word.length - 1)
            .replace(/'/g, "")
            .replace(/"/g, "")
            .trim();
          temporary_array.push(temporary_word);
          temporary_word = "";
          token_active = true;
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
          temporary_word = temporary_word
            .slice(0, temporary_word.length - 1)
            .trim();
          break;
        }
        if (temporary_word.includes("(*")) {
          if (temporary_word[0] === "(") {
            temporary_word = temporary_word
              .slice(0, temporary_word.length - 2)
              .trim();
            break;
          }
        }
      }
      if (
        count(temporary_word, "'") === 2 ||
        count(temporary_word, '"') === 2
      ) {
        temporary_word = temporary_word.slice(1, temporary_word.length - 1);
        // break
      }
      regex[x] = temporary_word;
    }

    for (let x of regex) {
      if (x.length !== 0) {
        if (count(x, '"') === 2) {
          x = x.slice(1, x.length - 1);
        }
        filter_regex.push(x);
      }
    }

    for (const f of funciones) {
            deletable_array = []
            temporal_array = []
            nombre, definicion = f.split("=")
            nombre = nombre.trim()
            definicion = definicion.trim()
            temporal_array.push(nombre)
            word= ""
            // realizar revision para a definicion
            if definicion[0] == "[":
                definicion = definicion.slice(1, definicion.length - 1)
                for x in definicion:
                    word+=x
                    if word[0] == '"' or word[0] == "'":
                        if word.count("'") == 2:
                            word = word.slice(1, word.length - 1)
                            // estos son los que tienen \
                            if len(word) == 2:
                                if word == "\s":
                                    word = bytes(' ', 'utf-8').decode('unicode_escape')
                                else:
                                    word = bytes(word, 'utf-8').decode('unicode_escape')
                                deletable_array.push(ord(word))
                            // esto son los que no tienen \
                            else:
                                if word == " ":
                                    word = bytes(' ', 'utf-8').decode('unicode_escape')
                                    deletable_array.push(ord(word))
                                else:
                                    deletable_array.push(ord(word))
                            word = ""
                        if word.count('"') == 2:
                            //  si tiene \ o no tiene dependiendo de este se trabajara conforme a ello
                            word = word.slice(1, word.length - 1)
                            temporary_word = ""
                            // si tiene \ en word
                            if chr(92) in word:
                                for y in word:
                                    temporary_word+=y
                                    if temporary_word.count(chr(92)) == 2:
                                        if temporary_word[:-1] == "\s":
                                            temp_word = ' '
                                        else:
                                            temp_word = temporary_word[:-1]
                                        word = bytes(temp_word, 'utf-8').decode('unicode_escape')
                                        deletable_array.push(ord(word))
                                        temporary_word = temporary_word[2:]
                                if len(temporary_word) != 0:
                                    if temporary_word == "\s":
                                        temp_word = ' '
                                    else:
                                        temp_word = temporary_word
                                    word = bytes(temp_word, 'utf-8').decode('unicode_escape')
                                    deletable_array.push(ord(word))
                            else:
                                word = list(word)
                                for w in range(len(word)):
                                    word[w] = ord(word[w])
                                deletable_array.extend(word)
                                
                    else:
                        deletable_array.push(word)
                        word = ""
                
            else:
                tokens = []
                token_actual = ""
                
                for caracter in definicion:
                    if "]" in token_actual:
                        palabra = ""
                        array = []
                        array.push("(")
                        
                        token_actual = token_actual.slice(1, token_actual.length - 1)
                        for tok in token_actual:
                            palabra += tok
                            if palabra.count("'") == 2:
                                palabra = ord(palabra.slice(1, palabra.length - 1))
                                array.push(palabra)
                                array.push("|")
                                palabra = ""
                        array[len(array)-1] = ")"
                        tokens.extend(array)
                        token_actual = ""
                    
                    if token_actual.count("'") == 2:
                        if "[" not in token_actual: 
                            token_actual = ord(token_actual.slice(1, token_actual.length - 1))
                            tokens.push(token_actual)
                            token_actual = ""
                    
                    if caracter in ("(", ")", "*", "?", "+", "|","."):
                        if "'" not in token_actual:
                            if token_actual:
                                if len(token_actual) == 1:
                                    token_actual = ord(token_actual)
                                tokens.push(token_actual)
                                token_actual = ""
                            if caracter == ".":
                                caracter = ord(caracter)
                            tokens.push(caracter)
                        else:
                            token_actual += caracter.trim()
                    else:
                        token_actual += caracter.trim()
                if token_actual:
                    tokens.push(token_actual)
                
                deletable_array.extend(tokens)
                
            temporal_array.push(deletable_array)
            
            // agregar temporal array a funciones
            filter_funciones.push(temporal_array)
    }

  }
}

function count(str, substr) {
  const regex = new RegExp(substr, "g");
  const matches = str.match(regex);
  return matches ? matches.length : 0;
}
