import { Router } from "express";
import locationModel from "../models/location.js";

const location = Router();

location.get("/location", async (req, res) => {
  const result = await locationModel.findAll();
  res.json(result);
});
location.get("/location/:id", async (req, res) => {
  const result = await locationModel.findById(req.params.id);
  res.json(result);
});
location.post("/location", async (req, res) => {
  const result = await locationModel.create(req.body);
  res.json(result);
});
location.put("/location/:id", async (req, res) => {
  const result = await locationModel.findByIdAndUpdate(req.params.id, req.body);
  res.json(result);
});
location.delete("/location/:id", async (req, res) => {
  const result = await locationModel.findBYIdAndDelete(req.params.id);
  res.json(result);
});
location.get("/location/:id/hotel", async (req, res) => {
  const result = await locationModel.findHotel(req.params.id);
  res.json(result);
});
location.get("/location/:id/locality", async (req, res) => {
  const result = await locationModel.findLocality(req.params.id);
  res.json(result);
});
location.post(
  "/location/:locationId/locality/:localityId",
  async (req, res) => {
    const result = await locationModel.createRelationshipToLocality(
      req.params.locationId,
      req.params.localityId
    );
    res.json(result);
  }
);

export default location;
