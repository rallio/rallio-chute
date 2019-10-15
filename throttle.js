const throttle = (fn, delay) => {
  fn();
  setInterval(fn, delay);
};

module.exports = throttle;
