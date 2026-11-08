# Use Cloudflare R2 for Property and Static Asset Storage

We migrated image hosting from local disk and hardcoded domain defaults to Cloudflare R2 bucket `gaoji-photos` accessed via public URL `https://pub-f4801f91b77a4269828769d0b4821905.r2.dev`. This unifies curated property galleries and dynamic backend uploads under consistent prefixes (`properties/` and `assets/`), providing zero-egress cost hosting and CDN-ready delivery without disk persistence dependencies on app servers.
