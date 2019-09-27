var express = require('express');
var router = express.Router();

/* Friendly greeting for the root route */
router.get('/', function(req, res) {
  res.json({ message: "Welcome to Kennie's ReST API Validation with Express project!" });
});

module.exports = router;
