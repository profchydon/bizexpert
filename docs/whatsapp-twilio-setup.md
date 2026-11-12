# WhatsApp Twilio Flows setup

The **agreed** WhatsApp channel is Twilio: text + [WhatsApp Flows](https://www.twilio.com/docs/content/whatsapp-flows) (`whatsapp/flows`), not Meta Graph send.

The **running API is still Meta**. There is no `twilio` package, no `POST /whatsapp/twilio`, and no Flow inbox. Live VERIFY + AI still follow [whatsapp-setup.md](whatsapp-setup.md). Use this guide for Twilio Console / WABA / Flow / Content Template work, and for the Nest wiring we already planned (replace Graph send, `POST /whatsapp/twilio`, request Flow inbox).

First Flow: **customer request** (enquiry / complaint / restock). Lumi-style commerce reuses the same send/submit pipeline later.

Do **not** use Twilio Content Template Builder `twilio/flows`. Flows are authored in WhatsApp Manager; Twilio templates, sends, and webhooks them.

## What you get after transport is wired

- Staff: same Settings → WhatsApp link, `VERIFY`, then AI text (sales, stock, confirmations).
- Customers: in-session request Flow; submissions land in `/dashboard/whatsapp`.
- Outbound text (VERIFY, AI, daily digest, sale share) goes through Twilio `messages.create` with `from`/`to` as `whatsapp:+E164`.

One platform WhatsApp sender for the whole product (no per-business WABA).

## 1. Twilio account and WhatsApp sender

1. Create a [Twilio account](https://www.twilio.com/console). Copy **Account SID** and **Auth Token**.
2. Create an [API Key + Secret](https://www.twilio.com/console/runtime/api-keys) (REST uses these; Auth Token is for webhook signatures).
3. Enable a WhatsApp sender:
   - **Local:** [Twilio Sandbox for WhatsApp](https://www.twilio.com/docs/whatsapp/quickstart) — send `join <code>` to the Sandbox number, then set the Sandbox inbound webhook.
   - **Production:** [self-sign up a WhatsApp sender](https://www.twilio.com/docs/whatsapp) on a WABA (Messaging → Senders → WhatsApp Senders). Connect Meta Business Manager when the Console asks.
4. Sender address format: `whatsapp:+2348012345678`.

WhatsApp requires an opt-in before you message a user. Free-form text is only inside the **24-hour** customer-care window after they message you. Outside that window you must send an **approved** Content Template.

## 2. Env vars (API)

When the Twilio slice lands, these replace `WHATSAPP_*` Meta vars in `apps/api/.env`:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_API_KEY=SKxxxxxxxx
TWILIO_API_SECRET=xxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+234xxxxxxxxxx
TWILIO_REQUEST_FLOW_CONTENT_SID=HXxxxxxxxx
```

Missing credentials must skip send (same as today’s Graph skip), not crash.

## 3. Create the Meta Flow

You need a Twilio WhatsApp sender **and** a WABA. Author in WhatsApp Manager or Meta’s Flow API. Preview in the [Flow playground](https://developers.facebook.com/docs/whatsapp/flows/playground).

Customer-request screens (first screen id `REQUEST_TYPE`):

1. **REQUEST_TYPE** — single-choice: Enquiry / Complaint / Restock
2. **DETAILS** — name, optional customer phone, long text, optional product (restock)
3. **CONFIRM** — complete

Publish the Flow. Copy **Flow ID** and first screen id.

Do not put HIPAA or PCI data in Flows (Twilio forbids it).

## 4. Twilio `whatsapp/flows` Content Template

Create a template with the Flow ID via the [Content API](https://www.twilio.com/docs/content/whatsapp-flows):

- `body`: `Tell us how we can help`
- `button_text`: `Open form`
- `flow_id`: the published Flow ID
- `flow_token`: `{{1}}` (unique per send)
- `flow_first_page_id`: `REQUEST_TYPE`

Submit for WhatsApp approval as **UTILITY** (request form). Use **MARKETING** only if you later blast a catalog. In-session Flow send (user already messaged you) does not need that approval.

Put the returned Content SID (`HX…`) in `TWILIO_REQUEST_FLOW_CONTENT_SID`.

Each send must pass a new `flow_token`. The plan encodes `businessId` + purpose (`request` now, `order` later) so the webhook can route the tenant.

## 5. Inbound webhook

Expose HTTPS to the API (tunnel to port `3001` locally). In Twilio, set **When a message comes in** on the Sandbox or the WhatsApp sender:

```
POST https://<your-public-host>/api/v1/whatsapp/twilio
```

Twilio posts `application/x-www-form-urlencoded`. Planned fields:

| Field                | Use                                                                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `From`, `To`         | `whatsapp:+E164`                                                                                                                                     |
| `Body`, `MessageSid` | Staff text → existing `process-message` job                                                                                                          |
| `InteractiveData`    | Flow submit JSON → `process-flow-submission`                                                                                                         |
| `X-Twilio-Signature` | Validate with `TWILIO_AUTH_TOKEN` ([request validation](https://www.twilio.com/docs/usage/security#validating-requests)). Fail closed in production. |

Keep `GET/POST /api/v1/whatsapp/webhook` until Twilio is live, then remove the Meta handshake.

Until `POST /whatsapp/twilio` exists, Twilio will get an HTTP error at that path. Finish Console + Flow + template first; the Nest webhook is the code slice.

## 6. Try the two paths (after Nest is wired)

**Staff**

1. Owner/Admin: `/dashboard/settings?tab=whatsapp`, link E.164, reply `VERIFY` to the Twilio sender.
2. Ask `How much did we sell today?` or confirm a sale with `CONFIRM <id>`.

**Customer**

1. Customer messages the sender (opens the 24h window).
2. Unlinked numbers get the request Flow, not “link in Settings”.
3. Submit enquiry / complaint / restock → inbox `/dashboard/whatsapp` (`WhatsappFlowSubmission`).
4. Optional: send the approved template from a customer record (“Send request form”).

## 7. Commerce later

Do not build catalog/order Flow screens in the first slice. Same pipeline, `purpose: order`, then create `Sale` with `SaleSource.whatsapp`. Staff AI sale/stock stays text.

## Checklist

| Symptom                         | Check                                                                             |
| ------------------------------- | --------------------------------------------------------------------------------- |
| Twilio 403 / invalid signature  | Public URL equals the exact webhook URL; `TWILIO_AUTH_TOKEN` is the account token |
| No inbound                      | Webhook on **this** sender or Sandbox; HTTPS; Redis up                            |
| Template rejected / not sending | Approval status; outside 24h you must use the approved SID                        |
| Flow never opens                | Published Flow ID on the Content Template; `flow_first_page_id` matches           |
| Staff still hitting Graph       | Meta env still in use — Twilio transport not merged yet                           |

## Official docs

- [whatsapp/flows](https://www.twilio.com/docs/content/whatsapp-flows)
- [WhatsApp on Twilio](https://www.twilio.com/docs/whatsapp)
- [Validating requests](https://www.twilio.com/docs/usage/security#validating-requests)
