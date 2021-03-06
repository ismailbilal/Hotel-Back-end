import { Router } from "express";
import hotelModel from "../models/hotel.js";

const hotel = Router();

hotel.get("/hotel", async (req, res) => {
  const result = await hotelModel.findAll(
    req.query.sortingType,
    req.query.order,
    req.query.name
  );
  res.json(result);
});
hotel.get("/hotel/:id", async (req, res) => {
  const result = await hotelModel.findById(req.params.id);
  res.json(result);
});
hotel.post("/hotel", async (req, res) => {
  const result = await hotelModel.create(req.body);
  res.json(result);
});
hotel.put("/hotel/:id", async (req, res) => {
  const result = await hotelModel.findByIdAndUpdate(req.params.id, req.body);
  res.json(result);
});
hotel.delete("/hotel/:id", async (req, res) => {
  const result = await hotelModel.findBYIdAndDelete(req.params.id);
  res.json(result);
});
hotel.get("/hotel/:id/location", async (req, res) => {
  const result = await hotelModel.findLocation(req.params.id);
  res.json(result);
});
hotel.post("/hotel/:hotelId/location/:locationId", async (req, res) => {
  const result = await hotelModel.createReletionshipToLocation(
    req.params.hotelId,
    req.params.locationId
  );
  res.json(result);
});
hotel.get("/hotel/:hotelId/reviews", async (req, res) => {
  const result = await hotelModel.getReviews(req.params.hotelId);
  res.json(result);
});

export default hotel;
