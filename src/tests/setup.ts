beforeAll(() => {
  globalThis.authHeader = {
    'Content-type': 'application/json',
    Authorization: `Bearer ${process.env.AUTH_TOKEN ?? ''}`,
    Cookie: `${process.env.AUTH_COOKIE_NAME ?? ''}=${
      process.env.AUTH_COOKIE_VALUE ?? ''
    }`,
  }
})

afterAll(() => {
  globalThis.authHeader = {}
})
