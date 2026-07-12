# Q&A Bank — Behavioral

## Q: Tell me about the most difficult feature you built.

**Tags:** star, perf-library · **Asked at:** expected (Zerodha prep)

The Performance Debug Library. The hard part wasn't UI — it was metric trustworthiness across device tiers. I owned architecture, native integration, and rollout: native FPS via Choreographer/CADisplayLink, TTID/TTFD/TTI instrumentation, device-tier thresholds, Dynatrace + Sentry upload. Outcome: performance conversations moved from opinion to evidence, and it drove measurable latency wins in critical flows. Full story: [../03-stories/perf-debug-library.md](../03-stories/perf-debug-library.md)

## Q: Tell me about a disagreement with PM or Design.

**Tags:** conflict · **Asked at:** expected

A visual direction had heavy rendering cost on lower-end devices. I brought trace data, proposed alternatives that preserved the UX intent, and we aligned on a performance budget before implementation. Shipped a design that looked strong within responsiveness targets. Pattern: quantify → alternatives with equal intent → pre-agreed budget.

## Q: What trade-off did you consciously accept in your biggest project?

**Tags:** trade-offs · **Asked at:** expected

More complexity in debug tooling in exchange for less production uncertainty. Maintaining native modules across two platforms isn't free — but the payoff was faster optimization loops and no more blind regressions. I'd take that trade again.

## Q: How do you mentor junior engineers?

**Tags:** mentorship · **Asked at:** expected

Context and repetition: explain the why, co-debug once, then they drive with feedback. I focus on debugging method and decomposition over answers. Concretely at Best Buy: onboarding docs on Confluence that cut ramp-up time, interview panels, and a "Future of React Native" talk to the engineering org.

## Q: What's your leadership style as a senior engineer?

**Tags:** leadership · **Asked at:** expected

Hands-on and enabling — I write the critical paths, define guardrails, and raise the bar through tooling and review standards. Goal: make the team faster, not become the bottleneck. The perf library is exactly that philosophy as code.

## Q: How do you handle conflicting priorities?

**Tags:** prioritization · **Asked at:** expected

Make trade-offs explicit: user impact, risk, effort. Ship a small MVP that protects quality thresholds, stage the rest, document the now-vs-later decision. Example: the 4-day OTA release — scoped ruthlessly to the critical fix, coordinated cross-timezone sign-offs, shipped 3 days early.

## Q: Strengths and one development area?

**Tags:** self-awareness · **Asked at:** expected

Strengths: turning ambiguous problems into reliable systems and proving outcomes with numbers. Development area: I used to go too deep too early; I now time-box exploration and surface trade-offs faster so team decisions don't wait on my curiosity.

## Q: What would you improve with two more sprints on your main project?

**Tags:** roadmap · **Asked at:** expected

CI regression gates on benchmark deltas (block PRs that regress TTFD), alert tuning by flow criticality, and per-component render attribution to point at the exact offender instead of the screen.
