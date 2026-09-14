/**
 * Shared Framer Motion transition presets so timing stays consistent across
 * the app instead of every component picking its own duration/easing.
 *
 * - micro:    150-250ms — hovers, chips, small state toggles
 * - standard: 300-500ms — panel/page-level transitions, modals
 * - hero:     500-800ms — score reveals, staged AI sequences
 */
export const motionPresets = {
  micro: { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
  standard: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  hero: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer = (staggerDelay = 0.06) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerDelay },
  },
});

/**
 * Returns a "reduced" version of a transition when the user has
 * prefers-reduced-motion enabled — near-instant, no springs/large offsets.
 * Framer Motion's own `useReducedMotion()` hook should be preferred inside
 * components; this helper is for places building a transition object ahead
 * of render (e.g. passed straight into `transition={}`).
 */
export const withReducedMotion = (transition, reduced) =>
  reduced ? { duration: 0.01 } : transition;
