export class Simulation {
  constructor(afd, sfPoint, test) {
    this.afd = afd;
    this.start = sfPoint[0];
    this.end = sfPoint[1];
    this.tokens = sfPoint[2];
    this.test = test;
    this.result = [];
  }

  simulate() {
    let text = "";
    let position = this.start[0];

    for (let x of this.test) {
      for (let l of x) {
        let seguir = true;
        let notExist = true;
        let val = l.codePointAt(0);

        while (seguir) {
          for (let pos of this.afd) {
            if (pos[0] === position && pos[1] === val.toString()) {
              text += String.fromCharCode(val);
              position = pos[2];
              notExist = false;
              seguir = false;
              break;
            }
          }

          if (notExist) {
            if (position === this.start[0]) {
              this.result.push(["error lexico", l]);
              text = "";
              seguir = false;
            } else {
              let indice = this.end.indexOf(position);
              this.result.push([this.tokens[indice].replace("#", ""), text]);
              text = "";
              position = this.start[0];
            }
          }
        }
      }
    }

    if (text) {
      if (position === this.start[0]) {
        this.result.push(["error lexico", text]);
        text = "";
      } else {
        let indice = this.end.indexOf(position);
        this.result.push([this.tokens[indice].replace("#", ""), text]);
        text = "";
        position = this.start[0];
      }
    }

    return this.result;
  }
}
