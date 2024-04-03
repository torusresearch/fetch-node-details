import * as Sentry from "@sentry/node";
import LoglevelSentryPlugin, { redactBreadcrumbData } from "@toruslabs/loglevel-sentry";
import { Express } from "express";
import log from "loglevel";

import redact from "./redactSentry";

export const registerSentry = (app: Express): void => {
  const sentryDsn = process.env.SENTRY_DSN;
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      environment: process.env.NODE_ENV,
      integrations: [
        // enable HTTP calls
        new Sentry.Integrations.Http({ tracing: true, breadcrumbs: true }),

        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({
          // to trace all requests to the default router
          app,
          // alternatively, you can specify the routes you want to trace:
          // router: someRouter,
        }),
      ],
      tracesSampleRate: 0.001,
      sampleRate: 0.1,
      beforeSend(event) {
        return redact(event);
      },
      beforeBreadcrumb(breadcrumb) {
        return redactBreadcrumbData(breadcrumb);
      },
    });
    app.use(
      Sentry.Handlers.requestHandler({
        ip: true,
        request: ["public_address", "data", "headers", "method", "query_string", "url"],
      })
    );
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());

    const plugin = new LoglevelSentryPlugin(Sentry);
    plugin.install(log);
  }
};

export const registerSentryErrorHandler = (app: Express): void => {
  const sentryDsn = process.env.SENTRY_DSN;
  if (sentryDsn) {
    app.use(
      Sentry.Handlers.errorHandler({
        shouldHandleError() {
          // always capture errors. Will dial down later if needed
          return true;
        },
      })
    );
  }
};
