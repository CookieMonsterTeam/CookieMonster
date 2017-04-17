function factorial(n) {
  if (n == 0) {
    return 1;
  }
  return n * factorial(n-1);
}

function binom(n, k) {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

function matrix(n, p) {
  var a = new Array(n);
  for (i = 0; i < n; i++) {
    var k = new Array(n);
    for (var j = 0; j < i; j++) {
      k[j] = -Math.pow(p, i - j) * Math.pow(1 - p, j) * binom(i, j)
    }
    if (i == 0) {
      k[i] = 1;
    } else {
      k[i] = 1 - Math.pow(1 - p, i);
    }
    for (var j = i + 1; j < n; j++) {
      k[j] = 0;
    }
    a[i] = k;
  }
  return a;
}
function identity(n){
	var a = new Array(n);
	for (var i=0;i<n;i++){
		a[i] = new Array(n);
		for(var j=0;j<n;j++){
			a[i][j] = (i==j?1:0);
		}
	}
	return a;
}

function expectation(maxFreeSlots, chance){
	maxFreeSlots = maxFreeSlots+1;
	var matr = matrix(maxFreeSlots, chance);
	var ident = identity(maxFreeSlots);
	for (var j = 0;j<maxFreeSlots;j++){
		for (var jk = j+1;jk<maxFreeSlots;jk++){
			var mul = matr[jk][j]/matr[j][j];
			for (var i=0;i<maxFreeSlots;i++){
				matr[jk][i] -= matr[j][i]*mul;
				ident[jk][i] -= ident[j][i]*mul;
			}
		}
	}
	/* We skip the last step of inversion since we can do it after matrix-vector multiplication
	for (var i = 0;i<maxFreeSlots;i++){
		for (var j = 0;j<maxFreeSlots;j++){
			ident[i][j] /= matr[i][i];
		}
	}*/
	var expected = new Array(maxFreeSlots);
	for (var i = 0;i<maxFreeSlots;i++){
		expected[i] = 0;
		for (var j = 1;j<maxFreeSlots;j++){
			expected[i] += ident[i][j];
		}
		expected[i] /= matr[i][i];
	}
	return expected;
}
