const Certificate = require("../models/Certificate");

// CREATE
exports.createCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.create(req.body);

    res.status(201).json({
      message: "Certificate Created ✅",
      data: certificate,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// READ ALL
exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().lean();

    res.json(certificates);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// READ ONE
exports.getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found ❌",
      });
    }

    res.json(certificate);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE
exports.updateCertificate = async (req, res) => {
  try {
    const updated = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Certificate not found ❌",
      });
    }

    res.json({
      message: "Updated ✅",
      data: updated,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// 👇 ADD DELETE FUNCTION HERE (THIS IS THE PLACE)
exports.deleteCertificate = async (req, res) => {
  try {
    const deleted = await Certificate.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Certificate not found ❌",
      });
    }

    res.json({
      message: "Deleted successfully ✅",
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};