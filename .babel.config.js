module.exports = api => {
  const isTest = api.env('test');

  if (!isTest) {
    return {};
  }

  const targets = {
    node: 'current',
  };

  return {
    presets: [
      ['@babel/preset-env', { targets }]
    ]
  };
};
