import fetch from "node-fetch";
import express from "express";
// import { config } from "dotenv";
// import hotel from "./src/routes/hotel.js";
// import location from "./src/routes/location.js";
// import locality from "./src/routes/locality.js";
// import city from "./src/routes/city.js";
// import user from "./src/routes/user.js";
// import admin from "./src/routes/admin.js";

// config();
const PORT = process.env.PORT || 3000;
const app = express();
app.get("/", (req, res) => {
  // send a get request to root directory ('/' is this file (app.js))
  fetch("https://www.boredapi.com/api/activity") // fetch activity from bored API - https://www.boredapi.com/about
    .then((res) => res.json()) // return a promise containing the response
    .then((json) => res.send(`<h1>Today's Activity: ${json.activity}!</h1>`)) // extract the JSON body content from the response (specifically the activity value) and sends it to the client
    .catch(function (err) {
      // catch any errors
      console.log(err); // log errors to the console
    });
});

app.get("/hotel", (req, res) => {
  res.json({ name: "ismail", password: "bilal" });
});
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/", hotel);
// app.use("/", location);
// app.use("/", locality);
// app.use("/", city);
// app.use("/", user);
// app.use("/", admin);

app.listen(PORT, function () {
  console.log("Express server listening on port %d", PORT);
});
