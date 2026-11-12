# EP01 References

Checked 2026-11-12. Only claims actually supported are listed as supported.

## Supported
1. MIT OpenCourseWare, *Mathematics for Computer Science* (6.042J). The course text has a section on ordinary induction that uses the sum of the first n integers as its worked example ("A Familiar Example"), with a stated base case and inductive step.
   https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/
   Supports: induction = base case + inductive step; the formula 1 + 2 + … + n = n(n+1)/2 as a standard example.
2. MIT OCW 6.042J Spring 2015 lecture slides, "Induction" (template with induction hypothesis, base case, inductive step).
   https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/
   Supports: the structure of an induction proof. (Slides demonstrate it on a geometric sum, not on 1+…+n.)

## Verified independently (computation)
- k(k+1)/2 + (k+1) = (k+1)(k+2)/2 for k = 1…199 (exact fractions); 1+…+n = n(n+1)/2 for n = 1…500; P(1): 1 = 1(1+1)/2.
- This is a check, not a proof; the proof is the algebra shown in the video.

## NOT verified against a source in this run
- Script scene 7: "the same reasoning is used to prove properties of recursive algorithms and data structures". This is standard (structural induction), but no source was opened for this claim. The visual only shows a call chain sum(n) → sum(n-1) → … → sum(1) and a small tree; it makes no further claim. Add a source (e.g. the MIT 6.042J chapter on recursive data types and structural induction) before relying on it in public copy.

## Note
The domino picture is an intuition metaphor. The formal proof is the base case plus the implication P(k) ⇒ P(k+1).
