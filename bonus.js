var findKthPositive = function (arr, k) {
  let missing = [];
  let previous = 0;
  for (let i = 0; i < arr.length; i++) {
    let current = arr[i];
    for (let j = previous + 1; j < current; j++) {
      missing.push(j);
    }
    previous = current;
  }
  if (missing.length == 0) {
    return arr[arr.length - 1] + k;
  } else if (missing.length < k) {
    return arr[arr.length - 1] + (k - missing.length);
  } else {
    return missing[k - 1];
  }
};
console.log(findKthPositive([5, 6, 7, 8, 9], 9));
