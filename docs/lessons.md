# Lessons Learned

> Update this file after every correction or mistake. One entry per lesson.
> Review this at the start of each session.

---

## Format
**Mistake**: What went wrong
**Fix**: What the correct approach is
**Rule**: The pattern to follow going forward

---

**Mistake**: Used `variants` function pattern with `custom` in Framer Motion 12
**Fix**: Use `(delay: number) => ({ initial, animate, transition })` helper + spread with `{...fadeUp(0.1)}`
**Rule**: Framer Motion 12 dropped function-based variant stagger. Use inline transition helpers instead.

---

**Mistake**: Used `<line>` JSX in React Three Fiber — TypeScript treats it as SVG's `<line>` element
**Fix**: Import `{ Line }` from `@react-three/drei` and use that instead
**Rule**: R3F lowercase primitives that match SVG/HTML names (`line`, `text`) conflict with DOM types. Use drei's uppercase equivalents.
