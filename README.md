![Logseq Badge](https://img.shields.io/badge/logseq-%2385C8C8?style=for-the-badge&logo=logseq&logoColor=black)

# Logseq Zotero Plugin

Connect locally to Zotero 7 (and above) and pull your items into Logseq without needing to sync with Zotero Cloud.

![](/screenshots/demo.gif)

## Features

- Direct connection to Zotero 7+ without needing to sync with Zotero Cloud
- Customisable templates
- Easy insertion of Zotero items into your graph
- Track which items are already in your graph
- Fuzzy search for the articles that you want to insert

## Installation

1. Recommended: Install from the Logseq marketplace.
2. Alternative: Download a release and manually load it in Logseq.

## Setup

1. Ensure Zotero 7 is running.
2. Open plugin settings in Logseq.
3. Verify that "Connection to Zotero is working" is checked.
4. Complete the rest of the plugin settings.

![Plugin Settings](/screenshots/plugin-settings.png)

## Usage

1. Create a Zotero template:
   - Go to any page that will hold your Zotero template.
   - Type `/Insert Zotero template`.
   - A sample template will be generated. Customize as needed.
   > Note: The <% notes %> should not be in the page properties as the content can be very long
   - If you change the template name, update it in the plugin settings.

   ![Template Example](/screenshots/template.png)

2. Insert Zotero item:
   - Navigate to the page where you want to insert a Zotero item.
   - Type `/Zotero: Insert full item`.
   - Perform your search.
   - Click the desired item.
   - A new page will be created, and a reference to it will be inserted at your cursor position.
  
3. Insert citation
   - Ensure that your citation key template is set up in your plugin settings.
   - Navigate to the page where you want to insert a Zotero item.
   - Type `/Zotero: Insert citation`.
   - Perform your search.
   - Click the desired item.
   - Citation will be added to your cursor position.

## Configuration

For Citation Key, Author and Page Name templates, use only the stated placeholders. Refer to the plugin settings for available options.

## Support

If you find this plugin useful, consider supporting the developer:

- [:gift_heart: Sponsor this project on Github](https://github.com/sponsors/hkgnp)
- [:coffee: Buy me a coffee](https://www.buymeacoffee.com/hkgnp.dev)

## Issues and Contributions

For bug reports, feature requests, or contributions, please visit the [GitHub repository](https://github.com/hkgnp/logseq-zotero-plugin).

*Note: This repository is currently not taking in any pull requests.*

## License

[MIT License](LICENSE)
