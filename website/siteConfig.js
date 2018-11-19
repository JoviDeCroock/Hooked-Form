/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'Hooked-Form',
  tagline: "You will get hooked.",
  url: 'https://jovidecroock.github.io',
  baseUrl: '/hooked-form/',
  projectName: 'hooked-form',
  organizationName: 'jovidecroock',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'components/form', label: 'API' },
  ],

  /* path to images for header/footer */
  headerIcon: 'img/logo.png',
  footerIcon: 'img/logo.png',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#2d7c85',
    secondaryColor: '#204f5c',
  },

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Jovi De Croock`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/logo.png',
  twitterImage: 'img/logo.png',

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/JoviDeCroock/hooked-form',
};

module.exports = siteConfig;
