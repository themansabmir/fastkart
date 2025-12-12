type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  route?: string;
  method?: string;
  userId?: string;
  ip?: string;
  duration?: number;
  statusCode?: number;
  error?: unknown;
  [key: string]: unknown;
}

function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

export const logger = {
  info: (message: string, context?: LogContext) => {
    console.log(formatLog("info", message, context));
  },

  warn: (message: string, context?: LogContext) => {
    console.warn(formatLog("warn", message, context));
  },

  error: (message: string, context?: LogContext) => {
    console.error(formatLog("error", message, context));
  },

  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(formatLog("debug", message, context));
    }
  },

  api: {
    request: (method: string, route: string, context?: Omit<LogContext, "method" | "route">) => {
      logger.info(`API Request: ${method} ${route}`, { method, route, ...context });
    },

    response: (method: string, route: string, statusCode: number, duration: number, context?: Omit<LogContext, "method" | "route" | "statusCode" | "duration">) => {
      const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";
      logger[level](`API Response: ${method} ${route} ${statusCode} (${duration}ms)`, {
        method,
        route,
        statusCode,
        duration,
        ...context,
      });
    },

    error: (method: string, route: string, error: unknown, context?: Omit<LogContext, "method" | "route" | "error">) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      logger.error(`API Error: ${method} ${route} - ${errorMessage}`, {
        method,
        route,
        error: errorMessage,
        stack: errorStack,
        ...context,
      });
    },
  },
};

export function withLogging<T>(
  method: string,
  route: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const start = Date.now();
  logger.api.request(method, route, context);

  return fn()
    .then((result) => {
      const duration = Date.now() - start;
      logger.api.response(method, route, 200, duration, context);
      return result;
    })
    .catch((error) => {
      const duration = Date.now() - start;
      logger.api.error(method, route, error, { ...context, duration });
      throw error;
    });
}
