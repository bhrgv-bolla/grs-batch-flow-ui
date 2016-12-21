module.exports = {
  cache: {
    cacheId: "electrode-jobs-ui",
    runtimeCaching: [{
      handler: "fastest",
      urlPattern: "\/$"
    }],
    staticFileGlobs: ['dist/**/*']
  },
  manifest: {
    background: "#FFFFFF",
    title: "electrode-jobs-ui",
    short_name: "PWA",
    theme_color: "#FFFFFF"
  }
};
