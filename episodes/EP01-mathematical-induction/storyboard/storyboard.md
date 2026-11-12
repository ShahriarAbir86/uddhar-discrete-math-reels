# EP01 Storyboard — Mathematical Induction

Status: built and rendered (see qa/run_summary.md). Times are from the measured pauses of the supplied voiceover (102.84 s) aligned to the script; no ASR timestamps are used (see qa/intake.md).

## One continuous world (1500 × 3800 units)

| Zone | Position (y) | Content |
|---|---|---|
| A | 400–830 | Domino chain, P(·) labels, Base Case and Inductive Step labels, hop arcs, ∞ |
| B | 1280–3070 | Summation proof: statement, Base Case box, Inductive Step algebra |
| C | 3280–3800 | Recursion call chain sum(n)…sum(1) and a small tree |

Camera = pan/zoom of one SVG group over this fixed world. Nothing is rebuilt between scenes.

## Scenes

| # | Time (s) | Scene | Visual | Camera | On-screen words | Orange highlight |
|---|---|---|---|---|---|---|
| 1 | 0.00–18.51 | The Question | Wide chain of 8 dominoes drawn left to right. Camera pushes in on domino 1, follows the fall along the row, pulls back. Orange "?" then "powerful proof technique", then the title. | Wide → close on domino 1 → follow fall → wide → title | ?, powerful proof technique, Mathematical Induction | Question mark, title underline |
| 2 | 18.99–30.76 | The First Step | Labels P(1) P(2) P(3) P(k) P(k+1) appear under the dominoes. Orange ring + tick on P(1); "Base Case" written above domino 1. | Settle on labels → close on domino 1 | P(1)…P(k+1), Base Case | Ring on P(1), tick, Base Case |
| 3 | 31.18–41.23 | The Chain Reaction | Camera travels along the chain to dominoes k and k+1. Orange ring on P(k), arc from domino k to k+1, implication P(k) → P(k+1), label Inductive Step. | Along chain → close on k, k+1 | P(k) → P(k+1), Inductive Step | Ring on P(k), arc, implication |
| 4 | 41.60–51.60 | A Mathematical Example | Camera travels down the world to the proof zone. "Example", then 1 + 2 + … + n = n(n+1)/2 written as the voice says it (numerator, bar, denominator). | Long travel down (same world) | Example, 1+2+…+n = n(n+1)/2 | — |
| 5 | 52.08–58.86 | Base Case | Orange header Base Case. n = 1, left side = 1, right side = 1(1+1)/2 = 1. Orange tick and box. | Hold, small pans down | n = 1, বামপাশ = 1, ডানপাশ = 1(1+1)/2 = 1 | Base Case header, tick, box |
| 6 | 59.26–76.06 | Inductive Step | Header Inductive Step. Assume P(k): 1+2+…+k = k(k+1)/2. Add (k+1) to both sides (orange). Simplify arrow. Result (k+1)(k+2)/2 in orange box. P(k+1) সত্য with tick. | Steady pans down the proof | ধরি P(k) সত্য, (k+1) যোগ, Simplify, (k+1)(k+2)/2 | (k+1) terms, result box |
| 7 | 76.45–89.68 | Computer Science Connection | Camera travels to the recursion zone: call chain sum(n) → sum(n-1) → … → sum(1) (base case) and a small tree. Orange sweep lights each call as the voice says every valid step. | Travel to zone C, hold | recursive algorithm, data structure, result, base case | Sweep over the call chain, tick |
| 8 | 90.11–102.84 | Final Payoff | Camera pulls out to the whole connected world, then returns to the chain: orange hop arcs between every neighbouring pair, chain continues to ∞. Proof zones dim so the chain is the focus; final overview with official logo. | Overview → chain close-up → along chain → overview + logo | Base Case ✓, hop arcs, ∞, logo | Ticks, hops, ∞ |

## Subtitle phrases (script text, measured timing)

| Start | End | Text |
|---|---|---|
| 0.00 | 2.54 | একটা ডমিনো পড়ে গেলে কী হয়? |
| 3.46 | 4.70 | পাশের ডমিনোটাও পড়ে যায়। |
| 5.08 | 6.32 | তারপর তার পাশেরটা। |
| 6.73 | 9.88 | এভাবে একটা ডমিনো থেকেই পড়ে যেতে পারে পুরো সারি। |
| 10.22 | 10.97 | কিন্তু জানো কি? |
| 11.10 | 15.89 | এই সাধারণ ঘটনাটার মধ্যেই লুকিয়ে আছে Mathematics-এর একটা powerful proof technique? |
| 16.34 | 18.51 | এর নাম Mathematical Induction। |
| 18.99 | 19.22 | ধরো, |
| 19.22 | 24.63 | আমাদের প্রমাণ করতে হবে একটা mathematical statement সব positive integer-এর জন্য সত্য। |
| 25.30 | 26.55 | প্রথমে নিশ্চিত করতে হবে, |
| 26.80 | 28.87 | statement-টা প্রথম সংখ্যার জন্য সত্য। |
| 29.34 | 30.76 | একেই বলে Base Case। |
| 31.18 | 33.29 | কিন্তু শুধু প্রথম ধাপ সত্য হলেই হবে না। |
| 33.74 | 35.25 | আমাদের এটাও প্রমাণ করতে হবে, |
| 35.60 | 39.03 | যেকোনো একটা ধাপ সত্য হলে তার পরের ধাপটাও সত্য হবে। |
| 39.49 | 41.23 | এটাকেই বলে Inductive Step। |
| 41.60 | 44.81 | এবার একটা mathematical example দেখি। |
| 45.15 | 46.19 | আমরা প্রমাণ করব, |
| 46.19 | 50.67 | এক থেকে n পর্যন্ত সব positive integer-এর যোগফল সমান n into n plus one, |
| 50.83 | 51.60 | divided by two। |
| 52.08 | 53.15 | প্রথমে Base Case। |
| 53.58 | 54.81 | n equals one বসালে, |
| 54.98 | 55.98 | বামপাশে পাই one, |
| 56.21 | 57.14 | আর ডানপাশেও one। |
| 57.49 | 58.86 | তাহলে Base Case সত্য। |
| 59.26 | 60.48 | এবার Inductive Step। |
| 60.96 | 61.40 | ধরে নিই, |
| 61.72 | 65.30 | n equals k পর্যন্ত যোগফল সমান k into k plus one, |
| 65.30 | 66.51 | divided by two। |
| 67.14 | 69.32 | এখন দুই পাশে k plus one যোগ করি। |
| 69.72 | 70.78 | Simplify করলে পাই, |
| 71.10 | 72.98 | k plus one into k plus two, |
| 73.12 | 73.92 | divided by two। |
| 74.29 | 74.71 | অর্থাৎ, |
| 74.92 | 76.06 | পরের ধাপটাও সত্য। |
| 76.45 | 82.85 | এই একই reasoning Computer Science-এ recursive algorithm এবং data structure-এর বিভিন্ন properties প্রমাণ করতে কাজে লাগে। |
| 83.31 | 85.64 | কারণ শুধু কোনো result পাওয়াই যথেষ্ট নয়। |
| 86.14 | 88.36 | কেন সেটা প্রতিটি valid step-এ কাজ করে, |
| 88.53 | 89.68 | সেটাও প্রমাণ করতে হয়। |
| 90.11 | 90.99 | তাহলে মনে রেখো, |
| 91.12 | 93.52 | Mathematical Induction-এর দুটি মূল শর্ত। |
| 94.00 | 95.41 | প্রথম ধাপ সত্য হতে হবে। |
| 95.76 | 98.56 | আর প্রতিটি ধাপ পরের ধাপকে নিশ্চিত করতে হবে। |
| 98.93 | 102.84 | এইভাবেই একটা ছোট্ট proof থেকে তৈরি হয় অসীমের chain। |
