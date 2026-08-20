# GenAlpha Labs — Website

Robotics & technology lab solutions — single-page marketing/lead-gen site.
Pure HTML/CSS/JS, no build step. Fully responsive (mobile / tablet / desktop).

## Files
- `index.html` — all sections (Home, What We Do, Equipment, Lab Setup, Custom Robots, Who We Serve, Why, Projects, About, Contact)
- `styles.css` — blue robotics theme (Sora + Inter)
- `script.js` — nav, reveal animations, lead form
- `assets/` — lab photos

## Preview locally
```bash
cd genalpha-labs
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy (free)
1. https://app.netlify.com/drop → drag-drop this folder → live URL
2. Or GitHub Pages / Vercel / Cloudflare Pages (all free)
3. Add custom domain later (genalphalabs.com etc.)

## ⚠️ Before going live — fill in real details
1. **Contact form** — currently opens the visitor's email app (mailto fallback).
   To receive enquiries directly:
   - Sign up free at https://formspree.io
   - Create a form → get an ID like `https://formspree.io/f/abcd1234`
   - In `index.html`, replace `YOUR_FORM_ID` in the form's `action`
2. **Email in fallback** — in `script.js`, replace `info@genalphalabs.com` with the real email
3. Add real **phone/email/address** if you want them shown (currently form-only per brief)

## To add later (per brief)
- A separate **Learning & Programs** page for the education content
- Real project photos with details in the Projects section
- Split Equipment / Projects into their own pages if catalogue grows
