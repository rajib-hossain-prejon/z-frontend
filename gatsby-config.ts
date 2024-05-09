import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'zoxxo',
    description: 'zoxxo is a file sharing web app',
    image: '/favicon.png',
    siteUrl: `https://www.zoxxo.io`,
  },
  // More easily incorporate content into your pages through
  // automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-sitemap',
    /* {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/locales`,
        name: 'locales',
      },
    },
    {
      resolve: 'gatsby-plugin-react-i18next',
      options: {
        localeJsonSourceName: 'locales',
        languages: ['en', 'de'],
        defaultLanguage: 'en',
        siteUrl: `https://www.zoxxo.io/`,
        i18nextOptions: {
          interpolation: {
            escapeValue: false,
          },
        },
      },
    }, */
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/static/favicon.png',
      },
    },
    {
      resolve: '@chakra-ui/gatsby-plugin',
      options: {
        /**
         * @property {boolean} [resetCSS=true]
         * if false, this plugin will not use `<CSSReset />
         */
        resetCSS: true,
        /**
         * @property {number} [portalZIndex=undefined]
         * The z-index to apply to all portal nodes. This is useful
         * if your app uses a lot z-index to position elements.
         */
        portalZIndex: undefined,
      },
    },
  ],
};

export default config;
