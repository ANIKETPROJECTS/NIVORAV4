---
name: Instagram cover image auto-fetch is not feasible
description: Why Instagram post/reel cover images can't be pulled automatically from this server environment.
---

# Instagram cover image auto-fetch

Instagram blocks unauthenticated scraping (og:image meta tags, embed pages, oEmbed without a token) from datacenter/server IPs — confirmed it returns a login/challenge wall regardless of post validity when fetched from this environment.

**Why:** Tested multiple approaches (og:image meta tag scrape, `/embed/captioned/` page, public oEmbed endpoint) against known-valid public posts; all returned Instagram's login/challenge page, not the actual content.

**How to apply:** The only reliable automatic option is Instagram's official oEmbed API via a Meta/Facebook Developer app (App ID + Client Token as secrets) — ask the user if they want to set that up. Otherwise, use the manual pattern: admin pastes the post/reel link and uploads the cover image themselves (same as other SiteSettings image fields). See `site-settings-pattern.md` for the general admin-editable-image pattern.
