# DivyaArpan Development Audit

## Audit Scope

This report describes the current repository state as inspected on 2026-08-19. The audit was read-only. Existing modified and untracked files were preserved. No existing application files were changed.

## 1. Technology Stack

- Next.js `16.2.10` with App Router
- React `19.2.4`
- TypeScript `5`
- Tailwind CSS `4`
- ESLint `9`
- Prisma `6.19.3`
- PostgreSQL
- Razorpay payments
- `lucide-react` icons
- Playwright browser tests
- `tsx` for Prisma scripts
- Node.js runtime

Primary configuration files:

- `divyaarpan/package.json`
- `divyaarpan/prisma/schema.prisma`
- `divyaarpan/tsconfig.json`
- `divyaarpan/playwright.config.ts`
- `divyaarpan/next.config.ts`

## 2. Relevant Project Structure

```text
divyaarpan/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── components/
│   ├── data/
│   ├── admin/
│   ├── api/
│   ├── astrology/
│   ├── book-my-pandit/
│   ├── booking/
│   ├── checkout/
│   ├── confirmation/
│   ├── contact/
│   ├── donate/
│   ├── login/
│   ├── my-bookings/
│   ├── pandit/
│   ├── payment/
│   ├── pooja/
│   ├── poojas/
│   ├── sacred-store/
│   ├── store/
│   ├── success/
│   ├── temple/
│   └── temples/
├── lib/
│   ├── prisma.ts
│   ├── razorpay.ts
│   ├── payment/
│   └── matching-engine/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   ├── restore-temples.ts
│   └── migrations/
├── public/
│   ├── images/
│   └── uploads/pandits/
├── tests/
└── package.json
```

The repository is currently dirty: there are many existing modified files and approximately 270 untracked files, including backups, uploaded documents, test results, and new feature files. No existing changes were reverted.

## 3. Public Pages and Routes

There are 47 active page entrypoints:

- `/`
- `/temples`
- `/temples/[slug]`
- `/temple`
- `/pooja`
- `/poojas`
- `/booking`
- `/checkout`
- `/confirmation`
- `/payment`
- `/payment/failed`
- `/success`
- `/my-bookings`
- `/book-my-pandit`
- `/book-my-pandit/booking`
- `/book-my-pandit/review`
- `/book-my-pandit/searching`
- `/book-my-pandit/payment`
- `/book-my-pandit/payment/success`
- `/book-my-pandit/payment/failed`
- `/pandit/dashboard`
- `/pandit/dashboard/requests`
- `/pandit/bookings`
- `/astrology`
- `/donate`
- `/store`
- `/sacred-store`
- `/contact`
- `/login`

## 4. Admin Pages

- `/admin`
- `/admin/temples`
- `/admin/temples/new`
- `/admin/temples/[slug]/edit`
- `/admin/poojas`
- `/admin/poojas/new`
- `/admin/poojas/[id]/edit`
- `/admin/bookings`
- `/admin/pandit-bookings`
- `/admin/pandit-bookings/[bookingId]`
- `/admin/pandits`
- `/admin/pandits/new`
- `/admin/pandits/[id]`
- `/admin/pandits/[id]/edit`
- `/admin/pandits/[id]/service-areas`
- `/admin/facilities`
- `/admin/gallery`
- `/admin/devotees`

Temple, Pooja, Gallery, Facility, Pandit, and booking admin screens exist. Devotee administration is only a placeholder.

## 5. API Routes

There are 34 active API route files.

### Temple and Pooja APIs

- `GET/POST /api/temples`
- `GET/PUT/DELETE /api/temples/[slug]`
- `GET/POST /api/poojas`
- `GET/PUT/DELETE /api/poojas/[id]`
- `GET/POST /api/gallery`
- `DELETE /api/gallery/[id]`
- `GET/POST /api/facilities`
- `DELETE /api/facilities/[id]`

### Temple Booking APIs

- `GET/POST /api/bookings`
- `GET /api/bookings/[id]`
- `PUT /api/bookings/[id]/status`
- `PUT /api/bookings/update`

### Devotee APIs

- `GET/POST /api/devotees`
- `GET /api/devotees/[id]`

The individual devotee endpoint currently returns HTTP `501 Not Implemented`.

### Pandit APIs

- `GET/POST /api/pandits`
- `GET/PUT /api/pandits/[id]`
- `PATCH /api/pandits/[id]/approve`
- `PATCH /api/pandits/[id]/status`
- `PATCH /api/pandits/[id]/online-status`
- `POST /api/pandits/match`
- `POST /api/pandits/documents/upload`
- `PATCH /api/pandits/[id]/documents/[documentId]`
- `GET/POST /api/pandits/[id]/service-areas`
- `DELETE /api/pandits/[id]/service-areas/[serviceAreaId]`
- `GET /api/pandit/dashboard`
- `POST /api/pandit/offers/[offerId]/accept`

### Pandit Booking APIs

- `GET/POST /api/pandit-bookings`
- `POST /api/pandit-bookings/request`
- `GET/PUT /api/pandit-bookings/[bookingId]`
- `GET /api/pandit-bookings/[bookingId]/assigned`
- `POST /api/pandit-bookings/offers/[offerId]/accept`
- `POST /api/pandit-bookings/offers/[offerId]/reject`

### Payment APIs

- `POST /api/payments/create-order`
- `POST /api/payments/verify`

## 6. Pooja Management

Implemented:

- Prisma `Pooja` model
- Temple-linked Poojas
- Admin listing
- Create, edit, and delete flows
- Active/inactive status
- Price, duration, image, and description
- Poojas displayed on temple detail pages
- Temple booking flow connected to selected Pooja

Limitations:

- `/poojas` is only an alias to the static `/pooja` landing page.
- Public Pooja browsing is mostly static rather than database-driven.
- Price is stored as a `String` for temple Poojas.
- No comprehensive public Pooja search or filtering exists.

## 7. Temple Functionality

Implemented:

- Temple CRUD
- Slug-based detail pages
- Featured temples
- Gallery management
- Facility management
- Opening and closing times
- Map URL
- Temple-linked Poojas
- Temple booking links
- Seed and restoration scripts

Important bug:

- `app/components/FeaturedTemples.tsx` links using `temple.id`, while the implemented detail route expects `/temples/[slug]`. Homepage featured cards can therefore link to nonexistent pages.

Deployment risk:

- `app/temples/page.tsx` and `app/temples/[slug]/page.tsx` use hardcoded `http://localhost:3000` API URLs.

## 8. Booking Functionality

### Temple Pooja Bookings

Implemented:

- Temple and Pooja selection
- Devotee information
- Date and time
- Number of devotees
- Sankalp
- Pooja mode:
  - Devotee present
  - On behalf
- Database persistence
- Booking confirmation
- Checkout and payment pages
- Admin booking listing and status controls
- Razorpay order creation and verification

Risks:

- The public booking API accepts many values directly from the client, including `bookingId`, price, temple, and Pooja text.
- Validation is limited in the booking API.
- `/my-bookings` now reads authenticated temple and Pandit bookings from the database.

### Book My Pandit

Implemented:

- Immediate and scheduled bookings
- City and address
- Language preference
- Service selection
- Urgency
- Devotee details
- Pandit matching
- Offers
- Pandit acceptance
- Assignment
- Quotation fields
- Payment
- Searching, success, and failure states
- Pandit dashboard and request management

This is currently the most complete feature area.

## 9. Pandit Functionality

Implemented:

- Pandit creation and editing
- Verification states
- Activation/deactivation
- Online/offline status
- Languages
- Services and pricing
- Service areas
- Availability
- Documents and uploads
- Admin detail pages
- Matching engine
- Ranking and filtering
- Booking offers
- Pandit dashboard
- Booking acceptance

Relevant server code is under `lib/matching-engine/` and `lib/pandit-dispatch.ts`.

Major security gap:

- No authentication or authorization protects admin or Pandit APIs. A client can potentially call management endpoints directly.

## 10. Astrology Functionality

Implemented only as a static presentation page:

- Kundli consultation description
- Career and business guidance
- Relationship guidance
- Muhurat guidance
- Links to `/contact`

Missing:

- Astrologer profiles
- Birth-detail form
- Appointment booking
- Consultation order
- Payment integration
- Reports or dashboards

## 11. Donation Functionality

Currently placeholder-only:

- Static donation page
- Buttons for ₹501, ₹1101, and ₹2101

Missing:

- Button handlers
- Donation records
- Payment orders
- Razorpay verification
- Receipts
- Donor information
- Admin reporting

## 12. Store and Product Functionality

Currently not implemented.

- `/store` re-exports the static `/sacred-store` page.
- `/sacred-store` contains promotional content and links to Poojas and Pandit services.
- No Product model
- No product API
- No inventory
- No cart
- No product detail pages
- No order management
- No store checkout

## 13. Checkout and Payments

Implemented:

- Razorpay order creation
- Temple booking payment branch
- Pandit booking payment branch
- HMAC signature verification
- Payment status persistence
- Payment success and failure pages
- Payment order IDs and payment IDs stored in Prisma

Configured runtime variables:

- `DATABASE_URL`
- `SHADOW_DATABASE_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

Risks:

- Payment APIs are not protected by authentication.
- Verification should be made explicitly idempotent.
- There are duplicate payment utility implementations.
- No webhook endpoint exists for server-side payment reconciliation.
- No refunds or settlement handling exists.
- No notification is sent after payment.

## 14. Login and Authentication

Implemented foundation and devotee account flow:

- Email and password login
- Scrypt password hashing
- Database-backed sessions in an HTTP-only cookie
- Admin, Pandit, and Devotee roles in Prisma
- Devotee self-registration
- Authenticated devotee profile viewing and editing
- Database-backed devotee booking history
- Logout and account navigation

Remaining authentication work:

- Route-wide middleware protection and authorization review
- Password reset and account recovery
- Broader API authentication coverage

All admin, Pandit, and API surfaces currently appear publicly reachable.

## 15. Database and Storage

### Database

PostgreSQL through Prisma.

The schema contains 14 models:

- `Temple`
- `Pooja`
- `Gallery`
- `Facility`
- `Booking`
- `Devotee`
- `Pandit`
- `PanditLanguage`
- `PanditService`
- `PanditServiceArea`
- `PanditAvailability`
- `PanditDocument`
- `PanditBooking`
- `PanditBookingOffer`

### Storage

- Database records are stored in PostgreSQL.
- Pandit uploaded documents are stored under `public/uploads/pandits`.
- Some images use local assets.
- Some seeded and displayed images use external Unsplash URLs.
- Browser-only booking history uses `sessionStorage`.

There are duplicate Prisma utility locations: `lib/prisma.ts` and `app/lib/prisma.ts`.

## 16. Reusable Components

Active reusable components include:

- `app/components/Navbar.tsx`
- `app/components/HeroSection.tsx`
- `app/components/DivyaArpanServices.tsx`
- `app/components/FeaturedTemples.tsx`
- `app/components/PopularPoojas.tsx`
- `app/components/BookMyPandit.tsx`
- `app/components/FloatingSearch.tsx`
- `app/components/FestivalBanner.tsx`
- `app/components/TempleGallery.tsx`
- `app/components/TempleMap.tsx`
- `app/components/TemplePoojas.tsx`
- `app/components/Testimonials.tsx`

There are also many backup and historical versions in the same directories.

## 17. Homepage Functionality

The homepage currently includes:

- Navigation
- Hero section
- Service cards
- Search UI
- Featured temples
- Popular Poojas
- Book My Pandit promotion
- Testimonials
- Festival banner behavior
- Footer

The homepage is largely presentation-driven and uses static data for some sections. The `app/data/temples.ts` data is separate from database-backed temple data.

## 18. Incomplete and Placeholder Features

Confirmed incomplete:

- Login/authentication
- Donation payments
- Store/products
- Contact form
- Astrology booking
- Devotee admin
- `/api/devotees/[id]`
- Public Pooja catalog
- Notifications
- Refunds
- Webhooks
- Role-based access
- Production monitoring

Explicit placeholder messages exist in:

- `app/admin/devotees/page.tsx`
- `app/api/devotees/[id]/route.ts`
- `app/admin/page.tsx`
- `app/temples/page.tsx`

## 19. Bugs, Errors, and Risks

### Confirmed

- TypeScript check passed with no diagnostics.
- ESLint reported `54 problems`: `34 errors` and `20 warnings`.
- Homepage featured temple links use IDs instead of slugs.
- Temple server pages hardcode `localhost:3000`.
- Authentication foundation and devotee account access are implemented; broader route authorization remains incomplete.
- Devotee detail API returns `501`.
- Store is not a real product system.
- Donation buttons have no behavior.
- Login and registration are functional.
- `/my-bookings` is authenticated and database-backed.
- Several React effects trigger the ESLint `react-hooks/set-state-in-effect` rule.
- Several files use explicit `any`.
- Several files contain unescaped apostrophes.
- Several pages use raw `<img>` instead of optimized Next.js images.
- Some state variables and imports are unused.
- There are duplicate and backup implementations that increase maintenance risk.

### Not verified

- Full browser test execution was not run because the audit request prohibited rebuilding, and the test configuration starts the development server.
- Database connectivity and Razorpay live behavior were not tested.
- Production deployment behavior was not tested.

## 20. Parts That Are Already Working and Should Not Be Touched Casually

These areas have substantial implementation and should be preserved while adding missing infrastructure:

- Temple CRUD and temple detail flow
- Pooja CRUD
- Temple booking form and persistence
- Razorpay temple payment flow
- Pandit registration and admin management
- Pandit verification and status transitions
- Pandit service areas and documents
- Pandit matching engine
- Pandit booking offers and assignment
- Pandit dashboard and request flow
- Existing homepage structure and reusable component system
- Prisma schema and migrations, except through deliberate migrations
- Existing Playwright booking tests

## Launch Blockers

The following should be treated as blockers before production launch:

1. No authentication or authorization for admin, Pandit, or sensitive API routes.
2. Client-controlled booking fields and insufficient server-side validation.
3. Payment operations lack webhooks, reconciliation, refund handling, and explicit idempotency.
4. Hardcoded localhost URLs can break deployed temple pages.
5. Donation, store, login, contact, and astrology transaction flows are incomplete.
6. Uploaded identity documents are stored in a public directory and require access-control review.
7. ESLint has 34 errors and 20 warnings.
8. Automated browser tests have not been validated against the current repository state.
9. Operational notifications and failure monitoring are absent.
10. Database backups, production migration procedures, and observability are not documented.

## Prioritized Roadmap

### PHASE 1 — Critical Core Functionality

1. Add authentication with secure sessions and roles:
   - Admin
   - Pandit
   - Devotee
2. Protect every admin, Pandit, booking-management, document, and payment endpoint.
3. Fix the homepage temple ID/slug route defect.
4. Replace hardcoded `localhost:3000` URLs with deployment-safe server data access.
5. Add request validation schemas for all public APIs.
6. Prevent client-controlled price and booking identity manipulation.
7. Make payment verification idempotent.
8. Resolve the current ESLint errors.
9. Add database connectivity and API integration tests.

### PHASE 2 — User-Facing Features

1. Complete devotee accounts and profile management. **Completed 2026-08-21.**
2. Replace session-only booking history with authenticated database queries. **Completed before this milestone.**
3. Build a real public Pooja catalog backed by Prisma. **Completed before this milestone.**
4. Add booking cancellation and rescheduling. **Completed 2026-08-21.**
5. Add booking status history. **Completed 2026-08-21.**
6. Complete the Contact form. **Completed 2026-08-21.**
7. Build astrology consultation booking. **Completed 2026-08-21.**
8. Add accessible loading, error, and empty states across routes. **Completed 2026-08-21.**

### PHASE 3 — Admin Management

1. Complete devotee management.
2. Add role-aware admin navigation.
3. Add search, filtering, pagination, and exports.
4. Add booking operations dashboards.
5. Add Pooja pricing and availability controls.
6. Add temple content validation and image management.
7. Add Pandit audit logs.
8. Add admin activity tracking.

### PHASE 4 — Payments, Notifications, and Operations

1. Add Razorpay webhooks.
2. Add payment reconciliation.
3. Add refunds and cancellation policies.
4. Add email, SMS, and WhatsApp notifications.
5. Add booking reminders.
6. Add Pandit dispatch timeout and escalation jobs.
7. Add donation payment and receipt generation.
8. Add operational logs and failure alerts.

### PHASE 5 — Production Readiness

1. Add production environment validation.
2. Remove or secure uploaded document exposure.
3. Configure object storage for documents and images.
4. Add rate limiting and abuse protection.
5. Add CSRF and request-origin protections where applicable.
6. Add database backup and migration procedures.
7. Add monitoring, error tracking, and audit logs.
8. Add CI checks for TypeScript, ESLint, Prisma, and Playwright.
9. Remove obsolete backups and clarify source-of-truth files.
10. Perform a production deployment and security review.

## Final Status

Audit updated after completing Phase 2, User-Facing Features item 8: add accessible loading, error, and empty states across routes. The next incomplete roadmap item is Phase 3, item 1: complete devotee management.
