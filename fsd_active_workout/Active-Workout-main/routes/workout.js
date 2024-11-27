// routes/workout.js
const express = require("express");
const Workout = require("../models/Workout");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Add Workout
router.post("/", authMiddleware, async (req, res) => {
    const { name, duration, caloriesBurned, date } = req.body;

    try {
        const newWorkout = new Workout({
            userId: req.user.id,
            name,
            duration,
            caloriesBurned,
            date,
        });

        await newWorkout.save();
        res.status(201).json(newWorkout);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Workouts
router.get("/", authMiddleware, async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Workout
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        // Check if the workout exists
        if (!workout) {
            return res.status(404).json({ msg: "Workout not found" });
        }

        // Ensure that the workout belongs to the authenticated user
        if (workout.userId.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Unauthorized to delete this workout" });
        }

        // Delete the workout
        await workout.remove();
        res.status(200).json({ msg: "Workout deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error deleting workout", error: error.message });
    }
});

module.exports = router;
