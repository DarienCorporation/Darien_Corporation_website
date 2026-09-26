import "server-only";

/**
 * Fixed-window rate limiter kept in memory. Each limiter has a per-key limit
 * and a global limit across all keys, so rotating IPs cannot exceed the
 * global ceiling. In-memory state is per server instance; for multi-instance
 * deployments back this with a shared store (Redis/KV).
 */
type Bucket = { count: number; reset: number };

export type Limiter = {
  /** Records a hit. Returns true when the request should be blocked. */
  hit(key: string): boolean;
  /** Returns true if the key (or the global bucket) is currently blocked, without recording. */
  blocked(key: string): boolean;
  reset(key: string): void;
};

export function createLimiter(opts: { windowMs: number; perKey: number; global: number }): Limiter {
  const buckets = new Map<string, Bucket>();
  const GLOBAL = "\u0000global";

  const get = (key: string, now: number) => {
    let b = buckets.get(key);
    if (!b || now >= b.reset) {
      b = { count: 0, reset: now + opts.windowMs };
      buckets.set(key, b);
    }
    return b;
  };

  const sweep = (now: number) => {
    if (buckets.size < 10_000) return;
    for (const [k, b] of buckets) if (now >= b.reset) buckets.delete(k);
  };

  return {
    hit(key) {
      const now = Date.now();
      sweep(now);
      const k = get(key, now);
      const g = get(GLOBAL, now);
      k.count++;
      g.count++;
      return k.count > opts.perKey || g.count > opts.global;
    },
    blocked(key) {
      const now = Date.now();
      return get(key, now).count >= opts.perKey || get(GLOBAL, now).count >= opts.global;
    },
    reset(key) {
      buckets.delete(key);
    },
  };
}
