async function fun() {
  console.log("testing");
  let count = 0;
  for (let i = 0; i <= 10000000000; i++) {
    count += i;
  }
  console.log("after looop", count);
}

fun();
console.log("t");
console.log("end")
