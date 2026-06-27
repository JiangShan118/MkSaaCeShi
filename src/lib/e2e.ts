export const E2E_TEST_SECRET_HEADER = 'x-e2e-secret';

export function isE2ETestMode() {
  return (
    process.env.NODE_ENV === 'development' &&
    process.env.E2E_TEST_SECRET === 'mksaas-e2e-secret'
  );
}

export function isValidE2ETestRequest(request: Request) {
  return (
    isE2ETestMode() &&
    request.headers.get(E2E_TEST_SECRET_HEADER) === process.env.E2E_TEST_SECRET
  );
}
