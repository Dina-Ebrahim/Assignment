const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const { pipeline } = require("node:stream");
const { EventEmitter } = require("node:events");
const event = new EventEmitter();
const readStream = fs.createReadStream("./big.txt", "utf-8");
const readStreams = fs.createReadStream("./source.txt", "utf-8");
const writeStreamdd = fs.createWriteStream("./dest.txt", "utf-8");
const { createGzip } = require("node:zlib");

const read = fs.createReadStream("./data.txt");
const zib = createGzip();
const write = fs.createWriteStream("./data.txt.gz");
const file_Path = "./index.js";
//1
function logCurrentFile() {
  console.log({
    file: __filename,
    dir: __dirname,
  });
}
logCurrentFile();

//2
function nameFile(fpath) {
  return path.basename(fpath);
}
console.log(nameFile("/user/files/report.pdf"));

//3
function builds(fpath) {
  console.log(path.format(fpath));
}
builds({
  dir: "/folder",
  name: "app",
  ext: ".js",
});

//4
function fExe(fpath) {
  return path.extname(fpath);
}
console.log(fExe("/home/app/main.js"));

//5
function Parse(fpath) {
  const { name, ext } = path.parse(fpath);
  return { Name: name, Ext: ext };
}
console.log(Parse("/home/app/main.js"));

//6
function absolute(fpath) {
  console.log(path.isAbsolute(fpath));
}
absolute("/home/user/file.txt");

//7
function joinPath(dir, folder, file) {
  return path.join(dir, folder, file);
}
console.log(joinPath("src", "components", "App.js"));

//8
function resolve(fpath) {
  console.log(path.resolve(fpath));
}
resolve("./index.js");

//9
function joins(p1, p2) {
  console.log(path.join(p1, p2));
}
joins("/folder1", "folder2/file.txt");

//10

function Delete(fpath) {
  fs.unlink(fpath, (err) => {
    if (err) {
      console.log("File not exist");
      return;
    }
    console.log(`the file ${path.basename(fpath)} is deleted`);
  });
}
Delete("./file.txt");

//11

function create(folderPath) {
  try {
    fs.mkdirSync(folderPath);
    console.log("Success");
  } catch (err) {
    console.log(err.message);
  }
}
create("./folder");

//12
event.on("start", (data) => {
  console.log(data);
});
event.emit("start", "Welcome event triggered!");

//13
event.on("login", (username) => {
  console.log(`user logged in: ${username}`);
});
event.emit("login", "Dina");

//14
try {
  const read = fs.readFileSync("./notes.txt", "utf-8");
  console.log(`the file content => ${read}`);
} catch (err) {
  console.log(err.message);
}

//15
fs.writeFile("./async.txt", "Async save", (err) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log("File saved successfully");
});

//16
console.log(fs.existsSync("./notes.txt"));

//17
function getSystemInfo() {
  return {
    Platform: os.platform(),
    Arch: os.arch(),
  };
}
console.log(getSystemInfo());

//18
readStream.on("data", (chunk) => {
  console.log(chunk);
});

//19
readStreams.pipe(writeStreamdd);

//20
pipeline(read, zib, write, (err) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log("File compressed successfully");
});

//***************************************************************************************************************************** */

//Q(2)
//1
const port = 3000;
const http = require("node:http");
const httpServer = http.createServer((req, res) => {
  const { url, method } = req;
  if (url == "/user" && method == "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      data = JSON.parse(data);
      const { username, email, password } = data;
      fs.readFile("./users.json", "utf-8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "fail" }));
          res.end();
          return;
        }
        data = JSON.parse(data);
        const match = data.find((ele) => ele.email === email);
        if (match) {
          res.writeHead(409, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "Email Exist" }));
          res.end();
          return;
        }
        data.push({
          id: Date.now(),
          email,
          username,
          password,
        });
        fs.writeFile(
          path.resolve("./users.json"),
          JSON.stringify(data),
          (error) => {
            if (error) {
              res.writeHead(500, {
                "Content-Type": "application/json",
              });
              res.write(JSON.stringify({ message: "Fail" }));

              res.end();
              return;
            }
            res.writeHead(201, {
              "Content-Type": "application/json",
            });
            res.write(
              JSON.stringify({
                message: "Done",
              }),
            );

            res.end();
          },
        );
      });
    });
  }

  //2
  const arr = url.split("/");
  if (method === "PATCH" && arr[1] === "user" && arr[2]) {
    const id = Number(arr[arr.length - 1]);
    fs.readFile("./users.json", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "fail" }));
        res.end();
        return;
      }
      data = JSON.parse(data);
      const match2 = data.find((idd) => idd.id === id);
      if (!match2) {
        res.writeHead(404, {
          "Content-Type": "application/json",
        });
        res.write(JSON.stringify({ message: "user not found" }));
        res.end();
        return;
      }
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        body = JSON.parse(body);
        if (body.username !== undefined) {
          match2.username = body.username;
        }
        if (body.age !== undefined) {
          match2.age = body.age;
        }
        if (body.email !== undefined) {
          match2.email = body.email;
        }
        fs.writeFile(
          path.resolve("./users.json"),
          JSON.stringify(data),
          (error) => {
            if (error) {
              res.writeHead(500, {
                "Content-Type": "application/json",
              });
              res.write(JSON.stringify({ message: "Fail" }));

              res.end();
              return;
            }
            res.writeHead(200, {
              "Content-Type": "application/json",
            });
            res.write(
              JSON.stringify({
                message: "Done",
              }),
            );

            res.end();
          },
        );
      });
    });
  }

  //3

  if (method === "DELETE" && arr[1] === "user" && arr[2]) {
    const id = Number(arr[2]);
    fs.readFile("./users.json", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "fail" }));
        res.end();
        return;
      }
      data = JSON.parse(data);
      const match2 = data.find((idd) => idd.id === id);
      if (!match2) {
        res.writeHead(404, {
          "Content-Type": "application/json",
        });
        res.write(JSON.stringify({ message: "user not found" }));
        res.end();
        return;
      }
      data = data.filter((idd) => idd.id != id);
      fs.writeFile(
        path.resolve("./users.json"),
        JSON.stringify(data),
        (error) => {
          if (error) {
            res.writeHead(500, {
              "Content-Type": "application/json",
            });
            res.write(JSON.stringify({ message: "Fail" }));

            res.end();
            return;
          }
          res.writeHead(200, {
            "Content-Type": "application/json",
          });
          res.write(
            JSON.stringify({
              message: "User deleted successfully",
            }),
          );

          res.end();
        },
      );
    });
  }

  //4
  if (method === "GET" && url === "/user") {
    fs.readFile("./users.json", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "fail" }));
        res.end();
        return;
      }

      data = JSON.parse(data);
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.write(JSON.stringify(data));
      res.end();
    });
  }

  //5
  if (method === "GET" && arr[1] === "user" && arr[2]) {
    const id = Number(arr[2]);

    fs.readFile("./users.json", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "fail" }));
        res.end();
        return;
      }

      data = JSON.parse(data);

      const match = data.find((user) => user.id === id);

      if (!match) {
        res.writeHead(404, {
          "Content-Type": "application/json",
        });
        res.write(JSON.stringify({ message: "user not found" }));
        res.end();
        return;
      }

      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      res.write(JSON.stringify(match));
      res.end();
    });
  }
});
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
//Postman Collection:
// https://ebrahimd375-4267788.postman.co/workspace/Dina-Ebrahim's-Workspace~cc2a78ac-31ff-4c03-8bc6-6c20069f6df4/collection/57065343-168f8073-28ce-412c-b0f8-d597031d647e?action=share&source=copy-link&creator=57065343
