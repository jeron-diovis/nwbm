module.exports = {
  plugins: {
    // @see https ://www.npmjs.com/package/postcss-mixins
    'postcss-mixins': {},
    // @see https ://github.com/postcss/postcss-nested
    'postcss-nested': {},
    // @see https ://github.com/csstools/postcss-custom-selectors
    'postcss-custom-selectors': {
      preserve: true,
    },
  },
}
