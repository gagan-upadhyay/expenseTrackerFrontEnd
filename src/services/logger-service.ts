// services/logger-service.ts
// Simple cross-platform logger that merely wraps console methods. This
// implementation avoids any Node-specific dependencies so the client bundle
// stays clean. For server-side logging you can always replace this with a more
// advanced solution (e.g. winston) in your API routes or edge functions.

interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const getLogger = (name: string): Logger => {
  const prefix = `[${name}]`;
  return {
    debug: (...args) => console.debug(prefix, ...args),
    info: (...args) => console.info(prefix, ...args),
    warn: (...args) => console.warn(prefix, ...args),
    error: (...args) => console.error(prefix, ...args),
  };
};

export default getLogger;