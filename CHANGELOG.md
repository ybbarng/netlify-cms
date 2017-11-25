## [Unreleased]
<details>
  <summary>
    Changes that have landed in master but are not yet released.
    Click to see more.
  </summary>
</details>

## 0.7.5 (November 19, 2017)

* Add private media support for asset integrations ([@erquhart](https://github.com/erquhart) in [#834](https://github.com/netlify/netlify-cms/pull/834))

## 0.7.4 (November 15, 2017)

* Remove trailing slash from directory listing path ([@biilmann](https://github.com/biilmann) in [#817](https://github.com/netlify/netlify-cms/pull/817))
* Fix images with non-lowercase extensions not being treated as images ([@erquhart](https://github.com/erquhart) in [#816](https://github.com/netlify/netlify-cms/pull/816))
* Prompt before closing window with unsaved changes in the editor ([@benaiah](https://github.com/benaiah) in [#815](https://github.com/netlify/netlify-cms/pull/815))

## 0.7.3 (November 11, 2017)

* Fix persisting files with no body/data files ([@ebello](https://github.com/ebello) in [#808](https://github.com/netlify/netlify-cms/pull/808))
* Fix ControlHOC ref for redux container widgets ([@erquhart](https://github.com/erquhart) in [#812](https://github.com/netlify/netlify-cms/pull/812))
* Fix entries not saving due to null integrations state ([@erquhart](https://github.com/erquhart) in [#814](https://github.com/netlify/netlify-cms/pull/814))
* Fix requestAnimationFrame warnings in tests ([@tech4him1](https://github.com/tech4him1) in [#811](https://github.com/netlify/netlify-cms/pull/811))

## 0.7.2 (November 11, 2017)

* Only rebase editorial workflow pull requests if assets are stored in content repo ([@erquhart](https://github.com/erquhart) in [#804](https://github.com/netlify/netlify-cms/pull/804))
* Fix Netlify Identity widget logout method being called after signup redirect ([@tech4him1](https://github.com/tech4him1) in [#805](https://github.com/netlify/netlify-cms/pull/805))

## 0.7.1 (November 11, 2017)

* Enable sourcemaps ([@erquhart](https://github.com/erquhart) in [#803](https://github.com/netlify/netlify-cms/pull/803))
* Add unselected option to select widget when no default is set ([@benaiah](https://github.com/benaiah) in [#673](https://github.com/netlify/netlify-cms/pull/673))
* Fix image not shown after upload for Git Gateway ([@erquhart](https://github.com/erquhart) in [#790](https://github.com/netlify/netlify-cms/pull/790))
* Fix empty media folder loading error ([@erquhart](https://github.com/erquhart) in [#791](https://github.com/netlify/netlify-cms/pull/791))
* Fix error for non-markdown files in editorial workflow ([@tech4him1](https://github.com/tech4him1) in [#794](https://github.com/netlify/netlify-cms/pull/794))
* Fix login when accept_roles is set ([@tech4him1](https://github.com/tech4him1) in [#801](https://github.com/netlify/netlify-cms/pull/801))
* Add error boundary to editor preview iframe ([@erquhart](https://github.com/erquhart) in [#779](https://github.com/netlify/netlify-cms/pull/779))

## 0.7.0 (November 9, 2017)

### Media Library UI
The CMS now features a media library UI for browsing, adding, and removing media from your content
repo! The library shows assets in from the directory set as `media_library` in the CMS config. The
media library is fully backwards compatible for existing CMS installations.

### All Changes
* Add config option to disable deletion for a collection ([@rpullinger](https://github.com/rpullinger) in [#707](https://github.com/netlify/netlify-cms/pull/707))
* Fix TOML files not being saved with the correct extension ([@tech4him1](https://github.com/tech4him1) in [#757](https://github.com/netlify/netlify-cms/pull/757))
* Clean up file formatters ([@tech4him1](https://github.com/tech4him1) in [#759](https://github.com/netlify/netlify-cms/pull/759))
* Add scroll sync toggle to editor ([@Jinksi](https://github.com/Jinksi) in [#693](https://github.com/netlify/netlify-cms/pull/693))
* Disable login button while login is in progress ([@tech4him1](https://github.com/tech4him1) in [#741](https://github.com/netlify/netlify-cms/pull/741))
* Improve markdown editor active style indicator accuracy ([@pjsier](https://github.com/pjsier) in [#774](https://github.com/netlify/netlify-cms/pull/774))
* Add media library UI ([@erquhart](https://github.com/erquhart) in [#554](https://github.com/netlify/netlify-cms/pull/554))
* Fix transparent background on list widget ([@Jinksi](https://github.com/Jinksi) in [#768](https://github.com/netlify/netlify-cms/pull/768))
