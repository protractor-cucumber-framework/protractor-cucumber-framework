Timeline Plugin
===============

This plugin gathers test timeline information from the protractor test process, the selenium
client logs (if available), and sauce labs (if available), and presents the output visually.
This improves understanding of where latency issues are in tests.

To enable the Timeline plugin, set it up in your config file:
```js
exports.config = {
  plugins: [{
   path: 'node_modules/protractor/plugins/timeline/index.js',

    // Output json and html will go in this folder.
   outdir: 'timelines',

    // Optional - if sauceUser and sauceKey are specified, logs from
   // SauceLabs will also be parsed after test invocation.
     sauceUser: 'Jane',
     sauceKey: 'abcdefg'
   }],
  // other configuration settings
};
```
