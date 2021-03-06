/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-ace/,
            use: loaders.null(),
          },
          {
            test: /react-leaflet/,
            use: loaders.null(),
          },
          {
            test: /@elastic\/eui\/es\/components\/popover/,
            use: loaders.null(),
          },
          {
            test: /@elastic\/eui\/es\/components\/form\/super_select/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}