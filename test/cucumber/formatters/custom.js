module.exports = function (options) {
  return {
    handleAfterFeatures: () => options.log('CUSTOM FORMATTER WAS HERE'),
  };
};
