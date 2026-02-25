module.exports = function normalizeMainIndex(mainImageIndex, filesCount) {
  const idx = Number(mainImageIndex ?? 0);
  if (!Number.isInteger(idx) || idx < 0 || idx >= filesCount) return 0;
  return idx;
};
