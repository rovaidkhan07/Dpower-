# Mobile storefront fixes

The existing Plus Jakarta Sans font and orange/black/off-white theme are preserved. Changes stay on fix/security-checkout-review-20261010; no main merge or production deployment is included.

- Compact text-first hero, bounded local artwork with CSS floating depth.
- Pointer-driven 3D card tilt using the existing framer-motion dependency. Touch pointers do not tilt; reduced-motion preference disables tilt and floating animation.
- Promo cards and feature banners reserve separate image/text columns. Local category artwork and real category links replace unrelated stock photos and hardcoded discount, warranty, product name, dollar price and countdown claims.
- Two-column mobile product/category grids replace clipped horizontal strips; price rows wrap and cart controls fit narrow cards.
- Mobile WhatsApp Help lives in the bottom navigation instead of floating over product controls; the bar includes iOS safe-area padding. Desktop retains floating WhatsApp.
- Product image failures show a branded placeholder; artificial homepage loading delay is removed.

Verification completed: TSX parsing, CSS/motion and accessibility review. Full Next.js build, lint, live preview and browser viewport verification require the full repository dependencies and deployment access, and have not passed in this workspace.

Before release, test widths 320, 375, 390, 430, 768 and 1280px in light/dark modes. Check long product names/prices, empty categories, broken images, stock states, cart updates and the WhatsApp destination. Check keyboard focus and reduced-motion mode; on desktop move the pointer over cards and confirm they reset on exit. On iPhone check safe-area spacing and the fixed navigation with browser bars visible.
