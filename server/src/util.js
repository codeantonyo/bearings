// Wrap an async Express handler so rejected promises reach the error handler
// instead of crashing the function (Express 4 doesn't catch async throws).
export const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
