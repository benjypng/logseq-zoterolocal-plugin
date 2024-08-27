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

1. Close Logseq.
2. Ensure Zotero 7 is running, and then:
   - In settings, under `Advanced`, check `Allow other applications on this computer to communicate with Zotero`.
   - (only if you want to citation keys) Install [Better Bibtex](https://github.com/retorquere/zotero-better-bibtex/releases).
   - In the Better Bibtex section of your Zotero settings, ensure that `Automatically pin citation key after X seconds` is set to `1`.
   - Note: Citation keys need to be **both** set up and pinned in Zotero 7 in order to use citation keys in Logseq. If you have issues setting this up, please seek help at the Zotero or Better Bibtex forums as I may not be as familiar.
   - Restart Zotero.
3. Open Logseq, and then plugin settings.
4. Verify that "Connection to Zotero is working" is checked.
5. Complete the rest of the plugin settings.

![Plugin Settings](/screenshots/plugin-settings.png)

## Usage

1. Create a Zotero template:
   - Go to any page that will hold your Zotero template.
   - Type `/Insert Zotero template`.
   - A sample template will be generated (example below). Customize as needed.
   > Note: The <% notes %> should not be in the page properties as the content can be very long
   - If you change the template name, update it in the plugin settings.

```
  accessDate:: <% accessDate %>
  attachments:: <% attachments %>
  citeKey:: <% citeKey %>
  collections:: <% collections %>
  authors:: <% creators %>
  date:: <% date %>
  dateAdded:: <% dateAdded %>
  dateModified:: <% dateModified %>
  DOI:: <% DOI %>
  ISBN:: <% ISBN %>
  ISSN:: <% ISSN %>
  issue:: <% issue %>
  itemTitle:: <% title %>
  itemType:: <% itemType %>
  journalAbbreviation:: <% journalAbbreviation %>
  key:: <% key %>
  language:: <% language %>
  libraryCatalog:: <% libraryCatalog %>
  libraryLink:: <% libraryLink %>
  pages:: <% pages %>
  parentItem:: <% parentItem %>
  publicationTitle:: <% publicationTitle %>
  relations:: <% relations %>
  shortTitle:: <% shortTitle %>
  tags:: <% tags %>
  url:: <% url %>
  version:: <% version %>
  volume:: <% volume %>
```

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
