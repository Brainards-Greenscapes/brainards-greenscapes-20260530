# Context: Turf Deodorizer Service Page

## What to build
New service page at `/services/landscaping/turf-cleaning/` for artificial turf deodorizing/cleaning.

## Why David wants this service
David doesn't use manufactured infill on turf installs. Las Cruces has so much airborne sand that it naturally settles into turf fibers — paying for infill is wasted money here. Once any infill is down, it compacts hard like concrete fines and can't be swapped out.

This means the standard industry answer for pet odor on turf (antimicrobial infill) doesn't apply to his installs. His answer is **enzyme-based deodorizing** — a repeatable treatment that breaks down organic compounds causing odor.

David's exact words: "You can't really uninstall sand or standard infill and then swap it out. In fact, we don't use infill at all because there is so much sand in the air, it is almost a pointless expense. Deodorizing is the way to go. Once infill is down it gets hard like concrete fines."

## Business case
- **Recurring revenue** from existing turf install customers
- **Zero local competition** in Las Cruces (confirmed via search — no one offers this)
- **Natural upsell** from every turf job: "we installed it, we'll maintain it"
- **Pet odor is the #1 complaint** for turf owners in LC heat
- Enzyme-based products (BioTurf BioS+, TurFresh BioX) are the industry standard
- Fits David's build-focused model: quick job, repeat business, no heavy maintenance contracts

## Template to follow
Use any existing service page under `src/services/landscaping/` as the structural template. The artificial turf page (`src/services/landscaping/artificial-turf/index.njk`) is the closest match — same layout: breadcrumb, hero section, content sections, FAQ accordion, related services, CTA banner.

## Cross-linking needed after the page is built

### 1. Blog post: `src/blog/artificial-turf-las-cruces.md`
The pets section (around line 85) discusses deodorizing but doesn't link to a service page yet. Once the service page exists, add a link from the blog's pet maintenance tips to the new service page.

### 2. Artificial turf SERVICE page: `src/services/landscaping/artificial-turf/index.njk`
This page still has infill references that need updating to match David's no-infill approach:
- **Line 38:** "We install high-quality turf with proper base preparation, drainage, and infill." → Remove "and infill" or reframe
- **Lines 93-94:** Step 4 is "Infill & Finishing" with "We spread infill to weigh the turf down, keep the blades standing upright, and provide cushion." → Rewrite to describe edge securing/finishing without infill
- **Add** a related service link to the turf deodorizer page in the Related Services grid (line 144 area)

### 3. Notion SEO Improvements page (3846c62c-2bbc-8181-a873-e8a83f73061f)
Already has `/services/landscaping/turf-cleaning/` listed as a page to build. Mark as done when complete.

## SEO targets
- "artificial turf cleaning Las Cruces"
- "turf deodorizer Las Cruces"  
- "artificial turf pet odor Las Cruces"
- "turf cleaning service near me"

## David's services memory (for tone/accuracy reference)
Read memory file `project-david-services.md` — turf cleaning/deodorizing is listed under "considering adding."
Update to "active service" once page is built.
