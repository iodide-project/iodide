nd = function(A){
  if (Array.isArray(A) && Array.isArray(A[0])){
    return ndarray(new Float64Array(Array.concat(...A)), [A.length,A[0].length] )
  } else {return A}
}

nd.isNdarray = function(a){
  if (a.hasOwnProperty("data")
    && a.hasOwnProperty("shape")
    && a.hasOwnProperty("stride") ) {return true}
  else {return false}
}
nd.zeros = function(size){
  return ndarray(new Float64Array(size[0]*size[1]),size)
}
nd.ones = function(size){
  return ndarray(new Float64Array(size[0]*size[1]).fill(1),size)
}

nd.toList = function(A){
  if (!nd.isNdarray){return A}
  out = []
  o = A.offset  
  let [i,j] = A.stride
  // console.log(o,i,j,A.shape)
  for (let row=0; row<A.shape[0];row++){
    // console.log(o+row*i, o+row*(i+1) )
    out.push(Array.from(A.data.slice(o+row*i, o+(row+1)*i)))
  }
  return out
}

nd.broadcastPlus = function(x,y){
  if (_.isNumber(x) && _.isNumber(y)) {return x+y}
  else if (_.isNumber(x) && nd.isNdarray(y)) {
    arrOut = nd.zeros(y.shape)
    return ndops.adds(arrOut,y,x)
  } else if (_.isNumber(y) && nd.isNdarray(x)) {
    arrOut = nd.zeros(x.shape)
    return ndops.adds(arrOut,x,y)
  } else if (nd.isNdarray(y) && nd.isNdarray(x)) {
    arrOut = nd.zeros(x.shape)
    return ndops.add(arrOut,x,y)
  }
  else { throw("inputs must be scalars or ndarrays")}
}

nd.broadcastMinus = function(x,y){
  if (_.isNumber(x) && _.isNumber(y)) {return x-y}
  else if (_.isNumber(x) && nd.isNdarray(y)) {
    arrOut = nd.zeros(y.shape)
    arrOut = ndops.neg(arrOut,y)
    return ndops.addseq(arrOut,x)
  } else if (_.isNumber(y) && nd.isNdarray(x)) {
    arrOut = nd.zeros(x.shape)
    return ndops.subs(arrOut,x,y)
  } else if (nd.isNdarray(y) && nd.isNdarray(x)) {
    arrOut = nd.zeros(x.shape)
    return ndops.sub(arrOut,x,y)
  }
  else { throw("inputs must be scalars or ndarrays")}
}



nd.broadcastMult = function(x,y){
  if (_.isNumber(x) && _.isNumber(y)) {return x*y}
  else if (_.isNumber(x) && nd.isNdarray(y)) {
    arrOut = nd.zeros(y.shape)
    // arrOut = ndops.neg(arrOut,y)
    return ndops.muls(arrOut,y,x)
  } else if (_.isNumber(y) && nd.isNdarray(x)) {
    arrOut = nd.zeros(x.shape)
    return ndops.muls(arrOut,x,y)
  } else if (nd.isNdarray(y) && nd.isNdarray(x)) {
    arrOut = nd.zeros(x.shape)
    return ndops.mul(arrOut,x,y)
  }
  else { throw("inputs must be scalars or ndarrays")}
}


nd.broadcastDiv = function(x,y){
  if (_.isNumber(x) && _.isNumber(y)) {return x/y}
  else if (_.isNumber(x) && nd.isNdarray(y)) {
    arrOut = nd.zeros(y.shape)
    arrOut.data.fill(x)
    return ndops.diveq(arrOut,y)
  } else if (_.isNumber(y) && nd.isNdarray(x)) {
    arrOut = nd.zeros(x.shape)
    return ndops.divs(arrOut,x,y)
  } else if (nd.isNdarray(y) && nd.isNdarray(x)) {
    arrOut = nd.zeros(x.shape)
    return ndops.div(arrOut,x,y)
  }
  else { throw("inputs must be scalars or ndarrays")}
}


function mattransp(A, m, n) {
    var i, j, T;
    T = new Float64Array(m * n);

    for (i = 0; i < m; ++i) {
        for (j = 0; j < n; ++j) {
            T[j * m + i] = A[i * n + j];
        }
    }

    return T;
}


function matmul(A,B,m,l,n) {
    var C, i, j, k, total;
    C = new Float64Array(m*n);
    i = 0;
    j = 0;
    k = 0;
    B = mattransp(B,l,n);
    for (i = 0; i < m; i++) {
        for (j = 0; j < n; j++) {
            total = 0.0;
            for (k = 0; k < l; k++) {
                total += A[i*l+k]*B[j*l+k];
            }
            C[i*n+j] = total;
        }
    }
    return C;
}


nd.matrixMult = function(x,y){
  if (nd.isNdarray(x) && nd.isNdarray(y)) {
    if (x.shape[1]===y.shape[0]){
      arrOut = ndarray(matmul(x.data,y.data,x.shape[0],x.shape[1],y.shape[1]),
                       [x.shape[0],y.shape[1]])
      return arrOut
      // return matmul(x.data,y.data,x.shape[0],x.shape[1],y.shape[1])
    } else { throw("matrix shapes not compatible") }
  }
  else { throw("inputs must ndarrays") }
}
