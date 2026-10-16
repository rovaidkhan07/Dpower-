# DK Power — Visual and Frontend UX Audit & Implementation Plan

**Auditor:** Senior Frontend Engineer & UI/UX Specialist  
**Project:** DK Power (Wholesale Mobile Accessories in Pakistan)  
**Date:** October 16, 2026  
**Status:** Audit & Plan Completed — Awaiting User Approval  

---

## 1. Executive Summary

A comprehensive visual, responsive, and functional UX audit of the **DK Power** storefront was conducted using real browser inspection across 9 distinct viewport widths (320px to 1440px), inspecting the homepage, header, search, hero carousel, category cards, product grids, product detail pages (PDP), cart flyout, checkout entry flow, inner content pages, and mobile navigation.

### Current State
While the platform has a robust Next.js 16.3 / React 19 / Tailwind CSS architectural foundation and snappy page transitions, it currently suffers from severe branding disconnects, critical mobile UX blockers, broken UI components, and inconsistent design tokens. 

### Core Themes of Dysfunction
1. **Brand Identity Contamination:** The application was evidently branched or forked from another project named *"Kharidly"*. Leftover brand strings appear prominently on the live checkout page (*"Have a Kharidly account?"*), product card image fallbacks (*"Kharidly Image coming soon"*), customer reviews (*"Customer Voices on Kharidly"*), about/policy pages, and OpenGraph metadata. In addition, hardcoded bright orange (`#FF6B00` / `orange-600`) is splattered across product cards, filters, and PDP tabs, directly clashing with DK Power’s official visual identity of **Red (`#d71920`), Black (`#0a0a0a`), White, Charcoal, and Silver accents**.
2. **Critical Mobile Interactive Obstruction:** On mobile devices (320px–430px), the floating WhatsApp widget (`fixed bottom-20 right-4`) sits directly on top of the primary *"Add to Cart"* CTA on Product Detail Pages, blocks the *"Shop Power Banks"* category button on the homepage, and hovers over checkout buttons. Furthermore, WhatsApp is *already* present as a permanent tab in the bottom navigation bar, making the floating pill redundant and destructive to conversions.
3. **Broken Component Rendering:** In the shopping cart drawer, the *"You may also like"* recommendations attempt to pass raw image objects (`p.images[0]`) into Next.js `<Image>`, rendering three broken `[object Object]` image placeholders. The free shipping threshold bar is also clipped behind the fixed drawer footer.
4. **Layout Collapse & Empty Space:** The homepage featured products section strictly filters by active category slugs, resulting in only 1 product being rendered. The component defaults to centering a single card in a 1280px width container, creating vast, unbalanced empty whitespace that looks unfinished.
5. **Mobile Viewport Squeezing:** On mobile, a combination of a fixed search/header (135px tall), a bottom navigation bar (56px tall), a floating WhatsApp button, and an aggressive `pb-44` (176px) bottom main container margin creates a cramped, disjointed viewing experience with an unnecessary giant gap before the footer.

---

## 2. Current Strengths

1. **Crisp Official DK Power Logo & Top Bar:** The oval DK Power logo in the header and the dark red announcement bar (*"Wholesale supply for retailers & resellers"*) establish immediate brand legitimacy on desktop.
2. **Fast Client-Side Routing:** Next.js App Router and Turbopack deliver near-instantaneous page transitions with smooth loading states.
3. **Clean Checkout Form Architecture:** The two-column checkout layout on desktop is logical, with a structured address form, Pakistani city quick-selector (Karachi, Lahore, Islamabad, etc.), Cash on Delivery vs. Bank Transfer toggle with one-click IBAN copy, and clear line items.
4. **Dark Mode Integration:** The system has functional dark mode tokens and a header toggle that inverts backgrounds gracefully to sleek charcoal `#0b0b0c` / `#151516`.
5. **Robust Trust Features & B2B Messaging:** The *"Built for Repeat Trade Orders"* section, wholesale value propositions, and trade inquiry banners effectively communicate the platform's B2B wholesale mission.
6. **Cart State Management:** The custom Zustand/React context cart hook handles quantities, item removal, and persistent local storage reliably.

---

## 3. Critical Problems

These issues represent immediate conversion barriers or severe brand defects that require urgent remediation:

1. **Mobile WhatsApp Floating Button Blocks Primary "Add to Cart" CTA [Critical / P0]**  
   On mobile PDP viewports (375px, 390px, 430px), `WhatsAppFloatingButton` (`fixed bottom-20 right-4`) floats directly over the right half of the red *"Add to Cart"* button. Tapping the button frequently launches WhatsApp instead of adding the product to cart.
2. **Leftover "Kharidly" Brand Strings on Checkout, PDP, and Policies [High / P0]**  
   The checkout form explicitly displays *"Have a Kharidly account? Sign In ->"*. Fallback product images display *"Kharidly"*. Customer reviews display *"Customer Voices on Kharidly"*. The About page tells the story of *"Kharidly"*. Meta titles across the store display `| Kharidly`.
3. **Broken Image Placeholders in Cart Drawer Recommendations [High / P0]**  
   In `src/components/cart/cart-drawer.tsx`, `p.images[0]` is an object (`{ imageUrl: string }`), but is passed directly as a string into `<Image src={...} />`, creating three broken image boxes with browser missing-image glyphs in the "You may also like" tray.
4. **Homepage Featured Products Grid Collapse to Single Lonely Card [High / P0]**  
   On desktop (1440px/1280px), the "Featured Products" section shows a single product card centered in the middle of a massive 1280px white container with huge blank areas on both flanks because the filter strictly matches category slugs where only one item exists.
5. **Hardcoded Orange Clashing with DK Power Red Brand Identity [Medium / P1]**  
   Throughout `product-filters.tsx`, `product-card.tsx`, `product-detail-view.tsx`, and `contact/page.tsx`, hardcoded orange (`#FF6B00`, `text-orange-600`, `border-orange-600`, `bg-[#ea580c]`) is used for the active category filter, quick-add cart button, trust icons, and specs tab borders, directly conflicting with DK Power's red/black identity.
6. **Triple Redundant Category Navigation in Header [Medium / P1]**  
   The desktop navbar displays: (1) a red *"Wholesale Categories"* dropdown button, (2) a *"Wholesale Catalog"* link, and (3) a *"Categories"* link side-by-side within a 250px span, creating visual redundancy and user confusion.
7. **Hero Banner Text Baked into Raster Images Scaling Down to Illegibility [Medium / P1]**  
   The hero carousel uses static JPGs with all copy, feature pills ("65W GaN Technology"), and "Shop Now ->" buttons pre-rendered into the pixel data. At 16:9 aspect ratio on mobile screens (320px–375px), this text shrinks to sub-8px unreadable pixelation.
8. **Triple-Stacked Mobile Bottom Bars on PDP [High / P1]**  
   On mobile PDPs scrolled past 800px, three separate floating elements stack simultaneously: the 56px bottom navigation bar, the sticky Add-to-Cart bar at `bottom-16`, and the WhatsApp pill at `bottom-20`, consuming over 30% of the screen height.
9. **Extreme Main Container Bottom Padding (`pb-44` / 176px) on Mobile [Medium / P2]**  
   `src/app/(store)/layout.tsx` hardcodes `<main className="flex-1 pb-44 lg:pb-0">`, leaving a massive 176px blank void between the content and the footer on all mobile screens.
10. **Cart Drawer Free Delivery Threshold Clipped Under Sticky Footer [Low / P2]**  
    In `CartDrawer`, the text *"Add Rs. X more for FREE delivery"* sits at the bottom of the scroll container without sufficient padding, resulting in it being half-hidden under the fixed "Continue Shopping" / "Checkout" button container.

---

## 4. Desktop UI Findings (1280px – 1440px)

1. **Header & Utility Bar:**
   - The top utility bar (`bg-primary text-white`) is clean and informative, but its links ("Dispatch Information", "Trade Support", "FAQs") have no hover underline animation.
   - The main search bar is nicely styled with a rounded pill and red Search button, but lacks a quick-clear "X" icon when query text is typed.
   - The cart button is labeled *"Order List"* with a shopping cart icon. For an e-commerce/wholesale site, *"Cart"* or *"Order List (X)"* with a persistent counter badge is clearer. Currently the count badge only appears when `cartCount > 0`.
2. **Hero Carousel:**
   - The hero banner is wrapped in `max-w-[1280px]` within a `bg-black` container. On wide 1440px+ monitors, there are large black borders on either side of the banner.
   - Previous/Next navigation arrow circles sit right on the left and right edges.
   - The slide indicators (dots) sit below the banner inside the black section, creating a sliver of black before the white category section begins.
3. **Category Cards:**
   - A 4-column grid displaying Chargers, Cables, Earbuds, and Power Banks.
   - The black pill buttons (*"Shop Chargers ->"*, *"Shop Cables ->"*) are visually heavy and repetitive across all 4 cards.
4. **Featured Products Section:**
   - Shows "Featured Products" heading with "View All ->".
   - Because only one active-category product is returned, the section renders a single card centered in the middle of 1280px. This looks broken to wholesale buyers expecting a full catalog shelf.
5. **Trade Buyers Banner (VIP Banner):**
   - The red gradient banner (*"Need stock for your shop or reseller business?"*) is high-impact and well-branded.
   - However, when scrolling past, the sticky header overlaps the top edge of this banner without sufficient breathing room.
6. **Footer:**
   - 4-column layout is well structured.
   - The floating WhatsApp button hovers over the 4th column ("Trade Account / Contact"), partially covering the Contact button.

---

## 5. Mobile UI Findings (320px, 360px, 375px, 390px, 430px)

1. **Viewport 320px (iPhone SE 1st gen / narrowest):**
   - No horizontal overflow detected (`document.documentElement.scrollWidth === 320`).
   - The mobile search bar in the header occupies significant vertical height (header is 135px tall).
   - The floating WhatsApp button occupies nearly 50% of the screen width in the bottom right corner, dominating the screen.
   - The "Home" label in the bottom nav bar is partially occluded by the Next.js dev indicator badge in development mode.
2. **Viewport 360px – 375px (Galaxy S / iPhone Mini & Standard):**
   - Category cards collapse to a 2-column grid. The black pill buttons take up nearly half of each card's height.
   - The 4th category card ("Power Banks") has its CTA button directly covered by the floating WhatsApp button.
   - The single featured product card is centered, but leaves large vertical empty spaces.
3. **Viewport 390px – 430px (iPhone 14/15/16 Pro & Pro Max):**
   - Typography scales reasonably well, but the baked-in banner text remains low contrast and blurry compared to native HTML text.
   - On the Product Detail Page, the floating WhatsApp button hovers directly over the right side of the red *"Add to Cart"* button.
   - When the user scrolls past 800px on PDP, the sticky mobile add-to-cart bar pops up at `bottom-16` while the bottom nav sits at `bottom-0` and WhatsApp sits at `bottom-20`, creating a confusing multi-layered floating stack.
4. **Mobile Navigation Drawer:**
   - Clean slide-in animation from the left.
   - Features category links and trade links.
   - Missing direct quick-contact actions (e.g., tap-to-call, WhatsApp direct button inside the menu).

---

## 6. Hero / Carousel Findings

| Item | Finding | Assessment | Recommended Action |
|------|---------|------------|--------------------|
| **Text Rendering** | All headlines, subheadings, specs, and CTAs are rasterized directly into the `.jpg` banner files. | **Poor responsive behavior.** Text scales down on mobile and becomes illegible. Cannot be selected or translated. | Retain high-resolution product imagery as backgrounds or split-layouts; overlay semantic HTML typography and real accessible buttons on top. |
| **Duplicate Buttons** | The JPG image has a drawn "Shop Now ->" button, and the entire slide is wrapped in a `<Link>`. | **Misleading micro-interaction.** Clicking the drawn button does not show a button press state; it behaves like clicking a background image. | Implement real interactive `<Button>` with hover, active, and focus rings. |
| **Mobile Aspect Ratio** | Fixed `aspectRatio: "16/9"` on all screens. | **Excessive vertical compression.** At 375px width, the banner is only 210px high. At 320px width, it is 180px high. | Use a responsive aspect ratio: `aspect-[16/9]` on desktop/tablet, `aspect-[4/3]` or `aspect-[1/1]` on mobile for better vertical presence. |
| **Navigation Arrows** | Desktop arrows sit at `left-6 lg:left-8` and `right-6 lg:right-8`. | **Good desktop positioning**, hidden on mobile. | Keep arrows inside the container with high-contrast semi-transparent backdrop. |
| **Slide Indicators** | 4 dots positioned below the banner image in the black strip. | **Functional**, but creates a separated dark bar below the banner. | Overlay pagination pills directly onto the bottom of the slide with subtle glassmorphic backdrop. |
| **Autoplay Timing** | Auto-advances every 5,500ms; pauses on hover and focus. | **Optimal duration**, good reduced-motion support. | Add an accessible Play/Pause toggle for full WCAG 2.2.2 compliance. |

---

## 7. Header / Navigation Findings

1. **Top Utility Bar:**
   - Background `#d71920` (DK Power Primary Red) is bold and clear.
   - Spacing is clean.
   - Links should include subtle hover underlines and active focus outlines.
2. **Main Header:**
   - DK Power logo is sharp and prominently displayed.
   - Desktop search bar is well-proportioned, but typing a query and submitting redirects to `/shop?search=...` without an instant live autocomplete dropdown. Adding a lightweight live search dropdown would greatly improve product discovery.
   - The Cart button currently shows *"Order List"*. In Pakistan B2B trade, *"Wholesale Order"* or *"Cart (X)"* is standard.
3. **Category Navigation Bar:**
   - Red button: *"Wholesale Categories"* with dropdown menu.
   - Adjacent links: *"Wholesale Catalog"*, *"Categories"*, *"About DK Power"*, *"Bulk Inquiry"*, and on the right *"Track Order"*.
   - **Problem:** Having both *"Wholesale Categories"* (button), *"Wholesale Catalog"* (link), and *"Categories"* (link) creates 3 links to the same destination within a few inches.
   - **Solution:** Streamline to:
     - `[Wholesale Categories Dropdown]`
     - `Wholesale Catalog` (All products)
     - `Bulk Inquiry`
     - `About DK Power`
     - `Track Order` (Right aligned)
     *(Remove the redundant standalone "Categories" link).*

---

## 8. Categories Findings

1. **Homepage Category Cards:**
   - 4 cards displayed: Chargers, Cables, Earbuds, Power Banks.
   - Images are clean cutouts with white/neutral backgrounds.
   - The black pill buttons (*"Shop Chargers ->"*, etc.) are repetitive. A cleaner card hover interaction (elevating the card, displaying a subtle red arrow) gives a much more premium, modern e-commerce aesthetic.
2. **Dedicated Categories Page (`/categories`):**
   - Header title is clear: *"Explore All Categories"*.
   - Displays 4 active categories.
   - **Critical Data Bug:** The category image for *"Cables & Fast Charging"* is a photo of a **Dell Laptop computer**!
   - The product counts for all 4 categories display *"1 Product"*.
   - Needs proper high-quality cable photography and dynamic product counts.

---

## 9. Product Card / Product Grid Findings

1. **Brand Color Disconnect:**
   - In `src/components/product/product-card.tsx` line 140, the quick-add cart button has `bg-[#FF6B00]` (hardcoded bright orange).
   - In the standard card variant (line 224), the button uses `bg-gradient-to-r from-brand to-accent` with `hover:to-[#c2410c] hover:shadow-orange-500/25`.
   - **Fix:** Align strictly to DK Power Red (`#d71920` / `#b51218`) with charcoal/black accents.
2. **Leftover "Kharidly" Text:**
   - In `product-card.tsx` line 179:
     ```tsx
     <span className="text-xs font-semibold">Kharidly</span>
     <span className="text-[10px]">Image coming soon</span>
     ```
   - Must be updated to:
     ```tsx
     <span className="text-xs font-semibold">DK Power</span>
     ```
3. **Pricing Hierarchy:**
   - Currently shows Retail Price / Sale Price.
   - For a B2B wholesale platform, the card should clearly emphasize wholesale availability (e.g., *"Wholesale MOQ: 5 pcs"* or *"Trade Price from Rs. X"*).
4. **Card Visual Polish:**
   - Aspect ratio is square (`aspect-square`), which works well for mobile accessories.
   - Product titles have `line-clamp-2 min-h-[2.5rem]`, maintaining uniform card heights across uneven title lengths.

---

## 10. Product Detail Findings (PDP)

1. **Mobile CTA Obstruction:**
   - The floating WhatsApp button covers the right portion of the red *"Add to Cart"* button on screens between 360px and 430px wide.
2. **Wrong Product Image Mapping:**
   - Visiting `/products/baseus-tungsten-gold-3-in-1-fast-charging-cable` displays a photo of a **Dell laptop screen** instead of a 3-in-1 cable!
   - Visiting `/products/3-in-1-foldable-magsafe-wireless-charging-stand` displays a photo of an **office desk with a MacBook Pro**!
   - High-quality, verified mobile accessory product images must be mapped.
3. **Orange Accents in PDP:**
   - In `product-detail-view.tsx`, the trust badge icons (Nationwide COD Delivery, 100% Genuine, 7-Day Replacement, Verified Packaging) are colored `text-orange-600`.
   - The active tab indicator (*"Product Description"*, *"Technical Specifications"*, *"Delivery & Returns"*) is colored `border-orange-600 text-orange-600`.
   - The *"Explore All"* link in Related Products is `text-orange-600`.
   - All must be switched to DK Power Red (`#d71920`).
4. **Wholesale Information Gap:**
   - The PDP currently looks like a standard retail B2C page (Single Qty, Buy Now with Cash on Delivery).
   - Should feature a prominent **Wholesale / Bulk Inquiry badge** and clear MOQ tier details so trade customers understand reseller pricing.

---

## 11. Cart / Checkout UI Findings

1. **Cart Drawer Broken Recommendations:**
   - The cross-sell recommendations tray at the bottom of `CartDrawer` renders 3 broken image boxes.
   - Root cause: `p.images[0]` is an object (`{ imageUrl: string }`) returned from `/api/products`. The code attempts to pass the object directly into `<Image src={...}>`.
   - Fix: Extract `p.images[0]?.imageUrl || p.imageUrl`.
2. **Free Delivery Text Clipping:**
   - The message *"Add Rs. X more for FREE delivery"* is positioned at the very bottom of the scrollable list without adequate bottom padding, causing it to be partially obscured behind the fixed "Continue Shopping" / "Checkout" buttons.
3. **Checkout Brand Name Violation:**
   - Under Delivery Address, the account banner states:
     ```html
     Have a Kharidly account? SIGN IN ->
     ```
   - Must be changed to:
     ```html
     Have a DK Power Trade account? SIGN IN ->
     ```
4. **Checkout Form Polish:**
   - The checkout form is otherwise well-organized. Form validation gives red outlines on touched errors, city selector provides major Pakistani cities with instant delivery notes for Karachi, and bank transfer displays complete Meezan Bank account details with one-click copy.
   - The floating WhatsApp button hovers right beside the "Complete Order" button on mobile, risking accidental taps.

---

## 12. Footer Findings

1. **Value Proposition Row:**
   - 4 trust items: Wholesale Focus, Bulk Ordering, Secure Checkout, Order Tracking.
   - Clean, dark background (`#1a1a1c`) with red icon boxes.
2. **Column Structure:**
   - Col 1: DK Power logo + brand description.
   - Col 2: Wholesale navigation links.
   - Col 3: Customer Support links.
   - Col 4: Trade Account info with "Trade Login" and "Contact" buttons.
3. **Floating WhatsApp Button Clashing with Footer:**
   - On desktop and tablet, the WhatsApp button hovers over the 4th column.
   - On mobile, `pb-44` on `<main>` leaves a 176px gap above the footer, while `MobileBottomNav` covers the bottom copyright bar unless scrolled to the very end.
   - **Fix:** Adjust mobile padding to `pb-16` (just enough to clear the 56px bottom nav) and give the footer its own `pb-20` on mobile.

---

## 13. Branding Consistency Findings

| Element | Reference DK Power Brand | Current Website Implementation | Status |
|---------|--------------------------|--------------------------------|--------|
| **Primary Color** | Crimson Red (`#d71920` / `#b51218`) | Red used in top bar and header; **Orange (`#FF6B00`)** used in filters, cards, and PDP tabs. | ❌ Inconsistent |
| **Dark Accents** | Deep Black (`#0a0a0a`), Charcoal (`#151516`) | Properly used in dark mode and footer. |  Consistent |
| **Neutral Tones** | Clean white (`#ffffff`), Slate-50, Silver borders | Properly configured in `globals.css` base tokens. |  Consistent |
| **Brand Name** | **DK Power** | Multiple occurrences of **Kharidly** in checkout, product cards, reviews, about, policies, and meta tags. | ❌ CRITICAL BUG |
| **B2B Tone** | Wholesale, trade supply, reseller stock, MOQs | Mixed B2B and B2C messaging (e.g., "Buy Now - Fast Cash on Delivery" single-item focus). | ⚠️ Needs Refinement |
| **Typography** | Inter / Outfit modern sans-serif | Implemented via Next.js Geist / Sans font tokens. Clean and readable. |  Consistent |

---

## 14. Accessibility Findings (WCAG 2.1 AA)

1. **Color Contrast:**
   - Light grey secondary text (`#9AA1AD`, `text-slate-400` on white) falls below the 4.5:1 contrast ratio requirement. Should be tightened to `text-zinc-600` in light mode.
   - Red button text with white typography (`#d71920` on white text) passes contrast at 4.6:1.
2. **Mobile Tap Targets:**
   - In `CategoryGrid`, the black buttons have touch targets under 36px in height.
   - In `CartDrawer`, the quantity `+` / `-` buttons are 32x32px, which is below the recommended 44x44px minimum for touch interfaces.
3. **Screen Reader & Keyboard Navigation:**
   - The hero carousel lacks an accessible Play/Pause button for screen readers.
   - Focus rings (`focus-visible:ring-2 focus-visible:ring-primary`) are present on header links, but missing on category filter pills and mobile bottom navigation icons.
4. **Form Accessibility:**
   - Checkout input fields have proper `label` associations and `required` markers.
   - Validation errors have `role="alert"` and clear error messages.

---

## 15. Performance & Frontend Quality Findings

1. **Image Asset Optimization:**
   - Hero banner images are served from `/banners/*.jpg`. They average 300KB–600KB each. Converting to optimized WebP / AVIF with Next.js image optimizer will reduce page weight significantly.
   - Broken image URLs in cart recommendations trigger runtime failed requests.
2. **Next.js Dev Overlay Warnings:**
   - The browser audit captured active Next.js dev overlay badges indicating 2 runtime warnings (including deprecated middleware usage: `The "middleware" file convention is deprecated. Please use "proxy" instead`).
3. **Layout Shift (CLS):**
   - The hero carousel initializes with `aspect-ratio: 16/9`, which prevents major layout shifts on page load.
   - The category grid has fixed aspect containers for images.
4. **Hydration:**
   - Theme toggle handles `localStorage` inside `useEffect`, preventing React hydration mismatch errors.

---

## 16. Severity + Priority Matrix

| ID | Issue | Area | Severity | Priority | Impact | Recommended Fix |
|----|-------|------|----------|----------|--------|-----------------|
| **SEC-01** | Floating WhatsApp button covers mobile "Add to Cart" button | PDP / Mobile | **Critical** | **P0** | Users cannot add products to cart on mobile; accidental WhatsApp launches. | Hide floating WhatsApp on PDP or dock it cleanly; rely on mobile bottom nav WhatsApp tab. |
| **SEC-02** | Leftover "Kharidly" text on Checkout, PDP fallback, Reviews, Policies, and Meta tags | Global Storefront | **High** | **P0** | Severe customer trust destruction; confusion about company identity. | Replace all occurrences of "Kharidly" with "DK Power" or dynamic store name across all files. |
| **SEC-03** | Broken image placeholders (`[object Object]`) in Cart Drawer recommendations | Cart Drawer | **High** | **P0** | Ugly broken image icons inside the cart flyout, damaging perceived polish. | Correct image property access from `p.images[0]` to `p.images[0]?.imageUrl || p.imageUrl`. |
| **SEC-04** | Featured Products grid collapses to a single lonely centered card on homepage | Homepage | **High** | **P0** | Massive empty white space; website looks unfinished and catalog looks empty. | Display a balanced multi-product grid from active catalog items or fallback to trending products. |
| **SEC-05** | Hardcoded Orange (`#FF6B00`) clashing with DK Power Red Brand Identity | Cards, Filters, PDP, Contact | **Medium** | **P1** | Brand identity dissonance; website looks like a mixture of two unrelated themes. | Replace all hardcoded `#FF6B00` / `orange-600` with design tokens (`var(--primary)` / `var(--accent)`). |
| **SEC-06** | Hero banner raster text scales down to illegible sub-8px text on mobile | Hero Carousel | **Medium** | **P1** | Mobile visitors cannot read promotions, specs, or CTA buttons on banners. | Use responsive aspect ratio (`aspect-[4/3]` on mobile) or HTML text overlays. |
| **SEC-07** | Triple-stacked floating bars on mobile PDP (Bottom Nav + Sticky Bar + WhatsApp) | Mobile PDP | **High** | **P1** | Over 30% of mobile viewport obscured; interactive conflict between buttons. | Consolidate sticky PDP actions cleanly into the bottom layout without overlapping WhatsApp. |
| **SEC-08** | Redundant triple category links in desktop navbar | Header / Navigation | **Medium** | **P1** | Cluttered navigation; user confusion about which link to click. | Remove redundant standalone "Categories" link; keep "Wholesale Categories" dropdown + "Wholesale Catalog". |
| **SEC-09** | Massive `pb-44` (176px) blank space at the bottom of all mobile pages | Store Layout | **Medium** | **P2** | Jarring empty void between content and footer on all mobile screens. | Reduce `<main>` bottom padding to `pb-16 lg:pb-0` and add proper footer mobile padding. |
| **SEC-10** | Cart Drawer free delivery threshold text clipped under sticky footer | Cart Drawer | **Low** | **P2** | Incomplete text visibility at the bottom of the cart drawer. | Add `pb-6` to the scrollable cart body container so all text clears the footer buttons. |
| **SEC-11** | Dell laptop image displayed for "Cables & Fast Charging" category and PDP | Catalog / PDP | **High** | **P2** | Ridiculous product mismatch; cable product displays computer screen. | Map authentic, high-resolution mobile accessory images to cables, chargers, and stands. |
| **SEC-12** | Contact page header title obscured behind fixed header | Contact Page | **Medium** | **P2** | Page heading cut off on initial load. | Ensure consistent top padding / scroll margin across all inner page heroes. |
| **SEC-13** | Lack of clear B2B wholesale pricing / MOQ indicators on product cards | Product Experience | **Medium** | **P2** | Misses opportunity to establish DK Power as a dedicated wholesale supplier. | Add wholesale badges (e.g. "Wholesale Ready", "Bulk Tier Available", "MOQ: 5 pcs"). |
| **SEC-14** | Missing Play/Pause control on auto-advancing Hero Carousel | Accessibility | **Low** | **P3** | Violates WCAG 2.2.2 requirements for moving/auto-updating content. | Add an accessible toggle button to pause/resume hero autoplay. |
| **SEC-15** | Touch targets on mobile card buttons and cart remove buttons below 44px | Accessibility | **Low** | **P3** | Difficult for users with larger fingers to tap accurately. | Expand hit areas (`p-2` or `min-h-[44px]`) on interactive buttons. |

---

## 17. Implementation Plan

### Phase 1 — Immediate UI Cleanup & Brand Restoration
- **What to change:**
  1. Remove all leftover *"Kharidly"* references across the application (checkout prompt, product card fallback, customer reviews, about page, refund/warranty policies, contact page, and page metadata titles/descriptions).
  2. Fix the broken recommendation image bug in `CartDrawer` (`src/components/cart/cart-drawer.tsx`) by safely extracting the image URL string.
  3. Fix the clipped free delivery progress text in `CartDrawer` by adding bottom clearance padding.
  4. Fix mobile WhatsApp button overlap: suppress the floating WhatsApp button on PDP when sticky CTA is active, or adjust its position so it never covers *"Add to Cart"* or checkout CTAs.
- **Affected Components/Pages:**
  - `src/components/checkout/checkout-view.tsx`
  - `src/components/cart/cart-drawer.tsx`
  - `src/components/product/product-card.tsx`
  - `src/components/storefront/customer-reviews.tsx`
  - `src/components/storefront/whatsapp-button.tsx`
  - `src/app/(store)/about/page.tsx`
  - `src/app/(store)/contact/page.tsx`
  - `src/app/(store)/faq/page.tsx`
  - `src/app/(store)/refund-policy/page.tsx`
  - `src/app/(store)/warranty-policy/page.tsx`
- **Expected Result:** Zero mention of Kharidly anywhere on the site; cart drawer renders crisp product images with no broken boxes; WhatsApp button no longer obstructs any purchase button.
- **Risk:** Minimal. Text and styling corrections only. No backend changes.
- **How to verify:** Inspect in browser at 375px and 1440px. Open cart drawer, view recommendations, navigate to checkout, check all headings and labels.

### Phase 2 — Brand Color Alignment & Spacing Normalization
- **What to change:**
  1. Eliminate all rogue orange instances (`#FF6B00`, `orange-600`, `text-orange-600`, `border-orange-600`) in:
     - `product-filters.tsx` (Category pills, price filter inputs, submit buttons)
     - `product-card.tsx` (Compact card quick-add button, hover effects)
     - `product-detail-view.tsx` (Trust badge icons, specs tab borders, related links)
     - `contact/page.tsx` (Channel icon backgrounds)
  2. Standardize all primary action colors to DK Power Red (`#d71920` / `#b51218`) and Charcoal/Black tokens.
  3. Fix the excessive `pb-44` (176px) margin on `<main>` in `src/app/(store)/layout.tsx` to `pb-16 lg:pb-0`.
- **Affected Components/Pages:**
  - `src/components/product/product-filters.tsx`
  - `src/components/product/product-card.tsx`
  - `src/components/product/product-detail-view.tsx`
  - `src/app/(store)/layout.tsx`
  - `src/app/(store)/contact/page.tsx`
- **Expected Result:** Cohesive, premium DK Power brand identity with red, black, charcoal, and white. Clean vertical rhythm on mobile without empty chasms.
- **Risk:** Low. CSS token updates.
- **How to verify:** Open `/shop`, `/products/[slug]`, and `/contact`. Verify all buttons, tabs, and filter pills match DK Power red.

### Phase 3 — Hero Banner & Header Navigation Polish
- **What to change:**
  1. Streamline the desktop navigation: eliminate the redundant standalone *"Categories"* link; maintain *"Wholesale Categories"* (dropdown) and *"Wholesale Catalog"*.
  2. Adjust mobile hero carousel aspect ratio to prevent severe vertical squishing on narrow devices (`aspect-[4/3]` on mobile screens below 640px).
  3. Add an accessible Play/Pause toggle to the hero carousel.
  4. Ensure fixed header offset (`pt-[135px]` or `h-[135px]`) properly offsets all inner page heroes (preventing clipped headings on `/contact` and `/about`).
- **Affected Components/Pages:**
  - `src/components/storefront/header.tsx`
  - `src/components/storefront/hero-banner.tsx`
  - `src/app/(store)/contact/page.tsx`
  - `src/app/(store)/about/page.tsx`
- **Expected Result:** Uncluttered, intuitive navigation. Hero images look impactful and legible on mobile. No headers cut off behind navigation.
- **Risk:** Low. Layout and component options.
- **How to verify:** Test navigation bar on 1440px desktop, test hero on 320px, 375px, and 768px viewports.

### Phase 4 — Product Experience & Catalog Grid Balance
- **What to change:**
  1. Resolve the single-product featured section collapse: update `TrendingSection` / `page.tsx` to ensure that if only 1 featured product is in a category, it displays a balanced row of 4 products (by pulling in active items or showing best-sellers) rather than isolating a lone card in a 1280px void.
  2. Replace mismatched images (e.g., laptop image for Baseus 3-in-1 cable, desk photo for MagSafe stand) with authentic mobile accessory imagery.
  3. Enrich product cards and PDP with wholesale trust accents (e.g., *"Wholesale Stock Ready"*, MOQ badges).
  4. Modernize category cards on the homepage: remove heavy black pill buttons in favor of sleek card-level hover animations.
- **Affected Components/Pages:**
  - `src/components/storefront/trending-section.tsx`
  - `src/components/storefront/category-grid.tsx`
  - `src/components/product/product-card.tsx`
  - `src/components/product/product-detail-view.tsx`
  - `src/app/(store)/page.tsx`
- **Expected Result:** Homepage looks like a thriving, well-stocked wholesale electronics portal with balanced product shelves and accurate product imagery.
- **Risk:** Medium. Requires careful handling of product filtering to preserve category integrity without inventing products.
- **How to verify:** Inspect homepage at 1440px, 1024px, 768px, and 375px.

### Phase 5 — Mobile UX & Accessibility Hardening
- **What to change:**
  1. Resolve the triple-stacked floating bottom bars on PDP: integrate the sticky Add-to-Cart bar cleanly with the bottom navigation without overlapping.
  2. Enforce minimum 44x44px touch targets on mobile interactive elements (quantity buttons, remove buttons, filter triggers).
  3. Add visible focus states for keyboard navigation across all buttons and inputs.
  4. Ensure all images have descriptive `alt` tags and proper semantic headings (`h1` -> `h2` -> `h3`).
- **Affected Components/Pages:**
  - `src/components/product/product-detail-view.tsx`
  - `src/components/storefront/mobile-bottom-nav.tsx`
  - `src/components/cart/cart-drawer.tsx`
- **Expected Result:** Smooth mobile checkout experience with effortless one-thumb operation and full WCAG 2.1 AA accessibility compliance.
- **Risk:** Low.
- **How to verify:** Run Chrome accessibility audit / Lighthouse and perform manual keyboard tab-navigation test.

### Phase 6 — Performance Optimization & Final Polish
- **What to change:**
  1. Audit image sizes in hero carousel and category cards; ensure Next.js `sizes` attributes are precisely matched to viewport breakpoints to avoid downloading oversized images.
  2. Eliminate unused or redundant code in storefront components.
  3. Address Next.js dev overlay warnings.
- **Affected Components/Pages:**
  - `src/components/storefront/hero-banner.tsx`
  - `src/components/storefront/category-grid.tsx`
- **Expected Result:** 95+ Lighthouse performance and accessibility scores; instant visual responses.
- **Risk:** Very low.
- **How to verify:** Run build check and performance profiling.

---

## 18. File-Level Change Plan

| File Path | Component Purpose | Planned Changes (Pending Approval) |
|-----------|-------------------|-----------------------------------|
| `src/components/checkout/checkout-view.tsx` | Checkout flow & address forms | Replace `"Have a Kharidly account?"` with `"Have a DK Power Trade account?"`. |
| `src/components/cart/cart-drawer.tsx` | Slide-out cart flyout | Fix recommendation image bug (`p.images[0]?.imageUrl`); add bottom clearance padding to free shipping text; standardize colors. |
| `src/components/product/product-card.tsx` | Product grid item | Replace Kharidly fallback text with DK Power; replace hardcoded `#FF6B00` with primary brand red token; refine B2B wholesale indicators. |
| `src/components/product/product-filters.tsx` | Catalog sidebar filters | Replace all hardcoded `#FF6B00` (orange) backgrounds and borders with DK Power Red (`#d71920`); improve focus states. |
| `src/components/product/product-detail-view.tsx` | Product page view | Replace orange trust icons and tab borders with brand red; fix mobile sticky bar z-index and spacing so it doesn't collide with WhatsApp. |
| `src/components/storefront/whatsapp-button.tsx` | Floating support widget | Hide or reposition on mobile PDP/checkout when sticky CTA bars are active to prevent blocking purchase buttons. |
| `src/components/storefront/header.tsx` | Main navigation & search | Remove redundant "Categories" link; streamline wholesale catalog links; refine mobile header height. |
| `src/components/storefront/trending-section.tsx` | Homepage featured products | Fix grid layout collapse when product count is low; ensure balanced 4-column desktop display. |
| `src/components/storefront/category-grid.tsx` | Homepage category links | Modernize card styling; remove heavy black button pills in favor of sleek card hover animations. |
| `src/components/storefront/customer-reviews.tsx` | Social proof testimonial block | Replace `"Customer Voices on Kharidly"` with `"Customer Voices on DK Power"`. |
| `src/app/(store)/layout.tsx` | Store layout shell | Fix excessive `pb-44` bottom padding on mobile `<main>` to `pb-16 lg:pb-0`. |
| `src/app/(store)/about/page.tsx` | About page | Replace Kharidly company story with DK Power wholesale narrative; replace orange badges with brand red. |
| `src/app/(store)/contact/page.tsx` | Contact page | Fix hero clipping under fixed header; replace orange accents with brand red; update meta title. |
| `src/app/(store)/faq/page.tsx` | FAQs page | Replace Kharidly text with DK Power throughout answers; update meta title. |
| `src/app/(store)/refund-policy/page.tsx` | Refund policy page | Replace Kharidly text with DK Power; update meta title. |
| `src/app/(store)/warranty-policy/page.tsx` | Warranty policy page | Replace Kharidly text with DK Power; update meta title. |

---

## 19. Regression Checklist

Use this checklist during and after implementation to guarantee zero functional regressions:

- [ ] **Homepage:**
  - [ ] Hero carousel auto-plays, pauses on hover, and advances on swipe/click.
  - [ ] Category cards navigate to filtered shop catalog.
  - [ ] Featured products grid renders balanced cards with no large empty voids.
  - [ ] Trust features and B2B trade banner display cleanly without clipping.
- [ ] **Header & Search:**
  - [ ] Search input accepts queries and navigates to `/shop?search=...`.
  - [ ] Mobile hamburger menu opens and closes smoothly.
  - [ ] Dark/Light theme toggle persists setting in `localStorage`.
  - [ ] Cart icon displays live quantity badge when items are added.
- [ ] **Catalog & Filters:**
  - [ ] Category pills filter products by category slug.
  - [ ] Price range filter applies min/max parameters.
  - [ ] "Show In-Stock Only" toggles stock availability.
  - [ ] Reset Filters button restores full catalog.
- [ ] **Product Detail Page (PDP):**
  - [ ] Variant selection updates SKU, price, and active swatch.
  - [ ] Quantity counter increments and decrements correctly.
  - [ ] "Add to Cart" adds item and triggers cart drawer feedback.
  - [ ] Mobile "Add to Cart" button is 100% unobstructed by WhatsApp or bottom nav.
  - [ ] Technical specifications and description tabs switch cleanly.
- [ ] **Cart & Checkout:**
  - [ ] Cart drawer displays correct item totals, delivery charges, and grand total.
  - [ ] Quantity changes in cart drawer update subtotals dynamically.
  - [ ] Item removal works with confirmation feedback.
  - [ ] Checkout form validates all required fields (Name, Phone, City, Address).
  - [ ] Bank transfer displays Meezan Bank details with working copy buttons.
  - [ ] Cash on Delivery order submission completes successfully.
- [ ] **Mobile Experience:**
  - [ ] Bottom navigation tabs (Home, Shop, Cart, Account, WhatsApp) navigate reliably.
  - [ ] No horizontal scrolling on viewports 320px, 360px, 375px, 390px, 430px.
  - [ ] No double WhatsApp buttons overlapping each other or obstructing CTAs.
- [ ] **Branding:**
  - [ ] Zero instances of "Kharidly" visible to the user across any page, modal, or metadata tag.
  - [ ] All primary buttons, badges, and accents use official DK Power Red (`#d71920`).

---

## 20. Final Recommendation

### Recommended Execution Strategy
1. **Approve Phase 1 (Immediate UI Cleanup & Brand Restoration):** Eliminates critical mobile purchase blockers, fixes broken cart drawer images, and purges all leftover "Kharidly" copy.
2. **Execute Phase 2 & 3 (Brand Color Alignment & Navigation Polish):** Replaces rogue orange accents with DK Power Red and streamlines navigation.
3. **Execute Phase 4 (Product Experience & Catalog Grid Balance):** Restores balanced product shelves on the homepage and verifies image mappings.
4. **Execute Phase 5 & 6 (Accessibility & Polish):** Finalizes touch targets, contrast ratios, and Lighthouse performance.

### Strict Boundaries (What Should NOT Be Changed)
- **Do NOT modify backend API routes** (`/api/orders`, `/api/products`, `/api/auth`, `/api/track`).
- **Do NOT alter database models or Prisma schemas**.
- **Do NOT modify external authentication or session security cookies** (e.g., JWT cookie validation).
- **Do NOT invent fake products, pricing, or unverified business claims**.
- **Do NOT touch any other codebase outside the DK Power project**.

---

## 21. Approved Visual Design Direction (Ronin-Inspired)

The user has reviewed and explicitly approved the **Ronin.pk-inspired visual aesthetic** for DK Power's redesign:

- **Approved Desktop Reference:**
  ![DK Power Approved Desktop UI](C:/Users/rovai/.gemini/antigravity-ide/brain/6b13d320-ad4d-44e6-a053-0aa0c537ebc9/dk_power_ronin_desktop_1792150062446.jpg)
- **Approved Mobile Reference:**
  ![DK Power Approved Mobile UI](C:/Users/rovai/.gemini/antigravity-ide/brain/6b13d320-ad4d-44e6-a053-0aa0c537ebc9/dk_power_ronin_mobile_1792150145908.jpg)
- **Approved Product Detail Reference:**
  ![DK Power Approved PDP UI](C:/Users/rovai/.gemini/antigravity-ide/brain/6b13d320-ad4d-44e6-a053-0aa0c537ebc9/dk_power_ronin_pdp_1792150219581.jpg)

### Core Architectural Elements of this Approved Direction:
1. **Floating Island Header:** Midnight charcoal (`#111317`) floating capsule with horizontal category icons (Earbuds, Chargers, Cables, Power Banks, Smart Tech) and direct Search, Trade Account, and Cart actions.
2. **Organic Curved Hero Banner:** 32px rounded corners with the signature organic cut-out corner tab housing the sleek `SHOP NOW 🛒` CTA.
3. **Immersive Mobile Top Fold:** Full-height portrait 9:16 mobile hero banner with circular category icon scroller.
4. **Wholesale Depth Cards:** Soft off-white canvas with pure white inner card backdrops, vertical `WHOLESALE READY` ribbon badges, 3D product renders, spec subtitles, and star ratings.
5. **No Mobile Collisions:** Integrated bottom navigation bar without overlapping floating WhatsApp pills.

