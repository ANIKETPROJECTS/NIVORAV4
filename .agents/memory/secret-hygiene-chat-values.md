---
name: Secret hygiene when user types values in chat
description: What to do when a user pastes a secret (password, connection string) as plain chat text instead of using the requestSecrets form.
---

If `requestSecrets` gets no valid answer (e.g. user's first attempt is malformed) and the user then pastes the corrected value directly in a chat message, do NOT use `setEnvVars` to store it — that writes it into `.replit` under `[userenv.shared]` in plaintext, which gets committed to git history.

**Why:** a code-review pass on a Nivora Interiors setup flagged this as a critical severity issue — MongoDB connection string with password and admin password were readable in `.replit`.

**How to apply:**
1. If you already wrote a secret value via `setEnvVars`, immediately `deleteEnvVars` to remove it from `.replit`.
2. Call `requestSecrets` again asking the user to re-enter the value through the secure form (never re-typed in chat).
3. If the user declines to re-enter (values already exposed either way), tell them plainly that the underlying credential was exposed in chat/log history and recommend rotating it at the source (e.g. change the DB user's password in the provider's dashboard). Respect their choice if they accept the risk — don't block on it.
4. Non-sensitive companion values (e.g. a plain admin username) are fine to leave as regular env vars via `setEnvVars`.
