module.exports = {
  '**/package.json': ['fixpack --quiet'],
  '**/*.{js,ts,jsx,tsx}': ['eslint --fix'],
};
