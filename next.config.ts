import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const isDev = process.env.NODE_ENV !== 'production';

// Third-party hosts are only allowed when the matching analytics/bot-protection env var is configured.
const scriptHosts: string[] = [];
const connectHosts: string[] = [];
const frameHosts: string[] = [];
if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) { scriptHosts.push('https://plausible.io'); connectHosts.push('https://plausible.io'); }
if (process.env.NEXT_PUBLIC_GA4_ID) {
  scriptHosts.push('https://www.googletagmanager.com');
  connectHosts.push('https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://www.googletagmanager.com');
}
if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) { scriptHosts.push('https://challenges.cloudflare.com'); frameHosts.push('https://challenges.cloudflare.com'); }

// NOTE: Next.js injects small inline bootstrap scripts, so 'unsafe-inline' is kept for script-src.
// A nonce-based strict CSP requires dynamic rendering (see README → Security hardening).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} ${scriptHosts.join(' ')}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${connectHosts.join(' ')}${isDev ? ' ws:' : ''}`.trim(),
  `frame-src ${frameHosts.length ? frameHosts.join(' ') : "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests'])
].join('; ');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=(), browsing-topics=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          // Not indexable until ALLOW_INDEXING=1 is set (after counsel sign-off and the pre-launch checklist)
          ...(process.env.ALLOW_INDEXING === '1' ? [] : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }])
        ]
      }
    ];
  }
};

export default withNextIntl(nextConfig);
