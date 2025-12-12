# Nationwide Courier Landing Page

## Overview
Production-ready, fully responsive landing page for a national courier service in India. Built with Next.js 14, React, and Tailwind CSS.

## Features

### SEO Optimized
- **Meta Tags**: Complete Open Graph and Twitter Card tags
- **Structured Data**: JSON-LD schema for LocalBusiness/DeliveryService
- **Keywords**: Optimized for courier service India, same-day delivery, COD, etc.
- **Semantic HTML**: Proper heading hierarchy and ARIA attributes

### Sections
1. **Hero** - Eye-catching headline with CTAs and trust badges
2. **Services** - 4 service cards (Same-day, Next-day, eCommerce, B2B)
3. **How It Works** - 4-step visual process flow
4. **Pricing** - 3 pricing tiers with feature comparison
5. **Tracking Widget** - Interactive parcel tracking with demo
6. **Testimonials** - Customer reviews and partner logos
7. **FAQ** - 10 common questions with accordion UI
8. **Quote Form** - Full pickup scheduling form with validation

### Performance & Accessibility
- Mobile-first responsive design (breakpoints: 480px, 768px, 1024px, 1280px)
- Semantic HTML5 elements
- Keyboard accessible navigation
- ARIA labels and focus states
- Lazy-loaded images with srcset
- Optimized color contrast (WCAG AA)

### Design System
- **Primary Color**: #ff7a00 (Orange)
- **Typography**: Geist Sans
- **Components**: Reusable, modular React components
- **Animations**: Subtle micro-interactions

## How to Run

### Development
```bash
npm run dev
```
Visit `http://localhost:3000` to see the landing page.

### Production Build
```bash
npm run build
npm start
```

## File Structure

```
src/
├── app/
│   ├── page.tsx                    # Main landing page
│   └── layout-metadata.tsx         # SEO metadata & structured data
├── components/
│   └── landing/
│       ├── navbar.tsx              # Navigation with mobile menu
│       ├── hero.tsx                # Hero section with CTAs
│       ├── services.tsx            # Service cards
│       ├── how-it-works.tsx        # Process steps
│       ├── pricing.tsx             # Pricing tiers
│       ├── tracking-widget.tsx     # Parcel tracking
│       ├── testimonials.tsx        # Reviews & partners
│       ├── faq.tsx                 # FAQ accordion
│       ├── quote-form.tsx          # Quote request modal
│       └── footer.tsx              # Footer with links
```

## Key Features

### Navigation
- Fixed navbar with smooth scrolling
- Hamburger menu for mobile
- "Get a Quote" CTA button
- Admin login link

### Quote Form
- Client-side validation
- Fields: name, phone, email, PIN codes, weight, address, date/time
- Business/Individual toggle
- Privacy notice
- Success/error states

### Tracking Widget
- Demo tracking with timeline
- Real-time status updates
- Visual progress indicators

### SEO Metadata
All pages include:
- Title: "Nationwide Courier — Fast, Reliable Courier Service Across India"
- Description: 160-character optimized meta description
- Keywords: courier service India, same day delivery, COD, etc.
- Canonical URL
- Robots meta (index, follow)

### Structured Data (JSON-LD)
```json
{
  "@type": "LocalBusiness",
  "name": "Nationwide Courier",
  "serviceType": ["Courier Service", "Same-Day Delivery", ...],
  "areaServed": "India",
  "aggregateRating": { "ratingValue": "4.8" }
}
```

## Customization

### Update Content
Edit the component files in `src/components/landing/` to modify:
- Headlines and copy
- Service descriptions
- Pricing plans
- FAQ questions
- Testimonials

### Update Branding
1. Replace logo in `navbar.tsx` and `footer.tsx`
2. Update colors in `src/app/globals.css`
3. Change images in hero and testimonials sections

### Update Contact Info
Edit `footer.tsx` for:
- Phone number
- Email address
- Office location
- Social media links

## Performance Optimization

### Images
- Use WebP format for better compression
- Add proper alt text for SEO
- Implement lazy loading
- Use responsive images with srcset

### Code Splitting
- Components are automatically code-split by Next.js
- Dynamic imports for heavy components (maps, charts)

### Fonts
- Geist Sans loaded with `display=swap`
- Minimal font weights to reduce payload

## Accessibility Checklist

- ✅ Semantic HTML (header, nav, main, section, footer)
- ✅ Keyboard navigation support
- ✅ ARIA labels on interactive elements
- ✅ Color contrast meets WCAG AA standards
- ✅ Focus indicators visible
- ✅ Form labels properly associated
- ✅ Alt text on all images

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements
- [ ] Add Google Maps integration for coverage area
- [ ] Implement actual tracking API
- [ ] Add live chat widget
- [ ] Integrate payment gateway for instant booking
- [ ] Add multi-language support (Hindi, regional languages)
- [ ] Implement rate calculator API

## License
Proprietary - Nationwide Courier Pvt. Ltd.

## Support
For technical support: support@nationwidecourier.in
For sales inquiries: sales@nationwidecourier.in
Toll-free: 1800-XXX-XXXX
