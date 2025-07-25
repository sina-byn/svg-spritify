# svg-spritify [![NPM version](https://img.shields.io/npm/v/svg-spritify.svg?style=flat)](https://www.npmjs.com/package/svg-spritify) [![NPM monthly downloads](https://img.shields.io/npm/dm/svg-spritify.svg?style=flat)](https://npmjs.org/package/svg-spritify) [![NPM total downloads](https://img.shields.io/npm/dt/svg-spritify.svg?style=flat)](https://npmjs.org/package/svg-spritify) 

> Creating SVG sprites has never been this easy. Easily generate sprites out of your SVG files.

SVG sprite generator CLI tool

Please consider following this project's author, [Sina Bayandorian](https://github.com/sina-byn), and consider starring the project to show your :heart: and support.

### Note:

If you want granular control over the sprite generation process with a fully configurable setup, use version [**`svg-spritify@1.2.2`**](https://www.npmjs.com/package/svg-spritify/v/1.2.2).  
Versions starting from **`2.0.0`** are designed to be **highly customizable via CSS**, rather than relying on extensive configuration.

## Install

Install with [npm](https://www.npmjs.com/package/svg-spritify) :

```sh
npm install -g svg-spritify
```

## Usage

```sh
npx sprite
```

```html
<svg width="20" height="20">
  <use href="/path/to/icons.svg#id" />
</svg>

<!-- change icon's size and color -->
<svg width="40" height="40" style="color: blue">
  <use href="/path/to/icons.svg#id" />
</svg>
```