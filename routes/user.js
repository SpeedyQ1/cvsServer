const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.route("/").post(userController.login);
router.route("/register").post(userController.register);
router.route("/getUser").post(userController.getUserByToken);
router.route("/addCv").patch(userController.createNewCv);
router.route("/getCvs").post(userController.getCvsByToken);
router.route("/editCv").patch(userController.editCv);
router.route("/deleteCv").patch(userController.deleteCv);
router.route("/awake").get(userController.keepAwake);



module.exports = router;
