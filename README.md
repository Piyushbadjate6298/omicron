# Omicron Journeys — Premium React + Vercel Website

A premium, responsive React/Vite rebuild based on the provided Omicron Journeys site PDF/screenshots and the supplied vehicle/rate data.

## Highlights
- Premium dark + champagne visual system with editorial travel/automotive styling
- Fully responsive mobile navigation and fleet grids
- Fleet search + category filters
- Inquiry modal from every vehicle card
- Vercel-ready `/api/inquiry` serverless endpoint using Resend
- Existing brand logo crop included at `public/brand/omicron-logo.png`
- Accessible focus states, reduced-motion support, smooth transitions

## Source-grounded content
The site keeps the supplied company description, contact details, existing counters, services, testimonial, and the vehicle/rate inventory from the source material. The current source lists 20,000+ customers, 1,400+ tours completed, 16,800+ satisfied clients and 17,000+ SKUs.

## Development
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

## Vercel email setup
Set these Environment Variables in the Vercel project:
- `RESEND_API_KEY`
- `INQUIRY_TO_EMAIL` (defaults to `info@omicronjourneys.com`)
- `RESEND_FROM_EMAIL` (use a sender/domain verified in Resend for production)

Then deploy with Vercel. The API endpoint is already wired to `/api/inquiry`.

## Notes on imagery
The UI uses a mix of supplied-site gallery imagery and representative automotive/travel imagery referenced from online research. For production, replace remote image URLs with licensed/local assets if a specific model photo must be guaranteed to match the exact vehicle currently in the Omicron fleet.
