# logseq-zoterolocal-plugin

![Version](https://img.shields.io/github/v/release/benjypng/logseq-zoterolocal-plugin?style=flat-square&color=0969da) ![Downloads](https://img.shields.io/github/downloads/benjypng/logseq-zoterolocal-plugin/total?style=flat-square&color=orange) ![License](https://img.shields.io/github/license/benjypng/logseq-zoterolocal-plugin?style=flat-square)

> Connect locally to Zotero 7 (and above) and pull your items into Logseq without needing to sync with Zotero Cloud. Works on **both Logseq DB and Logseq MD (file-based) graphs** — one of the few Zotero plugins in the marketplace that supports both.

---

## ✨ Features

- **Supports both Logseq DB and Logseq MD:** unlike most other Zotero plugins in the marketplace, this plugin works fully on the new DB version as well as classic file-based (OG/MD) graphs.
- **Local-first connection:** talks directly to Zotero 7+ on your machine — no Zotero Cloud sync or API key required.
- **Customisable templates:** control exactly how imported items are laid out.
- **Easy insertion:** search and insert Zotero items into your graph from a slash command.
- **Import tracking:** see at a glance which items are already in your graph.
- **Fuzzy search:** quickly find the article you want to insert.
- **Annotation sync:** pull new annotations from Zotero into existing pages, per page or across the whole graph.

### Requirements

- Zotero 7 or above, running locally on the same machine.
- **Works on both graph types.** Logseq DB graphs and file-based (MD) graphs are both fully supported — this dual compatibility is a key difference from other Zotero plugins in the marketplace.

## 📸 Screenshots / Demo

![](/screenshots/demo.gif)

## ⚙️ Installation

1. Open Logseq.
2. Go to the **Marketplace** (Plugins > Marketplace).
3. Search for **zoterolocal**.
4. Click **Install**.

Alternatively, download a release and manually load it in Logseq.

## 🛠 Usage

### Setup

1. Close Logseq.
2. Ensure Zotero 7 is running, and then:
   - In settings, under `Advanced`, check `Allow other applications on this computer to communicate with Zotero`.
   - (only if you want citation keys) Install [Better Bibtex](https://github.com/retorquere/zotero-better-bibtex/releases).
   - In the Better Bibtex section of your Zotero settings, ensure that `Automatically pin citation key after X seconds` is set to `1`.
   - Note: Citation keys need to be **both** set up and pinned in Zotero 7 in order to use citation keys in Logseq. If you have issues setting this up, please seek help at the Zotero or Better Bibtex forums as I may not be as familiar.
   - Restart Zotero.
3. Open Logseq, and then plugin settings.
4. Verify that "Connection to Zotero is working" is checked.
5. Complete the rest of the plugin settings.

### Logseq DB

1. Ensure that you have completed the DB-related settings in the plugin settings.
2. Trigger the command palette (`Mod+Shift+P`) and use `Add Zotero schema to Logseq` to configure the property types used by Zotero.
3. If you encounter any issues, try using the following commands from the command palette:
   - `Remove all created schema`: This removes all the schema created by the plugin.
   - `Reset current settings`: This resets all settings to default. Restart Logseq after using this command.

Proceed to [Inserting items and citations](#inserting-items-and-citations) below.

### Logseq MD

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

### Inserting items and citations

1. Insert Zotero item:
   - Navigate to the page where you want to insert a Zotero item.
   - Type `/Zotero: Insert full item`.
   - Perform your search.
   - Click the desired item.
   - A new page will be created, and a reference to it will be inserted at your cursor position.

2. Insert citation:
   - Ensure that your citation key template is set up in your plugin settings.
   - Navigate to the page where you want to insert a Zotero item.
   - Type `/Zotero: Insert citation`.
   - Perform your search.
   - Click the desired item.
   - Citation will be added to your cursor position.

### Property Presets (DB version)

Choose a preset in the plugin settings to control which Zotero properties are added to your pages. The default is **Core**.

| Preset | Description |
|--------|-------------|
| **Minimal** | Just the essentials: title, date, creators, itemType, DOI, ISBN, publicationTitle, libraryLink |
| **Core** (default) | Minimal + common citation fields for journal articles, books, and chapters |
| **Academic Extended** | Core + dates, institutional, manuscript, report, and thesis fields |
| **Full** | Every available Zotero property |
| **Custom** | Pick individual properties via the checkbox list in settings |

<details>
<summary>Core properties</summary>

title, date, creators, itemType, DOI, ISBN, publicationTitle, libraryLink, shortTitle, year, publisher, place, volume, issue, pages, numPages, edition, series, seriesTitle, seriesNumber, ISSN, url, language, tags, key, libraryCatalog, rights, license, citationKey, journalAbbreviation, bookTitle, callNumber

</details>

<details>
<summary>Academic Extended properties (includes Core)</summary>

All Core properties, plus: accessDate, dateAdded, dateModified, month, day, number, versionNumber, parentItem, relations, references, university, institution, distributor, repository, manuscriptType, reportType, reportNumber, thesisType, extra, section, numberOfVolumes, firstPage, seriesText, subject, label

</details>

### Syncing Annotations (DB version)

After importing a Zotero item, you can sync new annotations that you've added in Zotero since the last import or sync.

- **Single page:** Navigate to a Zotero item page in Logseq, right-click the page title and select **Zotero: Sync annotations**. Only annotations added after the last sync will be appended under their respective attachment.
- **All pages:** Open the command palette (`Mod+Shift+P`) and run **logseq-zoterolocal-plugin: Sync all annotations**. This will sync annotations for every page tagged with "Zotero" in your graph.

The plugin tracks a `zotero-last-sync` timestamp on each page to determine which annotations are new. This timestamp is set automatically on initial import and updated after each sync.

### Other Settings

For Citation Key, Author and Page Name templates, use only the stated placeholders. Refer to the plugin settings for available options.

## ☕️ Support

If you enjoy this plugin, please consider supporting the development.

<div align="center">
  <a href="https://github.com/sponsors/benjypng"><img src="https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?style=for-the-badge&logo=github" alt="Sponsor on Github" /></a>&nbsp;<a href="https://www.buymeacoffee.com/hkgnp.dev"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee" /></a>
</div>

## 🤝 Contributing

Issues are welcome. If you find a bug, please open an issue. Pull requests are not accepted at the moment as I am not able to commit to reviewing them in a timely fashion.
