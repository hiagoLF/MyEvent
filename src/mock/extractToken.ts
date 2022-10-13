export function extractToken(authorization?: string) {
  if (authorization) {
    return JSON.parse(authorization.split(' ')[2]);
  }
  return undefined;
}
