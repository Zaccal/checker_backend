// global.d.ts
declare global {
  namespace globalThis {
    var authHeader: HeadersInit;
  }
}

export {};
