module.exports = (argv = []) => {
  return argv.reduce((hash, arg) => {
    let parts = arg.split('=');
    hash[parts[0]] = parts[1];
    return hash;
  }, {});
};
