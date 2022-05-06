import express from "express";
import { config } from "dotenv";
import cors from "cors";
import hotel from "./src/routes/hotel.js";
import location from "./src/routes/location.js";
import locality from "./src/routes/locality.js";
import city from "./src/routes/city.js";
import user from "./src/routes/user.js";
import admin from "./src/routes/admin.js";

config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", hotel);
app.use("/", location);
app.use("/", locality);
app.use("/", city);
app.use("/", user);
app.use("/", admin);

app.listen(PORT, () => {
  console.log("Express server listening on port %d", PORT);
});
