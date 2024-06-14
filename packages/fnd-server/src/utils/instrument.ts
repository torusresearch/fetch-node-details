import * as Sentry from "@sentry/node";
import { LoglevelSentry, redactBreadcrumbData } from "@toruslabs/loglevel-sentry";
import log from "loglevel";

import redact from "./redactSentry";

const sentryDsn = process.env.SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.NODE_ENV,
    integrations: [
      // enable HTTP calls
      Sentry.httpIntegration({ breadcrumbs: true }),

      // application not responding detection.
      Sentry.anrIntegration({ captureStackTrace: true }),
    ],
    tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE ? Number(process.env.SENTRY_TRACES_SAMPLE_RATE) : 0.01,
    sampleRate: process.env.SENTRY_SAMPLE_RATE ? Number(process.env.SENTRY_SAMPLE_RATE) : 0.1,
    beforeSend(event) {
      return redact(event);
    },
    beforeBreadcrumb(breadcrumb) {
      return redactBreadcrumbData(breadcrumb);
    },
  });

  const plugin = new LoglevelSentry(Sentry);
  plugin.install(log);
}
