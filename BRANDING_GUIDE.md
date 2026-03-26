# Branding Guide (HTML Email Styles)

To ensure your HTML emails match the brand of the site identically, you should use the following style references. Since HTML emails require maximum compatibility across different clients (Gmail, Outlook, Apple Mail), we've converted your site's dynamic HSL variables into standard Hex codes.

## 1. Typography (Web Fonts)
Your site uses two Google Fonts. You should import these at the top of your email `<head>`, but always provide safe fallbacks since some email clients block custom web fonts.

* **Headings (h1 - h6):** `Space Grotesk`
  * *Fallback:* `Arial, Helvetica, sans-serif`
  * *Weight:* Semi-Bold (600) or Bold (700)
  * *Letter Spacing:* `0.02em`
* **Body Copy:** `Inter`
  * *Fallback:* `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
  * *Weight:* Regular (400)
  * *Line Height:* `1.6`
  * *Letter Spacing:* `0.01em`

**Snippet for `<head>`:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
```

## 2. Color Palette (Dark Theme)
Since your website operates entirely in a premium dark mode, the email should match this aesthetic.

### Backgrounds
* **Main Body Background:** `#090D1A` *(HSL: 222 47% 7%)*
* **Content Container / Card Background:** `#1D222E` *(HSL: 222 24% 15%)*
* **Borders / Dividers:** `#232936` *(HSL: 222 24% 18%)*

### Text Colors
* **Primary Text (Headings/Body):** `#F8F9FB` *(HSL: 210 40% 98%)*
* **Muted Text (Subtitles/Footers):** `#959BA7` *(HSL: 215 15% 65%)*

### Brand & Accent Colors (Use for Buttons & Links)
* **Primary Action (Warm Orange):** `#F66E09` *(HSL: 25 95% 53%)*
  * *Text on this button should be white/light.*
* **Accent/Highlights (Electric Blue):** `#4D94FF` *(HSL: 215 100% 65%)*

## 3. Structural & Component Styles
To make the components feel like your website:

* **Buttons (Call to Action):**
  * Background: `#F66E09`
  * Text Color: `#F8F9FB`
  * Border Radius (`rounded-md` on your site): `14px` (or `0.875rem`)
  * Font Weight: 600 (Semi-bold)
* **Cards / Content Blocks:**
  * Background: `#1D222E`
  * Border: `1px solid #232936`
  * Border Radius: `20px` (or `1.25rem` for large radii on your site)

## 4. Example Email CSS Structure
```css
body {
    background-color: #090D1A;
    color: #F8F9FB;
    font-family: 'Inter', Arial, sans-serif;
    line-height: 1.6;
    letter-spacing: 0.01em;
    margin: 0;
    padding: 0;
}
h1, h2, h3 {
    font-family: 'Space Grotesk', Arial, sans-serif;
    letter-spacing: 0.02em;
    color: #F8F9FB;
}
.button-primary {
    background-color: #F66E09;
    color: #F8F9FB;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 14px;
    font-weight: 600;
    display: inline-block;
}
.card {
    background-color: #1D222E;
    border: 1px solid #232936;
    border-radius: 20px;
    padding: 24px;
}
.text-muted {
    color: #959BA7;
}
```
