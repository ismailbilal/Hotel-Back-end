import express from "express";
import { config } from "dotenv";
import hotel from "./src/routes/hotel.js";
import location from "./src/routes/location.js";
import locality from "./src/routes/locality.js";
import city from "./src/routes/city.js";
import user from "./src/routes/user.js";
import admin from "./src/routes/admin.js";

config();
const PORT = process.env.PORT || 8081;
const app = express();

app.set("port", PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/", hotel);
// app.use("/", location);
// app.use("/", locality);
// app.use("/", city);
// app.use("/", user);
// app.use("/", admin);
app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
console.log("server started at http://localhost%d", PORT);
