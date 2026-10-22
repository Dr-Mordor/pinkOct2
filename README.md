# اطمنتي عليها — Etmeni campaign page

Static rebuild of the Bassmet Hayat "في امرأة بتحبيها… اطمنتي عليها؟" page. No build step, no backend, no database.

```
etmeni/
├── index.html      page markup (RTL Arabic)
├── styles.css      design system (same palette/spacing as the original)
├── app.js          questionnaire, share kit, copy tabs, contact form
├── config.js       ← the only file you edit
├── icon.svg
└── assets/
    ├── brochure-qr.png      (generated → Google Drive brochure)
    ├── campaign-qr.png      (generated → campaignUrl)
    ├── campaign-banner.jpeg ← copy from your current site
    └── community.webp       ← copy from your current site
```

## 1. Add the two photos
Download from your live page and drop into `assets/` with the same names:
- `/etmeni/assets/campaign-banner.jpeg`
- `/etmeni/assets/community.webp`

## 2. Activate email delivery (one click)
Messages go to `bha.palestine@gmail.com` via FormSubmit — no key, no account.
1. Deploy (step 3), then send one test message from the **live** page (not a local file).
2. FormSubmit emails that inbox an "Activate Form" link → click it. Check Spam if it's not there.
3. Optional: the confirmation email includes a random alias. Put it in `config.js` → `contactEmail` to hide the real address from bots.

Spam protection: honeypot field + FormSubmit filtering. Replies go straight to the sender if she left an email.

## 3. Deploy
- **Netlify**: drag the `etmeni` folder onto app.netlify.com/drop.
- **GitHub Pages**: push the folder, Settings → Pages → deploy from branch.
- **Vercel / Cloudflare Pages**: import repo, framework "Other", no build command.

## 4. If the URL changes
Edit `campaignUrl` in `config.js`, update the `canonical`/`og:url` tags in `index.html`, then regenerate the QR:
```bash
pip install "qrcode[pil]"
python -c "import qrcode;q=qrcode.QRCode(border=2,box_size=10);q.add_data('https://NEW-URL/');q.make_image(fill_color='#63253f',back_color='white').save('assets/campaign-qr.png')"
```

## Changes vs. the original
- Removed: share counter, tracking cookies, screening-request form, admin dashboard.
- Added: contact form that emails bha.palestine@gmail.com (FormSubmit); restart button on questionnaire result; campaign + Safety Map core messages.
- Questionnaire: when finished, the three answer numbers (anonymous, no id) are sent to the Supabase project `pink-october-nablus` and shown in the Safety Map admin analytics. Privacy text says so.
