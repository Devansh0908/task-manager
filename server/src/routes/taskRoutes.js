const express = require("express");
const {
  createTask,
  deleteTask,
  getTasksByProject,
  updateTask
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

router.use(protect);

router.post("/", requireAdmin, createTask);
router.get("/:projectId", validateObjectId("projectId"), getTasksByProject);
router.put("/:id", validateObjectId("id"), updateTask);
router.delete("/:id", validateObjectId("id"), deleteTask);

module.exports = router;
