# Accessibility (WCAG 2.2 AA) – status & test plan

## Built in
- Semantic landmarks, skip link, one `h1` per page, `lang` + `dir` on `<html>` per locale.
- Age gate and cookie settings are modal dialogs: focus trap, Esc handling where dismissal is allowed, background `inert`, focus returned on close.
- Cookie banner: Accept / Reject / Customize have equal prominence, ≥44×44 px targets (WCAG 2.5.8).
- Visible focus rings; colour contrast tokens chosen for ≥4.5:1 text; no colour-only meaning.
- Forms: programmatic labels, `aria-describedby` errors, `aria-live` status, explicit consent checkbox.
- Reduced motion respected; no auto-playing media; Thai font (Noto Sans Thai) self-hosted.
- Language switcher and country selector are keyboard operable and announce language via `lang` attributes.

## Not done – needs a human
- Formal audit (axe + manual) on every template, in at least en, de, th, and one RTL locale (he-IL when added).
- Screen-reader passes: NVDA/Firefox, JAWS/Chrome, VoiceOver/Safari, TalkBack.
- Zoom 400% / text-spacing checks on all locales (German long words are hyphenated; verify).
- Publish an accessibility statement per market where required (e.g. EU Accessibility Act, UK).
