import { Router } from "express";
import userModel from "../models/user.js";

const user = Router();

user.get("/user", async (req, res) => {
  const result = await userModel.findAll();
  res.json(result);
});
user.get("/user/:id", async (req, res) => {
  const result = await userModel.findById(req.params.id);
  res.json(result);
});
user.post("/user", async (req, res) => {
  const result = await userModel.create(req.body);
  res.json(result);
});
user.put("/user/:id", async (req, res) => {
  const result = await userModel.findByIdAndUpdate(req.params.id, req.body);
  res.json(result);
});
user.delete("/user/:id", async (req, res) => {
  const result = await userModel.findBYIdAndDelete(req.params.id);
  res.json(result);
});
user.post("/user/:userId/hotel/:hotelId", async (req, res) => {
  const result = await userModel.createRelationshipHasVisit(
    req.params.userId,
    req.params.hotelId
  );
  res.json(result);
});
user.get("/user/:id/hotel", async (req, res) => {
  const result = await userModel.getHotelsVisited(req.params.id);
  res.json(result);
});
user.post("/user/login", async (req, res) => {
  const result = await userModel.login(req.body.username, req.body.password);
  res.json(result);
});
user.post("/user/accepted", async (req, res) => {
  const result = await userModel.accepted(
    req.body.username,
    req.body.email,
    req.body.password
  );
  res.json(result);
});
user.post("/user/:userId/rate/hotel/:hotelId", async (req, res) => {
  const result = await userModel.rateHotel(
    req.params.userId,
    req.params.hotelId,
    req.body.rating,
    req.body.comment
  );
  res.json(result);
});
user.get("/user/:username/id", async (req, res) => {
  const result = await userModel.getIdByUsername(req.params.username);
  res.json(result);
});
user.get("/user/:userId/hasvisit/hotel/:hotelId", async (req, res) => {
  const result = await userModel.hasVisited(
    req.params.userId,
    req.params.hotelId
  );
  res.json(result);
});

export default user;
