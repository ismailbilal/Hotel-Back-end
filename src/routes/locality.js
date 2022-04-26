import { Router } from "express";
import localityModel from "../models/locality.js";

const locality = Router();

locality.get("/locality", async (req, res) => {
  const result = await localityModel.findAll();
  res.json(result);
});
locality.get("/locality/:id", async (req, res) => {
  const result = await localityModel.findById(req.params.id);
  res.json(result);
});
locality.post("/locality", async (req, res) => {
  const result = await localityModel.create(req.body);
  res.json(result);
});
locality.put("/locality/:id", async (req, res) => {
  const result = await localityModel.findByIdAndUpdate(req.params.id, req.body);
  res.json(result);
});
locality.delete("/locality/:id", async (req, res) => {
  const result = await localityModel.findBYIdAndDelete(req.params.id);
  res.json(result);
});
locality.get("/locality/:id/location", async (req, res) => {
  const result = await localityModel.findLocation(req.params.id);
  res.json(result);
});
locality.post("/locality/:localityId/city/:cityId", async (req, res) => {
  const result = await localityModel.createRelationshipToCity(
    req.params.localityId,
    req.params.cityId
  );
  res.json(result);
});
locality.get("/locality/:id/city", async (req, res) => {
  const result = await localityModel.findCity(req.params.id);
  res.json(result);
});

export default locality;
