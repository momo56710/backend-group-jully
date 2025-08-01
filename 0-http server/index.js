const fs = require("fs");
const readline = require("node:readline");
// const data = fs.readFileSync("script.txt", "utf8");
// console.log(data);
// fs.writeFileSync("script.txt", "hello world i have this text second time sdad");
// console.log("File written successfully");
// const data2 = fs.readFileSync("script.txt", "utf8");
// console.log(data2);
// console.log("finished");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const writeFile = async () => {
  try {
    // Promisify rl.question
    const question = (str) =>
      new Promise((resolve, reject) => rl.question(str, reject));

    const name = await question("write down your name :");
    const data = fs.readFileSync("script.txt", "utf8");
    fs.writeFileSync("script.txt", data + "\n" + name);
    console.log("File written successfully");
    const newData = fs.readFileSync("script.txt", "utf8");
    console.log("u have written this to the file :", newData);
    rl.close();
  } catch (err) {
    console.log(err);
  }
};

const timerPromise = new Promise((resolve) => {
  setTimeout(resolve("timer"), 5000);
});

const main = async () => {
  const writeFilePromise = writeFile();
  await writeFilePromise;
  const timer = await timerPromise;
  console.log(timer);
  console.log("finished");
};

main();
// for (i = 0; i < 100; i++) {
//   console.log(i);
// }
// for (i = 0; i < 100; i++) {
//   console.log(i);
// }
// for (i = 0; i < 100; i++) {
//   console.log(i);
// }
// for (i = 0; i < 100; i++) {
//   console.log(i);
// }
// for (i = 0; i < 100; i++) {
//   console.log(i);
// }
// for (i = 0; i < 100; i++) {
//   console.log(i);
// }
// console.log("finished");
