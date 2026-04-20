PWA Production Readiness Fix Plan
Context
The app is an expense tracker PWA with Next.js 16.1.4 and next-pwa plugin. Currently has 6 critical issues blocking production deployment:

401 errors on manifest.webmanifest fetch - PWA can't load manifests
Service worker cache failures - Can't cache manifest during install
API DNS resolution - expensetrackerapi.duckdns.org not resolving
Route 404s - /revenue-analytics and /search routes missing but linked
Font preload warnings - Unused Inter font + CSS fallback overriding Geist
Missing offline experience - No offline.html for fallback
Issues & Root Causes
Issue 1: 401 on manifest.webmanifest
Root Cause: Service worker tries to cache manifest with cache.addAll() during install, but manifest fetch returns 401.

Middleware explicitly bypasses /manifest.webmanifest (middleware.ts:12), but browser might be sending Authorization headers
Service worker doesn't handle 401 gracefully during precache
Fix Strategy:

Remove manifest from service-worker.js precache (it doesn't need caching, Next.js serves it)
Add error handling to service worker install
Verify middleware is serving manifest without auth
Issue 2: API DNS Resolution (expensetrackerapi.duckdns.org)
Root Cause: Backend API domain isn't resolving on the deployed environment

Likely environment configuration issue (wrong API URL or DNS not working)
Fix Strategy:

Check .env.example for NEXT_PUBLIC_API_URL configuration
Ensure .env in production has correct API domain
Add fallback to localhost for development
Document required environment variables
Issue 3: Missing Routes (/revenue-analytics, /search)
Root Cause: Routes referenced in sidebar.config.ts don't exist, causing 404s on RSC requests

Fix Strategy:

Create /src/app/revenue-analytics/page.tsx - stub component
Create /src/app/search/page.tsx - stub component
Create /src/app/not-found.tsx - error boundary for undefined routes
Update middleware matcher if these routes need auth
Add import guards to sidebar if routes aren't ready
Issue 4: Font Preload Warnings
Root Cause:

Inter font defined in fonts.ts but never imported/used (wasted preload)
CSS body fallback (Arial/Helvetica) overrides Geist font variables in globals.css
Fix Strategy:

Remove unused Inter font from fonts.ts
Fix globals.css body font-family to use CSS variables instead of Arial fallback
Verify Lusitana is imported in dashboard (already is, confirmed in cardDetails.tsx)
Add font-display: swap to optimize font loading
Issue 5: Offline Experience
Root Cause: No offline.html file exists, but service worker references it as fallback

Fix Strategy:

Create public/offline.html with proper PWA offline UI
Ensure service worker can access it
Issue 6: PWA Metadata & Best Practices
Root Cause: Service worker missing proper error handling and update strategy

Fix Strategy:

Add try-catch to manifest caching in service worker
Add update notifications to client via PWARegister component
Verify manifest icons are accessible
Add theme-color meta tag consistency
Implementation Plan
Phase 1: Fix Service Worker (src/service-worker.js)
Lines 15-20: Remove manifest from precache (it changes with builds)
Lines 22-27: Add error handling to install event
Lines 99-105: Add logging for failed fetches
Phase 2: Fix Font Issues (globals.css + fonts.ts)
src/app/globals.css line 34: Change font-family: Arial, Helvetica, sans-serif to use CSS variable
src/assets/fonts/fonts.ts: Remove unused Inter font
Phase 3: Create Missing Routes
Create: src/app/revenue-analytics/page.tsx - Stub page with "Coming Soon"
Create: src/app/search/page.tsx - Stub page with search UI
Create: src/app/not-found.tsx - Custom 404 page
Update: middleware.ts matcher - Add new routes if they need auth
Phase 4: Create Offline Experience
Create: public/offline.html - Offline fallback page
Update: service-worker.js - Verify offline.html cache logic
Phase 5: Fix Environment Configuration
Review: .env.example - Ensure NEXT_PUBLIC_API_URL is documented
Verify .env - Production API URL is correct
Add: Error handling for API not found
Phase 6: PWA Metadata & Headers
Update: next.config.ts - Add proper cache headers for manifest
Update: manifest.ts - Ensure all icons are properly sized
Verify: middleware.ts - manifest.webmanifest bypass is correct
Critical Files to Modify
File	Issue	Change
src/service-worker.js	Manifest caching fails on 401	Remove from precache, add error handling
src/app/globals.css	Font fallback overrides Geist	Fix body font-family CSS variable
src/assets/fonts/fonts.ts	Unused Inter preload	Remove Inter font import
public/offline.html	Missing offline UI	Create new file
src/app/revenue-analytics/page.tsx	Route missing	Create stub page
src/app/search/page.tsx	Route missing	Create stub page
src/app/not-found.tsx	No 404 handler	Create error boundary
.env.example	API config unclear	Document NEXT_PUBLIC_API_URL
Verification Plan (After Implementation)
Service Worker Tests:

Build production (npm run build)
Check Chrome DevTools > Application > Service Workers
Verify no errors during SW install
Check Cache Storage has proper entries
Font Tests:

Check Performance > Fonts in DevTools
Verify Geist fonts load, not Arial fallback
Check for preload warnings gone
Route Tests:

Navigate to /revenue-analytics → should load stub page
Navigate to /search → should load stub page
Navigate to /nonexistent → should show not-found page
Check for 404s in Network tab
PWA Tests:

Check manifest.webmanifest loads (200, not 401)
Install app as PWA
Go offline, navigate to previously cached route
Should see offline.html for uncached routes
API Tests:

Check .env has correct API URL
Verify API calls work or show proper error if DNS fails
Check service worker caches API responses
Success Criteria
 No 401 on manifest.webmanifest
 Service worker installs without errors
 No font preload warnings
 /revenue-analytics and /search return 200
 Offline.html displays when offline
 PWA installs and works on mobile
 No errors in service worker scope
 API URL properly configured per environment
