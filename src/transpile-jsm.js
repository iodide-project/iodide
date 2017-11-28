// import * as ndarray from ndarray
import * as acorn from 'acorn'
import * as astring from "astring"

// (function(f) {window.acornES7 = f()})
// (function() {
//   return function(acorn) {
//     function getTokenType(p, loose) {
//       return loose ? p.tok.type : p.type;
//     }
    
//     var extendsAcorn = function (pp) {
//       var loose = pp == (acorn.LooseParser && acorn.LooseParser.prototype);
      
//       pp.readToken_dot = function() {
//         let next = this.input.charCodeAt(this.pos + 1)
//         if (next >= 48 && next <= 57) return this.readNumber(true)
//         switch(next){
//           case 43: // +
//             return this.finishOp(tt.broadcastPlus,2)
//           case 45: // -
//             return this.finishOp(tt.broadcastMinus,2)
//           case 42: // '*'
//             if (this.input.charCodeAt(this.pos + 2) === 42) { // '*'
//               return this.finishOp(tt.broadcastPow,3)
//             } else {
//             return this.finishOp(tt.broadcastMult,2)
//             }
//           case 47: // '/'
//             return this.finishOp(tt.broadcastDiv,2)
//           case 61: // =
//             if (this.input.charCodeAt(this.pos + 2) === 61) { // '='
//               return this.finishOp(tt.broadcastEq,3)
//             } else {
//             return this.finishOp(tt.broadcastAssign,2)
//             }
//           case 60: // <
//             if (this.input.charCodeAt(this.pos + 2) === 61) { // '='
//               return this.finishOp(tt.broadcastLte,3)
//             } else {
//             return this.finishOp(tt.broadcastLt,2)
//             }
//           case 62: // >
//             if (this.input.charCodeAt(this.pos + 2) === 61) { // '='
//               return this.finishOp(tt.broadcastGte,3)
//             } else {
//             return this.finishOp(tt.broadcastGt,2)
//             }
//           case 38: // &
//             return this.finishOp(tt.broadcastAnd,2)
//           case 124: // |
//             return this.finishOp(tt.broadcastOr,2)
//         }
//         let next2 = this.input.charCodeAt(this.pos + 2)
//         if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) { // 46 = dot '.'
//           this.pos += 3
//           return this.finishToken(tt.ellipsis)
//         } else {
//           ++this.pos
//           return this.finishToken(tt.dot)
//         }
//       }
      
//       pp.broadcastCodes = {}
//       // modify read number to ignore '.' in floats like "5." if the "." is followed by
//       // a broadcast operator char
//       pp.readNumber = function(startsWithDot) {
//         let start = this.pos
//         if (!startsWithDot && this.readInt(10) === null) this.raise(start, "Invalid number")
//         let octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48
//         if (octal && this.strict) this.raise(start, "Invalid number")
//         if (octal && /[89]/.test(this.input.slice(start, this.pos))) octal = false
//         let next = this.input.charCodeAt(this.pos)
//         if (next === 46 && !octal) { // '.'
//           let next1 = this.input.charCodeAt(this.pos+1)
//           if( ![42,45,47,124,38,60,62,61].includes(next1) ){
//             //43 +, 45 -, 42 *, 47 /, 124 |, 38 &, 60 <, 62 >, 61 =
//             //if it's not a broadcast operator, read it as a float
//             //in that case, immediately step pos forward and readInt from that pos
//             //that will continue to update this.pos until the end of the decimal is reached
//             ++this.pos
//             this.readInt(10)
//             next = next1
//           }
//         }
//         if ((next === 69 || next === 101) && !octal) { // 'eE'
//           next = this.input.charCodeAt(++this.pos)
//           if (next === 43 || next === 45) ++this.pos // '+-'
//           if (this.readInt(10) === null) this.raise(start, "Invalid number")
//         }
//         if (acorn.isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number")

//         let str = this.input.slice(start, this.pos)
//         let val = octal ? parseInt(str, 8) : parseFloat(str)
//         return this.finishToken(tt.num, val)
//       }
      
//       return function(instance) {
//         instance.extend('getTokenFromCode', function(inner) {
//           return function(code) {
//             console.log("code", code, String.fromCharCode(code))
//             let next = this.input.charCodeAt(this.pos + 1)
//             if (code == 64 && next==42) { //'@' && '*'
//               return this.finishOp(tt.matrixMult,2);
//               // ++this.pos; return this.finishToken(tt.at); 
//             }
//             return inner.call(this, code);
//           };
//         }); 
//       }
//     }
    
//     var tt = acorn.tokTypes;
//     function binop(name, prec) {
//       return new acorn.TokenType(name, {beforeExpr: true, binop: prec})
//     }
//     tt.at = new acorn.TokenType('@'); 
//     //precedences copied from non-broadcast tokentypes, tho this may need additional thought
//     tt.broadcastPlus = binop(".+", 9);
//     tt.broadcastMinus = binop(".-", 9);
//     tt.broadcastMult = binop(".*", 10);
//     tt.broadcastDiv = binop("./", 10);
//     tt.broadcastPow = binop(".**", 11);
//     tt.broadcastEq = binop(".==", 6);
//     tt.broadcastLt = binop(".<", 7);
//     tt.broadcastGt = binop(".>", 7);
//     tt.broadcastLte = binop(".<=", 7);
//     tt.broadcastGte = binop(".>=", 7);
//     tt.broadcastAnd = binop(".&", 2);
//     tt.broadcastOr = binop(".|", 1);
//     tt.broadcastAssign = new acorn.TokenType(".=", {beforeExpr: true, isAssign: true}),
    
//     tt.matrixMult = binop("@*", 10);  
    
//     // acorn 
//     acorn.plugins.es7 = extendsAcorn(acorn.Parser.prototype);
//     // acorn loose
//     if(acorn.LooseParser) acorn.pluginsLoose.es7 = extendsAcorn(acorn.LooseParser.prototype); 
//     return acorn;
//   }
// });
function extendAcorn(acorn) {
    function getTokenType(p, loose) {
      return loose ? p.tok.type : p.type;
    }
    
    var extendsAcorn = function (pp) {
      var loose = pp == (acorn.LooseParser && acorn.LooseParser.prototype);
      
      pp.readToken_dot = function() {
        let next = this.input.charCodeAt(this.pos + 1)
        if (next >= 48 && next <= 57) return this.readNumber(true)
        switch(next){
          case 43: // +
            return this.finishOp(tt.broadcastPlus,2)
          case 45: // -
            return this.finishOp(tt.broadcastMinus,2)
          case 42: // '*'
            if (this.input.charCodeAt(this.pos + 2) === 42) { // '*'
              return this.finishOp(tt.broadcastPow,3)
            } else {
            return this.finishOp(tt.broadcastMult,2)
            }
          case 47: // '/'
            return this.finishOp(tt.broadcastDiv,2)
          case 61: // =
            if (this.input.charCodeAt(this.pos + 2) === 61) { // '='
              return this.finishOp(tt.broadcastEq,3)
            } else {
            return this.finishOp(tt.broadcastAssign,2)
            }
          case 60: // <
            if (this.input.charCodeAt(this.pos + 2) === 61) { // '='
              return this.finishOp(tt.broadcastLte,3)
            } else {
            return this.finishOp(tt.broadcastLt,2)
            }
          case 62: // >
            if (this.input.charCodeAt(this.pos + 2) === 61) { // '='
              return this.finishOp(tt.broadcastGte,3)
            } else {
            return this.finishOp(tt.broadcastGt,2)
            }
          case 38: // &
            return this.finishOp(tt.broadcastAnd,2)
          case 124: // |
            return this.finishOp(tt.broadcastOr,2)
        }
        let next2 = this.input.charCodeAt(this.pos + 2)
        if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) { // 46 = dot '.'
          this.pos += 3
          return this.finishToken(tt.ellipsis)
        } else {
          ++this.pos
          return this.finishToken(tt.dot)
        }
      }
      
      pp.broadcastCodes = {}
      // modify read number to ignore '.' in floats like "5." if the "." is followed by
      // a broadcast operator char
      pp.readNumber = function(startsWithDot) {
        let start = this.pos
        if (!startsWithDot && this.readInt(10) === null) this.raise(start, "Invalid number")
        let octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48
        if (octal && this.strict) this.raise(start, "Invalid number")
        if (octal && /[89]/.test(this.input.slice(start, this.pos))) octal = false
        let next = this.input.charCodeAt(this.pos)
        if (next === 46 && !octal) { // '.'
          let next1 = this.input.charCodeAt(this.pos+1)
          if( ![42,45,47,124,38,60,62,61].includes(next1) ){
            //43 +, 45 -, 42 *, 47 /, 124 |, 38 &, 60 <, 62 >, 61 =
            //if it's not a broadcast operator, read it as a float
            //in that case, immediately step pos forward and readInt from that pos
            //that will continue to update this.pos until the end of the decimal is reached
            ++this.pos
            this.readInt(10)
            next = next1
          }
        }
        if ((next === 69 || next === 101) && !octal) { // 'eE'
          next = this.input.charCodeAt(++this.pos)
          if (next === 43 || next === 45) ++this.pos // '+-'
          if (this.readInt(10) === null) this.raise(start, "Invalid number")
        }
        if (acorn.isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number")

        let str = this.input.slice(start, this.pos)
        let val = octal ? parseInt(str, 8) : parseFloat(str)
        return this.finishToken(tt.num, val)
      }
      
      return function(instance) {
        instance.extend('getTokenFromCode', function(inner) {
          return function(code) {
            console.log("code", code, String.fromCharCode(code))
            let next = this.input.charCodeAt(this.pos + 1)
            if (code == 64 && next==42) { //'@' && '*'
              return this.finishOp(tt.matrixMult,2);
              // ++this.pos; return this.finishToken(tt.at); 
            }
            return inner.call(this, code);
          };
        }); 
      }
    }
    
    var tt = acorn.tokTypes;
    function binop(name, prec) {
      return new acorn.TokenType(name, {beforeExpr: true, binop: prec})
    }
    tt.at = new acorn.TokenType('@'); 
    //precedences copied from non-broadcast tokentypes, tho this may need additional thought
    tt.broadcastPlus = binop(".+", 9);
    tt.broadcastMinus = binop(".-", 9);
    tt.broadcastMult = binop(".*", 10);
    tt.broadcastDiv = binop("./", 10);
    tt.broadcastPow = binop(".**", 11);
    tt.broadcastEq = binop(".==", 6);
    tt.broadcastLt = binop(".<", 7);
    tt.broadcastGt = binop(".>", 7);
    tt.broadcastLte = binop(".<=", 7);
    tt.broadcastGte = binop(".>=", 7);
    tt.broadcastAnd = binop(".&", 2);
    tt.broadcastOr = binop(".|", 1);
    tt.broadcastAssign = new acorn.TokenType(".=", {beforeExpr: true, isAssign: true}),
    
    tt.matrixMult = binop("@*", 10);  
    
    // acorn 
    acorn.plugins.es7 = extendsAcorn(acorn.Parser.prototype);
    // acorn loose
    if(acorn.LooseParser) acorn.pluginsLoose.es7 = extendsAcorn(acorn.LooseParser.prototype); 
    return acorn;
  }

extendAcorn(acorn)

window.acornES7 = acorn
//https://github.com/jamen/estree-walk/blob/master/index.js

const blacklistedKeys = [
  'parent',
]

function walk(node, visitor) {
  var all = typeof visitor === 'function'
  var walking = true

  function stop () {
    walking = false
  }

  for (var queue = [node]; queue.length && walking;) {
    node = queue.shift()
    // Skip a missing node
    if (!node) continue
    // Execute visitor
    var handle = all ? visitor : visitor[node.type]
    if (handle) handle(node, stop)
    // Continue walking
    if (walking) step(node, queue)
  }
}

function step(node, queue) {
  var before = queue.length

  // Enumerate keys for possible children
  for (var key in node) {
    if (blacklistedKeys.indexOf(key) >= 0) continue

    var child = node[key]

    if (child && child.type) {
      queue.push(child)
    }

    if (Array.isArray(child)) {
      for (var i = 0; i < child.length; i++) {
        var item = child[i]
        if (item && item.type) {
          queue.push(item)
        }
      }
    }
  }
  // Return whether any children were pushed
  return queue.length !== before
}

var opToFuncMap = {
  ".+": "broadcastPlus",
  ".-": "broadcastMinus",
  ".*": "broadcastMult",
  "./": "broadcastDiv",
  ".**": "broadcastPow",
  ".==": "broadcastEq",
  ".<": "broadcastLt",
  ".>": "broadcastGt",
  ".<=": "broadcastLte",
  ".>=": "broadcastGte",
  ".&": "broadcastAnd",
  ".|": "broadcastOr",
  ".=": "broadcastAssign",
  "@*": "matrixMult",
}

var arrayLib = "nd"


function replaceOpsWithCalls(node){
  console.log("node",node.type)
  if (Object.keys(opToFuncMap).includes(node.operator)){
    node.type = "CallExpression"
    node.callee = {
      "type":"MemberExpression",
      "object":{"type":"Identifier","name":arrayLib},
      "property":{"type":"Identifier","name":opToFuncMap[node.operator]},
      "computed":false,
    }
    node.arguments = [node.left,node.right]
    delete node.left
    delete node.right
    delete node.operator
    console.log("node modified",node.type)
  }
}

var visitor = {BinaryExpression: replaceOpsWithCalls,
          AssignmentExpression: replaceOpsWithCalls}

var tjsm = {}

tjsm.transpile = function(code){
    console.log("code in :",code)
  let ast = acorn.parse(code,{
    // Specify use of the plugin
    plugins:{es7:true},
    // Specify the ecmaVersion
    ecmaVersion:7
  });
  walk(ast, visitor)
  return astring.generate(ast)
}

export default tjsm