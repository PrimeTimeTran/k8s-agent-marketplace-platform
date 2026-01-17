## Kubernetes

We’re not adding abstraction to simplify Kubernetes —
we’re adding it to stabilize our product contract.
Kubernetes optimizes for workloads; our abstraction optimizes for agents as a product.

Without it, every team re-encodes agent lifecycle,
credentials, health, and policy slightly differently, which increases operational risk over time.

## Examples

- Gmail
- YouTube
- Google Search
- OpenAI
- Spotify
- Airbnb
- Shopify
- Stripe
- Uber
- Lyft
- Cloud Run
- Vercel
- Netlify

### Counter Arguments

This does add another layer, and that layer can fail.
We’re choosing that risk intentionally because the alternative is dozens of implicit,
undocumented layers implemented differently across services.
