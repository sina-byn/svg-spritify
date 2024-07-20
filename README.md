# svg-spritify [![NPM version](https://img.shields.io/npm/v/svg-spritify.svg?style=flat)](https://www.npmjs.com/package/svg-spritify) [![NPM monthly downloads](https://img.shields.io/npm/dm/svg-spritify.svg?style=flat)](https://npmjs.org/package/svg-spritify) [![NPM total downloads](https://img.shields.io/npm/dt/svg-spritify.svg?style=flat)](https://npmjs.org/package/svg-spritify) 

> Creating SVG sprites has never been this easy. Easily generate sprites out of your SVG files.

A CLI tool for you to generate SVG sprites ASAP with support for multi-theme and multi-breakpoint configurations

Please consider following this project's author, [Sina Bayandorian](https://github.com/sina-byn), and consider starring the project to show your :heart: and support.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Configuration](#configuration)
    - [Config Variants - Must-Read ⚠️](#config-variants)
    - [Theming](#theming)
    - [Breakpoint Utils](#breakpoint-utils)
    - [Demo](#demo)

## Install

Install with [npm](https://www.npmjs.com/package/svg-spritify) :

```sh
$ npm install -g svg-spritify
```

## Usage

```sh
$ npx sprite
```

## Configuration

This CLI comes with a proper default config that can be completely customized to best fit your needs. In order to override the default configuration you need to create a `sprite.config.json` at the root of your project :

| Name            | Type                                      | Default                               | Description                                                         |
|:-----------------|:-------------------------------------------|:---------------------------------------|:---------------------------------------------------------------------|
| rootDir         | string                                    | "icons"                               | the directory where you should put your SVG icons                   |
| outDir          | string                                    | ".output"                             | the directory where sprite SVG(s) and CSS will be generated         |
| filename        | string                                    | "sprite"                              | output SVG files' prefix name                                       |
| className       | string                                    | "sprite"                              | the className to be used for both CSS and SVG files                 |
| media           | "min" \| "max"                            | "min"                                 | the type of the media query used for responsive icons               |
| themes          | string[ ]                                  | ["light"]                             | the themes that you want your icons to support                      |
| defaultTheme    | string                                    | themes[0]                             | the default theme of your icons - [explained below](#theming)                   |
| breakpoints     | { [bp: string]: number }                  | { }                                   | the breakpoints used for responsive icons                           |
| breakpointUtils | boolean                                   | true                                  | if set to `true`, outputs per-breakpoint CSS utils - [explained below](#breakpoint-utils) |
| css             | { minify?: boolean; filename?: string }   | { minify: false, filename: 'sprite' } | output CSS configuration                                            |
| demo            | boolean \| { [theme: string]: hex_color } | false                                 | demo configuration - [explained below](#demo)                                |

### Config Variants

This CLI in its core has a function called `resolvePaths` that is responsible for resolving the `inputs` and `outputs` based the config variant you provide. There can be 4 different config variants based on how you choose to config the CLI :

- single theme - single breakpoint
place your SVG icons directly inside the `rootDir`.
    - `rootDir`

- single theme - multi breakpoint
you need one sub-folder per `breakpoint` directly inside the `rootDir` - the SVG icons of each breakpoint should be placed directly inside the related sub-folder.
    - `rootDir/breakpoint`

- multi theme - single breakpoint
you need one sub-folder per `theme` directly inside the `rootDir` - the SVG icons of each theme should be placed directly inside the related sub-folder
    - `rootDir/theme`

- multi theme - multi breakpoint
you need one sub-folder per `theme` directly inside the `rootDir`, and then one sub-folder per `breakpoint` directly inside each theme's sub-folder - the breakpoint's sub-folder is where you place the SVG icons
    - `rootDir/theme/breakpoint`

- When managing multiple breakpoints, it's important to ensure there's a fallback for screen sizes that don't meet any specified conditions. This is achieved by using a `DEFAULT` folder alongside your breakpoint-specific folders.
    - Suppose you have the following breakpoint configuration `"lg": 1024` with the media type set to `min`, the icons inside the `lg` folder will display when the viewport width is `>= 1024px`. For screen sizes below `1024px`, the icons from the `DEFAULT` folder will be used.

### Theming

Theming is implemented using classNames in this package. Once you define your themes inside `sprite.config.json`, the output css will look something like :

```css
.<theme> .<icon-name> { ... }
```

You can show a given theme's icon by giving a className equal to the theme's name to a parent of the icon.

One thing to notice is the importance of the `defaultTheme`. There is no className defined for the defaultTheme. There is no className defined for the defaultTheme. The default icons are shown by default as the name implies.
- Defaults to the first theme if not defined
<br />

### Breakpoint Utils
If set to `true`, generates one utility class for each breakpoint to create breakpoint-specific icons. For example, given `"md": 768`, we have :

```css
.sprite-md {
    display: none;
}

@media (min-width: 768px) {
    .sprite-md {
        display: inline-block;
    }
}
```
<br />

### Demo

If set to `true`, a `demo.html` will be generated where you can see a list of your icons all at once - it can also be set to an object that accepts strings as keys and hex colors as values, each key is a `theme` specified in the config and each color is the `background-color` that is going to be used once you change the `demo.html` file's theme :


```json
{
    "demo" {
        "light": "ffffff",
        "dark": "303030"
    }
}
```
make sure not to include the `#` in your hex string
<br />