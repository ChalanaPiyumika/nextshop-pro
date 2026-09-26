# Antoinette Atelier — Shopify Liquid theme

A native Shopify Online Store 2.0 theme. Every section below can be edited in
Shopify's Theme Editor (Customize), no code needed.

## Folder layout

```text
layout/theme.liquid              page shell, loads CSS/JS, renders sections
sections/                        editable blocks with their own settings
sections/header-group.json       header / announcement bar grouping
sections/footer-group.json       footer grouping
templates/*.json                 which sections appear on each page type
templates/customers/*.liquid     account, login, order, address pages
snippets/                        reusable Liquid partials (product card, cart lines)
assets/base.css, theme.js        styles and behaviour
config/settings_schema.json      Theme Editor sidebar: colours, type, social
config/settings_data.json        saved defaults
locales/en.default.json          English strings
```

## Upload to Shopify

1. Zip the **contents** of this folder (so `layout/` and `config/` sit at the
   zip root, not inside a parent folder).
2. In Shopify Admin: **Online Store → Themes → Add theme → Upload zip file**.
3. Press **Customize** to set the hero image, headings, buttons, colours,
   spacing, collections, menus, and footer.
4. **Save**, then publish the theme when it looks right.

## Editing in GitHub

This folder is part of the project repository, so pushing changes here syncs
them into Lovable, and Lovable changes sync back here. To work on a real store
instead, install the Shopify CLI in this folder and run:

```sh
shopify theme dev --store <your-store>.myshopify.com
shopify theme push --store <your-store>.myshopify.com
```
