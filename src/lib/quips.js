// The page talks back, briefly and not often. Secrets are earned; quips are
// offered. One global cooldown keeps it dry. An exhausted pool goes silent,
// because a joke that begs is not one.

import QUIPS from "../data/quips.json";
import { toast } from "./secrets";

const COOLDOWN = 45 * 1000;
let lastSpoke = 0;
const used = {};

export function quip(trigger) {
  const pool = QUIPS[trigger];
  if (!pool || !pool.length) return false;
  const now = Date.now();
  if (now - lastSpoke < COOLDOWN) return false;
  const i = used[trigger] || 0;
  if (i >= pool.length) return false;
  used[trigger] = i + 1;
  lastSpoke = now;
  toast(pool[i]);
  return true;
}
