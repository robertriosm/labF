export class Postfix {
  constructor() {
    this.stack = [];
    this.output = [];
  }

  transform_postfix(c) {
    for (const l of c) {
      if ("|()*.+?".includes(l.toString())) {
        this.stack.push(l);
        let proceso = true;

        while (proceso) {
          let element = this.stack[this.stack.length - 1];
          if (element === ")") {
            let a = this.stack.length - 2;
            while (this.stack[a] !== "(") {
              this.output.push(this.stack[a]);
              this.stack[a] = "";
              a = a - 1;
            }
            this.stack[a] = "";
            this.stack[this.stack.indexOf(")")] = "";
            while (this.stack.includes("")) {
              let index = this.stack.indexOf("");
              if (index !== -1) {
                this.stack.splice(index, 1);
              }
            }
            proceso = false;
          } else if (element === "?") {
            if (this.stack.length > 1) {
              if (this.stack[this.stack.length - 2] === "*") {
                this.output.push(this.stack[this.stack.length - 1]);
                this.stack.pop();
              } else if (this.stack[this.stack.length - 2] === "+") {
                this.output.push(this.stack[this.stack.length - 1]);
                this.stack.pop();
              } else if (this.stack[this.stack.length - 2] === "?") {
                this.output.push(this.stack[this.stack.length - 1]);
                this.stack.pop();
              } else {
                proceso = false;
              }
            } else {
              proceso = false;
            }
          } else if (element === "*") {
            if (this.stack.length > 1) {
              if (this.stack[this.stack.length - 2] === "*") {
                this.output.push(this.stack[this.stack.length - 1]);
                this.stack.pop();
              } else if (this.stack[this.stack.length - 2] === "+") {
                this.output.push(this.stack[this.stack.length - 1]);
                this.stack.pop();
              } else if (this.stack[this.stack.length - 2] === "?") {
                this.output.push(this.stack[this.stack.length - 1]);
                this.stack.pop();
              } else {
                proceso = false;
              }
            } else {
              proceso = false;
            }
          } else if (element === "+") {
            if (this.stack.length > 1) {
              if (this.stack[this.stack.length - 2] === "+") {
                this.output.push(this.stack[this.stack.length - 1]);
                this.stack.pop();
              } else if (this.stack[this.stack.length - 2] === "*") {
                this.output.push(this.stack[this.stack.length - 1]);
                this.stack.pop();
              } else if (this.stack[this.stack.length - 2] === "?") {
                this.output.push(this.stack[this.stack.length - 1]);
                this.stack.pop();
              } else {
                proceso = false;
              }
            } else {
              proceso = false;
            }
          } else if (element === ".") {
            if (this.stack.length > 1) {
              if (this.stack[this.stack.length - 2] === "*") {
                this.output.push(this.stack[this.stack.length - 2]);
                this.stack.splice(this.stack.length - 2, 1);
              } else if (this.stack[this.stack.length - 2] === "+") {
                this.output.push(this.stack[this.stack.length - 2]);
                this.stack.splice(this.stack.length - 2, 1);
              } else if (this.stack[this.stack.length - 2] === "?") {
                this.output.push(this.stack[this.stack.length - 2]);
                this.stack.splice(this.stack.length - 2, 1);
              } else if (this.stack[this.stack.length - 2] === ".") {
                this.output.push(this.stack[this.stack.length - 1]);
                this.stack.splice(this.stack.length - 1, 1);
              } else {
                proceso = false;
              }
            } else {
              proceso = false;
            }
          } else if (element === "|") {
            if (this.stack.length > 1) {
              if (this.stack[this.stack.length - 2] === "*") {
                this.output.push(this.stack[this.stack.length - 2]);
                this.stack.pop(this.stack.length - 2);
              } else if (this.stack[this.stack.length - 2] === "+") {
                this.output.push(this.stack[this.stack.length - 2]);
                this.stack.pop(this.stack.length - 2);
              } else if (this.stack[this.stack.length - 2] === "?") {
                this.output.push(this.stack[this.stack.length - 2]);
                this.stack.pop(this.stack.length - 2);
              } else if (this.stack[this.stack.length - 2] === ".") {
                this.output.push(this.stack[this.stack.length - 2]);
                this.stack.pop(this.stack.length - 2);
              } else if (this.stack[this.stack.length - 2] === "|") {
                this.output.push(this.stack[this.stack.length - 1]);
                this.stack.pop(this.stack.length - 1);
              } else {
                proceso = false;
              }
            } else {
              proceso = false;
            }
          } else {
            proceso = false;
          }
        }
      } else {
        this.output.push(l);
      }
    }

    while (this.stack.length > 0) {
      this.output.push(this.stack[this.stack.length - 1]);
      this.stack.splice(this.stack.length - 1, 1);
    }
    return this.output;
  }
}
