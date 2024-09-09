const arr = ['a', 'b', 'c', 'd']

// console.log(arr);
// console.log([...arr]);
const a = arr
const b = [...arr]

arr[3] = 'e'
console.log(a) // abce
console.log(b) // abce
