// Random integer grade in [min, max], inclusive. Default range 55-100
// (Braude's passing threshold is typically 55-60 depending on the
// course, so this stays within a realistic band rather than dipping
// into clearly-failing territory).
function randomGrade(min = 55, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = randomGrade;