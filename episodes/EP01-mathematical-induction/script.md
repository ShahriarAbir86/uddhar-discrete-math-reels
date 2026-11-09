# EP-01 — Mathematical Induction
## How One Domino Proves an Infinite Pattern

### Scene 01 — The Question
একটা ডমিনো পড়ে গেলে কী হয়? পাশের ডমিনোটাও পড়ে যায়। তারপর তার পাশেরটা। এভাবে একটা ডমিনো থেকেই পড়ে যেতে পারে পুরো সারি। কিন্তু জানো কি? এই সাধারণ ঘটনাটার মধ্যেই লুকিয়ে আছে Mathematics-এর একটা powerful proof technique? এর নাম Mathematical Induction।

### Scene 02 — The First Step
ধরো, আমাদের প্রমাণ করতে হবে একটা mathematical statement সব positive integer-এর জন্য সত্য। প্রথমে নিশ্চিত করতে হবে, statement-টা প্রথম সংখ্যার জন্য সত্য। একেই বলে Base Case।

### Scene 03 — The Chain Reaction
কিন্তু শুধু প্রথম ধাপ সত্য হলেই হবে না। আমাদের এটাও প্রমাণ করতে হবে, যেকোনো একটা ধাপ সত্য হলে তার পরের ধাপটাও সত্য হবে। এটাকেই বলে Inductive Step।

### Scene 04 — A Mathematical Example
এবার একটা mathematical example দেখি। আমরা প্রমাণ করব, এক থেকে n পর্যন্ত সব positive integer-এর যোগফল সমান n into n plus one, divided by two।

### Scene 05 — Base Case
প্রথমে Base Case। n equals one বসালে, বামপাশে পাই one, আর ডানপাশেও one। তাহলে Base Case সত্য।

### Scene 06 — Inductive Step
এবার Inductive Step। ধরে নিই, n equals k পর্যন্ত যোগফল সমান k into k plus one, divided by two। এখন দুই পাশে k plus one যোগ করি। Simplify করলে পাই, k plus one into k plus two, divided by two। অর্থাৎ, পরের ধাপটাও সত্য।

### Scene 07 — Computer Science Connection
এই একই reasoning Computer Science-এ recursive algorithm এবং data structure-এর বিভিন্ন properties প্রমাণ করতে কাজে লাগে। কারণ শুধু কোনো result পাওয়াই যথেষ্ট নয়। কেন সেটা প্রতিটি valid step-এ কাজ করে, সেটাও প্রমাণ করতে হয়।

### Scene 08 — Final Payoff
তাহলে মনে রেখো, Mathematical Induction-এর দুটি মূল শর্ত। প্রথম ধাপ সত্য হতে হবে। আর প্রতিটি ধাপ পরের ধাপকে নিশ্চিত করতে হবে। এইভাবেই একটা ছোট্ট proof থেকে তৈরি হয় অসীমের chain।

## Mathematical reference
The proposition is:
`P(n): 1 + 2 + ... + n = n(n+1)/2`, for positive integers `n`.

Base case:
`P(1): 1 = 1(1+1)/2 = 1`.

Inductive hypothesis:
Assume `P(k)`:
`1 + 2 + ... + k = k(k+1)/2`.

Inductive step:
`1 + ... + k + (k+1)`
`= k(k+1)/2 + (k+1)`
`= (k+1)(k+2)/2`.
Thus `P(k+1)` follows from `P(k)`.

Important: the domino image is an intuition metaphor. The formal proof is the base case plus the implication from `P(k)` to `P(k+1)`.
