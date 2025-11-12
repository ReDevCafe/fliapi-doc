import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "FliAPI doc",
  description: "Documentation for FLiAPI",
  base: '/fliapi-doc/',
  themeConfig: 
  {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Install', link: '/quick-setup/installation' },
      { text: 'Documentation', link: '/api-documentation/creating-mod'}
    ],

    footer:
    {
      message: "Love u all ❤️",
      copyright: "Released under the MIT License"
    },

    sidebar: 
    [
      {
        text: 'Quick setup',
        items: 
        [
          { text: 'Installation', link: '/quick-setup/installation' },
          { text: 'Adding mods', link: '/quick-setup/add-mods'}
        ]
      },
      {
        text: 'API documentation',
        items: [
          {text: 'Creating a mod', link: '/api-documentation/creating-mod'},
          {
            text: 'Mod',
            items: 
            [
              { text: 'Mod Base', link: '/api-documentation/mod/mod-base' },
              { text: 'Mod Configuration', link: '/api-documentation/mod/configuration' }
            ]
          },
          {
            text: 'Advanced',
            items: 
            [
              { text: 'Recreate UE/Game Functions', link: '/api-documentation/advanced/game-function-proxy' },
            ]
          },

        ]
      }
    ],

    search:
    {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ReDevCafe' },
      { icon: 'nexusmods', link: 'https://www.nexusmods.com/fantasylifeithegirlwhostealstime/mods/44', },
      { icon: 'gamebanana', link: 'https://gamebanana.com/tools/20956'}
    ]
  }
})
