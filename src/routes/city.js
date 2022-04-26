import { Router } from "express";
import cityModel from "../models/city.js";

const city = Router();

city.get("/city", async (req, res) => {
  const result = await cityModel.findAll();
  res.json(result);
});
city.get("/city/:id", async (req, res) => {
  const result = await cityModel.findById(req.params.id);
  res.json(result);
});
city.post("/city", async (req, res) => {
  const result = await cityModel.create(req.body);
  res.json(result);
});
city.put("/city/:id", async (req, res) => {
  const result = await cityModel.findByIdAndUpdate(req.params.id, req.body);
  res.json(result);
});
city.delete("/city/:id", async (req, res) => {
  const result = await cityModel.findBYIdAndDelete(req.params.id);
  res.json(result);
});
city.get("/city/:id/locality", async (req, res) => {
  const result = await cityModel.findLocality(req.params.id);
  res.json(result);
});

export default city;
