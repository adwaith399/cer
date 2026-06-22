const express = require("express");
const router = express.Router();

const controller = require("../controllers/certificateController");

// CREATE
router.post("/", controller.createCertificate);

// READ ALL
router.get("/", controller.getCertificates);

// READ ONE
router.get("/:id", controller.getCertificate);

// UPDATE
router.put("/:id", controller.updateCertificate);

// DELETE
router.delete("/:id", controller.deleteCertificate);

module.exports = router;