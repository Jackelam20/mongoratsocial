const router = require("express").Router();
const thoughtsRoutes = require("./api/thoughtsRoutes");
const usersRoutes = require("./api/userRoutes");

router.use("/thoughts", thoughtsRoutes);
router.use("/users", usersRoutes);

module.exports = router;