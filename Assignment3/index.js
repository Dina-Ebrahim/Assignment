const express = require("express");
const app = express();
const fs = require("fs");
const port = 3000;

app.use(express.json());
//Node Internals
//1 --The Event Loop is a mechanism in Node.js that allows it to handle asynchronous operations without blocking the main thread.
// It checks if there are completed callbacks and moves them to the Call Stack to be executed.

//2 --Libuv is a library used by Node.js to handle asynchronous and non-blocking operations. It manages tasks
//such as file system operations, networking, and the Thread Pool, then sends the completed results back to Node.js.

//3 --When Node.js starts an asynchronous operation, it sends it to Libuv. Libuv handles the operation, using the operating system or the Thread Pool when needed.
// When it finishes, the callback is placed in a queue, and the Event Loop eventually executes it.

//4 --Call Stack: Executes the JavaScript code currently running
//Event Queue: Stores callbacks that are ready to be executed.
//Event Loop: Checks whether the Call Stack is empty and moves callbacks from the queue to the Callstack

// 5-- the Thread Pool is a group of threads used by Libuv to handle some operations that could block the main thread,
//  such as file system operations.

/* 6--Blocking code stops the main thread until the operation finishes, so other requests have to wait.
//Non-blocking code starts the operation and allows Node.js to continue executing other code. When the operation finishes, its callback is handled by the Event Loop.
fs.readFile() // Non-blocking
fs.readFileSync() // Blocking
*/
/********************************************************************************************************************* */
//1
app.post("/User", (req, res, next) => {
  const { name, email, age } = req.body;
  fs.readFile("./users.json", "utf-8", (err, data) => {
    if (err) {
      return res.json({ message: "Error reading file" });
    }
    const users = JSON.parse(data);
    const match = users.find((user) => user.email === email);
    if (match) {
      return res.json({ message: "User already exists" });
    }
    const id = Date.now();
    users.push({ email, age, name, id });
    const updatedData = JSON.stringify(users);
    fs.writeFile("./users.json", updatedData, (err) => {
      if (err) {
        return res.json({ message: "Error writing file" });
      }
      res.json({
        message: "User added successfully",
        user: { name, age, email, id },
      });
    });
  });
});

//2
app.patch("/Users/:id", (req, res, next) => {
  const { name, age, email } = req.body;
  const { id } = req.params;
  fs.readFile("./users.json", "utf-8", (err, data) => {
    if (err) {
      return res.json({ message: "Error reading file" });
    }
    const users = JSON.parse(data);
    const match = users.find((user) => user.id === Number(id));
    if (!match) {
      return res.status(404).json({ message: "User not found" });
    }
    if (name !== undefined) {
      match.name = name;
    }
    if (age !== undefined) {
      match.age = age;
    }
    if (email !== undefined) {
      match.email = email;
    }
    const updatedData = JSON.stringify(users);
    fs.writeFile("./users.json", updatedData, (err) => {
      if (err) {
        return res.json({ message: "Error writing file" });
      }
      res.json({
        message: "User updated successfully",
        user: match,
      });
    });
  });
});

//3
app.delete("/Users{/:id}", (req, res, next) => {
  const { id } = req.params;
  fs.readFile("./users.json", "utf-8", (err, data) => {
    if (err) {
      return res.json({ message: "Error reading file" });
    }
    const users = JSON.parse(data);
    const match2 = users.find((idd) => idd.id === Number(id));
    if (!match2) {
      return res.json({ message: "user not found" });
    }
    const updatedUsers = users.filter((idd) => idd.id != Number(id));
    fs.writeFile("./users.json", JSON.stringify(updatedUsers), (error) => {
      if (error) {
        return res.json({ message: "Error writing file" });
      }
      res.json({
        message: "User delete successfully",
        user: match2,
      });
    });
  });
});

//4
app.get("/Users/getByName", (req, res, next) => {
  const { name } = req.query;
  fs.readFile("./users.json", "utf-8", (err, data) => {
    if (err) {
      return res.json({ message: "Error reading file" });
    }
    const users = JSON.parse(data);
    const match2 = users.find((user) => user.name === name);
    if (!match2) {
      return res.json({ message: "user not found" });
    }
    res.json({ user: match2 });
  });
});

//5
app.get("/Users", (req, res, next) => {
  fs.readFile("./users.json", "utf-8", (err, data) => {
    if (err) {
      return res.json({ message: "Error reading file" });
    }
    const users = JSON.parse(data);
    res.json({ user: users });
  });
});

//6
app.get("/user/filter", (req, res, next) => {
  const { age } = req.query;
  fs.readFile("./users.json", "utf-8", (err, data) => {
    if (err) {
      return res.json({ message: "Error reading file" });
    }
    const users = JSON.parse(data);
    const result = users.filter((user) => user.age >= Number(age));
    res.json({ user: result });
  });
});

//7
app.get("/Users/:id", (req, res, next) => {
  const { id } = req.params;
  fs.readFile("./users.json", "utf-8", (err, data) => {
    if (err) {
      return res.json({ message: "Error reading file" });
    }
    const users = JSON.parse(data);
    const match2 = users.find((idd) => idd.id === Number(id));
    if (!match2) {
      return res.json({ message: "user not found" });
    }
    res.json({ user: match2 });
  });
});
app.listen(port, () => {
  console.log("server is running😘");
});
//https://ebrahimd375-4267788.postman.co/workspace/Dina-Ebrahim's-Workspace~cc2a78ac-31ff-4c03-8bc6-6c20069f6df4/collection/57065343-d6652173-3419-43fb-b991-a96f72f707f4?action=share&source=copy-link&creator=57065343
