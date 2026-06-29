const express = require("express");
const {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} = require("../../controller/admin/routeController");

const router = express.Router();


router.post("/", createRoute);


router.get("/", getRoutes);


router.get("/:id", getRouteById);


router.put("/:id", updateRoute);


router.delete("/:id", deleteRoute);

module.exports = router;
