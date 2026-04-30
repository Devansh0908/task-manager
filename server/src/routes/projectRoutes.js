const express = require("express");
const {
  addMember,
  createProject,
  getProjectAnalytics,
  getProjects
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

router.use(protect);

router.get("/", getProjects);
router.get("/analytics", getProjectAnalytics);
router.post("/", requireAdmin, createProject);
router.post("/:id/add-member", requireAdmin, validateObjectId("id"), addMember);

module.exports = router;
