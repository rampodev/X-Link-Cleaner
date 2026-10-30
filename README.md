# X Link Cleaner

Chrome and Firefox extension that cleans links copied from X/Twitter.

When you use **Copy link** on a post (or copy a post link with Ctrl+C), the
link is rewritten before it reaches your clipboard:

```
https://x.com/user/status/1234567890?a=AbcDefGhi-AbcDefGhi&s=20
→ https://fixupx.com/user/status/1234567890
```

- The `a`, `s` and legacy `t` tracking parameters are removed; any other
  parameters are kept.
- `x.com`, `twitter.com` and their `www.`/`mobile.` variants become
  `fixupx.com`.

## Build

```bash
npm run build
```

Writes `dist/x-link-cleaner.zip`
