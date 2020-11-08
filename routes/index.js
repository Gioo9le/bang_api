var express = require('express');
var router = express.Router();

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Il max è escluso e il min è incluso
}
/* GET home page. */
router.get('/', function(req, res, next) {
  let randCard = getRandomInt(0, 43);
  res.send({
    cardId: randCard,
  });
});

module.exports = router;
