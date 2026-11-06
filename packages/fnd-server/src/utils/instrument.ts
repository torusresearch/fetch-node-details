import * as Sentry from "@sentry/node";
import { LoglevelSentry, redactBreadcrumbData } from "@toruslabs/loglevel-sentry";
import log from "loglevel";

import redact from "./redactSentry";

const sentryDsn = process.env.SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.NODE_ENV,
    // Sentry 11 collects cookies, user info, headers, and bodies unless this is set.
    // Keep the v10 behavior: do not send that data.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      stackFrameVariables: false,
    },
    integrations: [
      // application not responding detection.
      Sentry.anrIntegration({ captureStackTrace: true }),
    ],
    tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE ? Number(process.env.SENTRY_TRACES_SAMPLE_RATE) : 0.01,
    sampleRate: process.env.SENTRY_SAMPLE_RATE ? Number(process.env.SENTRY_SAMPLE_RATE) : 1,
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
