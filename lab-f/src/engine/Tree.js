// from graphviz import Digraph

export class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

export class Tree {
  constructor() {
    this.root = null;
  }

  build_tree_from_postfix(postfix) {
    let stack = [];
    for (let symbol of postfix) {
      // print("symbol: ", symbol)
      if ("|*.+?".includes(symbol.toString())) {
        if (typeof symbol === "number") {
          symbol = symbol.toString();
        }
        let node = Node(symbol);
        stack.push(node);
      } else if (symbol === "|") {
        let node = Node(symbol);
        node.right = stack.pop();
        node.left = stack.pop();
        stack.push(node);
      } else if (symbol === "*") {
        let node = Node(symbol);
        node.left = stack.pop();
        stack.push(node);
      } else if (symbol === "+") {
        let node = Node(symbol);
        node.left = stack.pop();
        stack.push(node);
      } else if (symbol === "?") {
        let node = Node(symbol);
        node.left = stack.pop();
        stack.push(node);
      } else if (symbol === ".") {
        let node = Node(symbol);
        node.right = stack.pop();
        node.left = stack.pop();
        stack.push(node);
      }
    }
    this.root = stack.pop();
  }

  // Lectura Left Most
  left_most() {
    if (this.root === null) {
      return [];
    }
    let stack = [this.root];
    let result = [];
    while (stack.length > 0) {
      let node = stack.splice(0, 1);
      result.push(node.data);
      if (node.left !== null) {
        stack.splice(0, 0, node.left);
      }
      if (node.right !== null) {
        stack.splice(0, 0, node.right);
      }
    }
    return result.reverse();
  }
}
