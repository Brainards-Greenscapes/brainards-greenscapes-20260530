#!/usr/bin/env bash
# rewrite-commits.sh
# Rewrites commit messages that reference "vendor" or "copyright hardening"
#
# USAGE:
#   1. Review the replacement messages below and edit as needed
#   2. cd into your repo
#   3. Run: bash rewrite-commits.sh
#   4. Verify with: git log
#   5. Force push:  git push --force-with-lease
#
# WARNING: This rewrites history. Coordinate with anyone else working on this repo.

set -euo pipefail

# Safety check
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
  echo "ERROR: Not inside a git repository." >&2
  exit 1
fi

# Create a backup branch before we touch anything
BACKUP="pre-rewrite-backup-$(date +%s)"
git branch "$BACKUP"
echo "Backup branch created: $BACKUP"

git filter-branch -f --msg-filter '
case "${GIT_COMMIT:0:8}" in

  7be420c6)
    cat <<\MSG
Rewrite all 14 service area descriptions with original copy

Rewrote intro, localContext, and neighborhood descriptions for all 14
service areas in serviceAreas.json. New copy is written from scratch
with David-focused voice and locally specific detail.
MSG
    ;;

  c615f86d)
    cat <<\MSG
Rewrite homepage copy with original language

- Rewrite homepage H1, topper, meta description, service area blurb
- Replace xeriscaping plant palette species lists with nursery relationship copy
- No URL, title tag, or sitemap changes (SEO-safe)
MSG
    ;;

  f401a8c4)
    cat <<\MSG
Rewrite homepage copy — owner-operated focus

- Rewrite H1: "Las Cruces Landscaping Done Right — Since 2007"
- Rewrite topper: "Owner-Operated. Locally Trusted."
- Update meta description with owner-operated focus + artificial turf
- Reword service area blurb
- No URL, title tag, or sitemap changes (SEO-safe)
MSG
    ;;

  528a88bb)
    cat <<\MSG
Rewrite FAQ questions with original phrasing

- "How long will my project take to complete?" → "What kind of timeline should I expect?"
- "What services do you offer?" → "What types of landscaping work does Brainard\x27s Greenscapes handle?"
- "Is your work guaranteed?" → "Do you stand behind your finished projects?"
- Answers unchanged, JSON valid, 10 entries preserved
- No URL, schema, or structural changes (SEO-neutral)
MSG
    ;;

  e5ab3eda)
    cat <<\MSG
Rewrite terms of service from scratch

- Fresh conversational language for a simple landscaping info site
- No URL, canonical, meta, or structural changes (SEO-neutral)
MSG
    ;;

  7c856717)
    cat <<\MSG
Rewrite privacy policy from scratch

- Fresh original language appropriate for a simple landscaping site
- Fix stale Netlify reference → Formspree (actual form processor)
- Add GA4 measurement ID for transparency
- No URL, canonical, meta, or structural changes (SEO-neutral)
MSG
    ;;

  # Also clean up the differentiation commit that references "generic templates"
  2c3c7955)
    cat <<\MSG
Rewrite homepage and service area copy, fix maps and geo references

- Rewrite homepage H1, topper, meta description, service area blurb
- Replace xeriscaping plant palette lists with nursery relationship copy
- Fix "metro area" references across homepage, service areas, Mesilla Park
- Add "Doña Ana County" geo term for local SEO
- Simplify neighborhood maps to Las Cruces fallback (always loads)
- No URL, title tag, or sitemap changes (SEO-safe)
MSG
    ;;

  *) cat ;;  # Pass all other commits through unchanged

esac
' -- --all

echo ""
echo "Done. Review with:  git log --oneline"
echo "If happy:           git push --force-with-lease"
echo "If not:             git reset --hard $BACKUP"
