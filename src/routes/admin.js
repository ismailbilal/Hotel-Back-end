import { Router } from "express";
import adminModel from "../models/admin.js";

const admin = Router();

admin.get("/admin", async (req, res) => {
  const result = await adminModel.findAll();
  res.json(result);
});
admin.get("/admin/:id", async (req, res) => {
  const result = await adminModel.findById(req.params.id);
  res.json(result);
});
admin.post("/admin", async (req, res) => {
  const result = await adminModel.create(req.body);
  res.json(result);
});
admin.put("/admin/:id/password", async (req, res) => {
  const result = await adminModel.changePassword(req.params.id, req.body);
  res.json(result);
});
admin.put("/admin/:id/email", async (req, res) => {
  const result = await adminModel.changeEmail(req.params.id, req.body);
  res.json(result);
});
admin.delete("/admin/:id", async (req, res) => {
  const result = await adminModel.findBYIdAndDelete(req.params.id);
  res.json(result);
});
admin.post("/admin/login", async (req, res) => {
  const result = await adminModel.login(req.body.email, req.body.password);
  res.json(result);
});

export default admin;
