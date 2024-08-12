# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.4.0] - 2024-08-11

### Added

- New command "add font" allows you to select a font from the list of system
  fonts instead of typing the font name manually in the settings. Access this
  command by opening the command pallette and typing "Add font".
- On installation, the extension will generate its font list from the current
  fonts listed in `editor.fontFamily`

### Fixed

- Original font settings are no longer overwritten. Only the first font in the
  list is replaced when the font gets randomized.
- Fixed a bug where the same font could appear in `editor.fontFamily` twice and
  cause errors.

## [v1.3.1] - 2023-05-20

### Added

- New `Every 3 seconds` option for the auto-refresh setting for debugging
  purposes.

## [v1.3.0] - 2023-05-03

### Added

- Now you can make it change your font automatically every half hour, hour, 2
  hours, or every day.

## [v1.2.0] - 2023-04-27

### Added

- New status bar icons!
  - Clicking the refresh icon will randomize the font
- Current font name is now displayed in the status bar!
  - Click it to select the font yourself, or jump to the settings page to manage
    your font list

## [v1.0.0] - 2023-04-18

Released!!!
