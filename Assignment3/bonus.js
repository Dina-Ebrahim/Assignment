var longestCommonPrefix = function (strs) {
  let first = strs[0];
  let ans = "";

  for (let j = 0; j < first.length; j++) {
    let f = first[j];

    for (let k = 1; k < strs.length; k++) {
      if (strs[k][j] !== f) {
        return ans;
      }
    }

    ans += f;
  }

  return ans;
};
