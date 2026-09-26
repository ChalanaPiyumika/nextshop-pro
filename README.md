# Antoinette Atelier — Shopify Liquid theme

A native Shopify Online Store 2.0 theme. Every section is editable in
Shopify's Theme Editor (Customize) — hero image, headings, buttons, colours,
spacing, collections, menus, and footer — no code needed.

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

## Auto-sync: GitHub → Shopify (recommended)

This repo is structured so Shopify can watch it directly. Any push to the
connected branch updates the theme in your store automatically.

1. In Shopify Admin: **Online Store → Themes → Add theme → Connect from GitHub**.
2. Authorize the Shopify GitHub app and select this repository.
3. Choose the branch to track (e.g. `main`). Shopify creates a theme from it.
4. From now on, every commit pushed to that branch syncs to the theme within
   seconds. Publish the theme when it looks right.

Tip: keep `main` as your live branch and use a second branch (e.g. `dev`)
connected as a separate unpublished theme for testing changes safely.

## Manual upload (alternative)

1. Zip the **contents** of this repo (so `layout/` and `config/` sit at the
   zip root, not inside a parent folder).
2. In Shopify Admin: **Online Store → Themes → Add theme → Upload zip file**.

## Local development with Shopify CLI

```sh
shopify theme dev --store <your-store>.myshopify.com
shopify theme push --store <your-store>.myshopify.com
```
