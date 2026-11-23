# Historical Supabase backend

[ADR 0006](adr/0006-store-training-data-on-device.md) records the move to SQLite.
Use the [setup guide](setup.md) for the current contributor workflow and device
audit.

Before the cutover, OpenFit used Supabase for email OTP, account data, and
workout template storage. The [pre-cutover repository](https://github.com/open-source-fitness/open-fit/tree/63065abb17793d2b217d3b5d3161d1ae143da0ce)
preserves the app, migrations, Edge Functions, verification scripts, and
[setup guide](https://github.com/open-source-fitness/open-fit/blob/63065abb17793d2b217d3b5d3161d1ae143da0ce/docs/setup.md)
from that workflow. The [archived issue records](https://github.com/open-source-fitness/open-fit/tree/769334fa683a8a279c710dbbf9d91bca432c7d6f/agent-docs)
capture the specifications and verification results.

## Template rollout audit

The [historical maintainer guide](https://github.com/open-source-fitness/open-fit/blob/63065abb17793d2b217d3b5d3161d1ae143da0ce/docs/maintainers.md#template-rollout-audit)
records the former account-based rollout and audit.
