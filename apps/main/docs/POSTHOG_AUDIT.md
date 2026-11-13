# PostHog Audit — remote-v2-frontend

Reviewed: 2026-08-25 · SDK: `posthog-js` ^1.178.0 declared, `1.319.0` resolved

**State:** SDK is installed and wired. Automatic `$pageview` fires on route change. Phase 0 (reset, replay masking, init guard, `.env.example`) and Phase 1 (identity wrapper, `identify()` / `group()` on auth) are shipped. Core product events (orders, approvals, offboarding, etc.) are still not instrumented.

---

## 1. Current state (facts)

- **Init** — `src/lib/PostHog.tsx` via `resolvePostHogInitDecision` (`src/lib/posthogInitGuard.ts`): `api_host`, `capture_pageview: false`, `session_recording` with `maskInputOptions` (password, tel) and `maskTextSelector: "[data-ph-mask]"`. Missing key: loud `console.error` in dev/staging, skip init with `console.warn` in production.
- **Pageviews** — `posthog.capture("$pageview", ...)` in `PostHogPageview` (`src/lib/PostHog.tsx`).
- **Identity** — `src/lib/analytics.ts` (`identifyUser`, `identifyCompany`, `resetAnalytics`, `track`) wraps all `identify` / `group` / `reset` / `capture` calls in `safe()` so PostHog failures never throw. Wired via `useAnalyticsIdentity` in `AuthProtectWrapper` (dashboard) and `EmployeeAuthProtectWrapper` (employee portal).
- **Logout reset** — `clearClientAuthSession.ts` calls `resetAnalytics()` (not a raw `posthog.reset()`).
- **Import rule** — Product code must not call `posthog.identify` / `group` / `reset` / `capture` directly. Allowed exceptions: `src/lib/analytics.ts` (all SDK calls), `src/lib/PostHog.tsx` (init + `$pageview` + provider), `src/hooks/useFeatureFlag.ts` (`posthog-js/react` hooks).
- **Feature flags** — `src/hooks/useFeatureFlag.ts` wrapper exists. Of 2 flags in `src/config/featureFlags.ts`, only `ORDER_SCREEN_UI_UPDATE` is used. `ORDER_FLOWS_UI_UPDATE` is dead.
- **Provider** — mounted app-wide in `src/app/layout.tsx`, alongside GTM, Hotjar, Canny — no consent gate on any of them.
- **Tests** — `analytics.test.ts` (property mappers), `analytics.safe.test.ts` (throw safety), `posthogInitGuard.test.ts` (init guard + masking config).
- **Not present yet**: product event catalog (§4), ingestion proxy, consent gate, `alias()`.

---

## 2. Gaps

| #   | Gap                                     | Sev      | Status                                        | Outcome once fixed                                                                  | Why it's worth doing                                                                                      |
| --- | --------------------------------------- | -------- | --------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | No `identify()` / `group()`             | Critical | **Done (Phase 1)**                            | Every event attributable to a user + company                                        | Rayda is sold per-company; without this, no metric can be sliced by account.                              |
| 2   | Core product loop untracked             | Critical | Open                                          | Order, onboarding, offboarding, approvals all emit events                           | Right now "where do admins drop off" is unanswerable. This is the actual product data.                    |
| 3   | No replay masking / consent gate        | Critical | **Masking done (Phase 0)**; consent gate open | Address, phone, tax fields never recorded raw                                       | App handles PII in these flows. Legal/compliance exposure if replay is on at project level (verify).      |
| 4   | No `reset()` on logout                  | Critical | **Done (Phase 0)**                            | Identity doesn't bleed across users on shared devices                               | Becomes an active bug the moment #1 ships — next user inherits the last one's identity.                   |
| 5   | No ingestion proxy                      | High     | Open                                          | Ad-blocked traffic (~20-30%) recovered                                              | Every current metric is under-counted, skewed toward less technical users.                                |
| 6   | No env separation / silent init failure | High     | **Done (Phase 0)**                            | Missing key fails loudly in dev; local traffic never lands in the prod project      | Prevents dev noise from polluting real metrics; saves the next engineer a silent no-op debugging session. |
| 7   | No analytics wrapper                    | Medium   | **Done (Phase 1)**                            | One typed `track()`/`identify()` module, not raw `posthog` imports scattered around | Stops event-name drift before it starts.                                                                  |
| 8   | Hotjar + PostHog overlap                | Medium   | Open                                          | One tool for replay/heatmaps, not two                                               | Removes redundant cost and a second consent surface.                                                      |

---

## 3. Fix plan

### Phase 0 — risk reduction ✅

| Task                                                                                  | Outcome                                           | Why                                                                               |
| ------------------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------- |
| Call `resetAnalytics()` in `clearClientAuthSession.ts`                                | Logout clears PostHog identity                    | Closes gap #4 before identity even exists, so there's no window where it's broken |
| Add `session_recording.maskInputOptions` + a `maskTextSelector` for tagged PII fields | Address/tax/phone inputs never captured in replay | Closes gap #3                                                                     |
| Guard `posthog.init()` on missing key                                                 | Loud failure in dev instead of silent no-op       | Closes gap #6                                                                     |
| Add `.env.example` entries for both PostHog vars                                      | New engineers know the vars exist                 | Removes onboarding friction                                                       |

```ts
posthog.init(process_key, {
  api_host: process_host,
  capture_pageview: false,
  session_recording: {
    maskInputOptions: { password: true, tel: true },
    maskTextSelector: "[data-ph-mask]",
  },
});
```

### Phase 1 — identity foundation ✅

| Task                                                                                              | Outcome                                                       | Why                                                        |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- |
| Add `src/lib/analytics.ts` (`identifyUser`, `identifyCompany`, `resetAnalytics`, `track`, `safe`) | One typed entry point for all future events                   | Closes gap #7                                              |
| Call `identifyUser` + `identifyCompany` via `useAnalyticsIdentity` in both auth protect wrappers  | Every authenticated surface carries person + company identity | Closes gap #1 — unblocks every downstream item in this doc |

```ts
export function identifyUser(user: IUser) {
  posthog.identify(user.id, {
    email: user.email,
    role: user.role,
    stage: user.stage,
  });
}
export function identifyCompany(company: ICompany) {
  posthog.group("company", company.id, {
    name: company.name,
    industry: company.industry,
    size: company.size,
    country: company.country?.name,
    currency_code: company.currency_code,
  });
}
```

### Phase 2 — ingestion reliability

| Task                                                                                     | Outcome                      | Why                                         |
| ---------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------- |
| Add a Next.js rewrite proxying `/ingest` to PostHog's cloud host, point `api_host` at it | Ad-blocked traffic recovered | Closes gap #5, zero SDK-side changes needed |

```js
// next.config.mjs
async rewrites() {
  return [{ source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" }];
}
```

### Phase 3 — instrument the product

Wire the six event groups in §4 into their real call sites, one group at a time. Outcome: the core loop (§2 gap #2) stops being invisible.

| Task                                                                                  | Call site                                                                                                                                                                                                                                                                                       | Outcome                                                                    | Why                                                                                                                         |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Fire §4.1 order events (`Item Source Selected` → `Order Submitted`/`Order Cancelled`) | `handleConfirm` in `src/container/Dashboard/EquipEmployee/OrderSummary/useOrderSummaryPayment.ts:69` — already branches on `useEquipEmployeePaymentMutation` / `useOnboardingPaymentMutation` / `useBuyToStoragePaymentMutation`, so `source_mix` can be read straight off which mutation fired | A real, source-split order funnel                                          | Highest-traffic flow in the app and currently the most invisible — this closes gap #2 by itself for the biggest slice of it |
| Fire §4.2 approval events (`Approval Queued` → `Approval Reviewed`)                   | `useApprovalRequestActions.ts:20-31` — `useApproveCatalogPolicyOrderRequestMutation`, `useConvertCatalogPolicyOrderRequestToRfqMutation`, `useRejectCatalogPolicyOrderRequestMutation` all live here already                                                                                    | `time_to_decision_s` per approval                                          | Turns the approvals bottleneck from a suspicion into a number                                                               |
| Fire §4.3 offboarding events (`Offboarding Started` → `Offboarding Confirmed`)        | offboarding order-summary submit handler, `src/container/Offboarding/OffboardingOrderSummary.tsx`                                                                                                                                                                                               | Disposition mix (reassign/resale/storage/buy_to_storage/archive) over time | Tells you if devices are being recycled or piling up in storage                                                             |
| Fire §4.4 activation events (`Signup Started` → `Onboarding Completed`)               | the four `useEffect` branches in `AuthProtectWrapper.tsx:49-73` that already switch on `user.stage`                                                                                                                                                                                             | Activation funnel with a real drop-off step                                | No current way to know what fraction of signups ever finish                                                                 |
| Fire §4.5 employee portal events                                                      | employee-side equivalents under `src/app/employee/*` (catalogs, orders, verify-delivery)                                                                                                                                                                                                        | Self-service adoption rate                                                 | This side of the product has zero visibility today — see §4.5                                                               |
| Fire §4.6 admin power-feature events                                                  | kit/policy/storage save handlers under `src/container/Dashboard/Kits`, `CatalogPolicies`, `Storage`                                                                                                                                                                                             | Adoption rate of the features that replace one-at-a-time ordering          | Low usage here is a direct "still doing manual work" signal                                                                 |

All six route through the `track()` function added in Phase 1 — no direct `posthog` imports at any of these call sites.

---

## 4. Event catalog

Convention: `Object Verbed`, past tense, Title Case.

### 4.1 Admin order flow, by source

Reuses the app's existing `ItemSource` vocabulary (`storage` / `marketplace` / `rfq`) instead of inventing new labels.

| Event                    | Fires                                  | Properties                                            |
| ------------------------ | -------------------------------------- | ----------------------------------------------------- |
| `Equip Flow Started`     | Admin opens equip flow for an employee | `employee_id`, `trigger`                              |
| `Item Source Selected`   | storage / marketplace / RFQ tab chosen | `source`                                              |
| `Marketplace Item Added` | item added from Marketplace            | `item_id`, `category`, `price`, `currency`            |
| `Storage Item Assigned`  | item pulled from company storage       | `item_id`, `country_id`                               |
| `RFQ Requested`          | custom device request submitted        | `spec_type`, `employee_id`                            |
| `Order Summary Viewed`   | any order-summary screen               | `order_flow`, `item_count`                            |
| `Order Submitted`        | order confirmed                        | `order_id`, `item_count`, `total_value`, `source_mix` |
| `Order Cancelled`        | user exits mid-flow                    | `order_id`, `step_abandoned`                          |

**Outcome:** a real funnel per sourcing path, and a cancellation reason (`step_abandoned`) instead of a single opaque completion rate. **Why:** storage/RFQ/marketplace orders have different approval paths and lead times — one blended funnel hides which path is actually slow.

### 4.2 Approvals

Mirrors existing status values (`AWAITING_APPROVAL`, `AWAITING_RFQ`, `APPROVED`, `FAILED`, `CANCELLED`) and tier (`IMPORTANT`/`REQUIRED`/`OPTIONAL`).

| Event                | Fires                                    | Properties                                      |
| -------------------- | ---------------------------------------- | ----------------------------------------------- |
| `Approval Queued`    | order enters awaiting state              | `approval_id`, `status`, `tier`                 |
| `Approval Reviewed`  | approver decides                         | `approval_id`, `decision`, `time_to_decision_s` |
| `RFQ Quote Actioned` | admin approves/declines a returned quote | `approval_id`, `decision`                       |

**Outcome:** `time_to_decision_s` gives an approvals-bottleneck metric with no manual reporting. **Why:** `AWAITING_RFQ` implies a manual quote round-trip — almost certainly the slowest path in the product; this confirms it with a number instead of a guess.

### 4.3 Offboarding

Mirrors the app's existing disposition types (`reassign`, `resale`, `storage`, `buy_to_storage`, `archive`).

| Event                         | Fires                     | Properties                    |
| ----------------------------- | ------------------------- | ----------------------------- |
| `Offboarding Started`         | flow entered              | `employee_id`, `device_count` |
| `Device Disposition Selected` | per-device outcome chosen | `device_id`, `disposition`    |
| `Offboarding Confirmed`       | order submitted           | `order_id`, `disposition_mix` |

**Outcome:** disposition mix over time. **Why:** high `storage` share = devices piling up as a cost center rather than being resold/reassigned — a concrete signal for account health or a nudge feature.

### 4.4 Signup / activation

Mirrors existing `user.stage` values.

| Event                       | Fires                         |
| --------------------------- | ----------------------------- |
| `Signup Started`            | stage → `Verification`        |
| `Company Profile Completed` | stage → `Company Information` |
| `Onboarding Completed`      | stage → `Completed`           |
| `First Country Selected`    | `CountryFirstModal` confirmed |

**Outcome:** an activation funnel with a real drop-off step. **Why:** currently no way to know what fraction of signups ever reach `Completed`.

### 4.5 Employee self-service portal

Zero instrumentation today. Gated on `user.role === "Basic"`.

| Event                      | Fires                                             |
| -------------------------- | ------------------------------------------------- |
| `Employee Catalog Viewed`  | employee opens catalog                            |
| `Employee Order Submitted` | self-service order placed                         |
| `Track Page Viewed`        | `/track/[orderId]` opened (often unauthenticated) |
| `Delivery Verified`        | receipt confirmed                                 |
| `Employee Asset Viewed`    | employee checks assigned assets                   |

**Outcome:** a self-service adoption rate. **Why:** this is a whole separate portal an admin never sees used — right now nobody can tell if it's adopted or if every request still routes through an admin.

### 4.6 Admin power features

| Event                         | Fires                    |
| ----------------------------- | ------------------------ |
| `Kit Created`                 | new kit saved            |
| `Catalog Policy Rule Created` | rule saved               |
| `Storage Employees Assigned`  | bulk-assign from storage |

**Outcome:** adoption rate of the features that replace one-at-a-time ordering. **Why:** low usage here is a direct "still doing manual work" signal worth acting on.

---

## 5. Likely friction points (inferred, not measured — confirm with §4 data before acting)

| Signal in code                                                                              | Inference                                                                    | Confirm with                                       |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------- |
| `refresh-order-summary` / `refresh-view-action` exist as separate routes from the base flow | Original screens didn't hold up under real use (stale state, failed submits) | `Order Cancelled` volume on these specific screens |
| Three-way item sourcing in one step                                                         | Admins may default to marketplace even when cheaper storage stock exists     | `Item Source Selected` distribution                |
| Separate employee self-service portal                                                       | Real bet on employee self-service — unverified                               | §4.5 adoption rate                                 |
| `AWAITING_RFQ` as a distinct state                                                          | Manual quote round-trip is the slowest approval path                         | `time_to_decision_s` split by status               |

---

## 6. PostHog features to enable

All depend on §3 landing first.

| Feature                                   | Outcome                                                                     | Why worth doing                                                        |
| ----------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Group Analytics (`company` as group type) | Every metric sliceable per-account                                          | Matches how Rayda is actually sold and used                            |
| Funnels                                   | Activation funnel + order funnel (by source)                                | Answers "do signups convert" and "do orders complete" directly         |
| Paths                                     | Actual click-path through the equip flow                                    | Shows detours funnels miss (e.g. bouncing between storage/marketplace) |
| Session Replay (masked)                   | Watch sessions tied to `Order Cancelled` or stalled `refresh-order-summary` | Targeted debugging instead of random session review                    |
| Cohorts                                   | "0 orders in 30 days" standing cohort                                       | Ready-made at-risk-account list, no manual query                       |
| Experiments                               | Real A/B on `ORDER_SCREEN_UI_UPDATE`                                        | Measures actual conversion delta instead of shipping a blind toggle    |
| Surveys                                   | Triggered after `Order Submitted` / `Offboarding Confirmed`                 | Feedback tied to a completed action, not a random timer                |

---

## 7. Dashboards

**Admin / IT ops**

- Activation funnel + time-to-complete
- Order funnel by source, with per-step drop-off
- Approval time-to-decision, by status and tier
- Offboarding disposition mix over time
- Companies with 0 orders in 30 days

**Employee self-service**

- Self-service orders as a % of all orders per company
- Catalog view → order conversion
- Delivery-verified completion rate
- Track page volume (proxy for order-status pressure not resolved by notifications)

---

## 8. IT-management pivot — what changes for tracking

Rayda is moving from procurement (one-time orders) to ongoing IT/fleet management, covering on-site companies as well as remote ones. §4's order-funnel events stay relevant — this adds _ongoing fleet visibility_ on top, using data that already exists in the app today.

### 8.1 New events — buildable now

| Event                       | Fires                                   | Properties                        | Outcome                                                         | Why                                                                                                        |
| --------------------------- | --------------------------------------- | --------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `Asset Vault Viewed`        | admin opens All Equipments              | `tab` (equipment/archive/refresh) | Rate of fleet checks outside of ordering                        | Is this pivot's core behavior — admins checking fleet state, not just placing orders — actually happening? |
| `Equipment Filtered`        | filter applied in All Equipments        | `filter_type`, `value`            | Which fleet-view dimensions admins actually reach for           | Confirms whether today's filters (type/status/RAM/storage/country) match what admins need                  |
| `Device Refresh Tab Viewed` | Asset Vault → Device Refresh tab opened | —                                 | Engagement on the one ongoing-lifecycle feature already shipped | Low usage here = a discoverability gap on existing fleet-management functionality, not a new build         |
| `Refresh Order Triggered`   | admin acts on a Due/Overdue device      | `asset_type`, `refresh_status`    | Refresh-to-replacement conversion                               | Tests whether the refresh nudge drives action                                                              |
| `Department Roster Viewed`  | admin opens a department page           | `member_count`, `asset_count`     | Team-level usage, not just device-level                         | Matches "manage their IT team," not only devices                                                           |

### 8.2 Fleet features that don't exist yet — can't be tracked until built

| Missing                    | What exists instead                                                                              | Blocks                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Repair/incident logging    | `under_repair`/`faulty` are read-only status values — no write path anywhere in the frontend     | No event to fire — there's no action that produces one            |
| Live MDM/compliance status | `device_setup` is a one-time pre-ship enrollment choice (Intune/ABM), not an ongoing check-in    | No compliance or "last seen" signal exists to track               |
| Physical site/location     | Only `country_id` — storage is a Rayda-operated warehouse per country, not a customer's own site | Blocks on-site company support outright, not just tracking        |
| Employee-device history    | `IEmployees.equipment` is current-snapshot only; history exists per-device, not per-employee     | Can't build a "device history" view or event on the employee side |
| Org structure              | `IDepartment` is a flat name + member list, `head` is hardcoded `null`                           | No real org-chart-aware team dashboard possible yet               |

**Outcome:** avoids instrumenting events for features that don't exist. **Why:** the pivot's own framing needs these five built first — right now only the order funnel and the two already-shipped fleet-adjacent features (status view, refresh cadence) have anything to measure.

### 8.3 Dashboard addition

**Fleet health** — status distribution (assigned / unassigned / in_storage / under_repair / faulty / archived), refresh due/overdue count, storage-by-country totals, department asset_count vs. member_count.

---

## 9. Package updates

| Package      | Declared   | Latest compatible | Outcome                                                            | Why                                                                                       |
| ------------ | ---------- | ----------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `posthog-js` | `^1.178.0` | `1.418.12`        | Fixes/features from ~240 releases picked up with zero code changes | Range already allows it — `npm install` alone closes the gap, no package.json edit needed |

---

## 10. File reference

| File                                                              | Role                                                                              |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `src/lib/PostHog.tsx`                                             | init, provider, the one existing event                                            |
| `src/hooks/useFeatureFlag.ts`                                     | flag hook wrapper                                                                 |
| `src/config/featureFlags.ts`                                      | flag registry                                                                     |
| `src/app/layout.tsx`                                              | mounts PostHog app-wide, alongside GTM/Hotjar/Canny                               |
| `src/utils/auth/clearClientAuthSession.ts`                        | logout — needs `posthog.reset()`                                                  |
| `src/components/HOC/AuthProtectWrapper.tsx`                       | has `user` + `company` in scope — where `identify`/`group` go                     |
| `src/types/equipments.ts`                                         | device/asset model — status vocabulary, refresh fields, no warranty/repair fields |
| `src/components/AllEquipments/AllEquipmentsTable/tableColumn.tsx` | full runtime status vocabulary (incl. `under_repair`, `faulty`)                   |
