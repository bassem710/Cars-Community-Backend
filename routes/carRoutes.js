const express = require('express');

// Controllers
const {
    getAllCars,
    getOneCar,
    compareTwoCars,
    addCar,
    deleteCar,
    likeChange
} = require("../controllers/carControllers");

// Router
const router = express.Router();

// Admin routes
router.route("/addCar").post(addCar);
router.route("/deleteCar/:id").delete(deleteCar);

// User routes
router.route("/all").get(getAllCars);
router.route("/compare").get(compareTwoCars);
router.route("/likeChange/:id").post(likeChange);
router.route("/:id").get(getOneCar);


module.exports = router;