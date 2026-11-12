# WhatsApp end-to-end setup

BizExpert uses **Meta WhatsApp Cloud API** (Graph `v19.0`). Customers text your business number; the API verifies the webhook, queues the message, and the AI replies. Linking and VERIFY happen in the dashboard, then on WhatsApp.

The agreed replacement channel is Twilio Flows: [whatsapp-twilio-setup.md](whatsapp-twilio-setup.md). This file remains the live Meta setup until that slice is merged.

## What works when this is set up

- Incoming **text** messages only (`POST /api/v1/whatsapp/webhook`).
- Link a staff phone in **Settings → WhatsApp**, then reply `VERIFY`.
- After verify: ask sales/stock questions, and preview/confirm sales, receipts, and transfers.
- Daily sales digest at **18:00** and low-stock alerts at **09:00** (server time) to verified numbers.

## Prerequisites

- Docker Postgres + Redis from the repo `docker-compose.yml` (Redis `6379`; Postgres host port `5440`).
- API running (`apps/api`, default `http://localhost:3001`).
- Dashboard running (`apps/main`, default `http://localhost:3000`).
- A Meta developer account and a WhatsApp Cloud API phone number.
- A **public HTTPS** URL for the API (Meta cannot call `localhost`). Use a tunnel such as ngrok or Cloudflare Tunnel for local work.
- Optional: `OPENAI_API_KEY`. Without it, WhatsApp still works in fallback mode (limited answers, no tool-calling).

Owner or Admin can link numbers. Phone must be E.164, for example `+2348012345678`.

## 1. Create the Meta WhatsApp app

1. In [Meta for Developers](https://developers.facebook.com/), create an app and add the **WhatsApp** product.
2. Open WhatsApp → API Setup and copy:
   - **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`
   - **Temporary or permanent access token** → `WHATSAPP_ACCESS_TOKEN`
3. App settings → Basic: copy **App secret** → `WHATSAPP_APP_SECRET`.
4. Choose your own verify string (any secret you will reuse) → `WHATSAPP_VERIFY_TOKEN`.

Use a permanent system-user token in production. The test token from API Setup expires.

## 2. Put credentials on the API

Copy `apps/api/.env.example` to `apps/api/.env` if needed. Set:

```
WHATSAPP_VERIFY_TOKEN=the_same_string_you_will_paste_in_Meta
WHATSAPP_ACCESS_TOKEN=EAAxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_APP_SECRET=your_meta_app_secret
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=bizexpert
REDIS_PASSWORD=bizexpert_dev
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
```

If `WHATSAPP_APP_SECRET` is empty, the API **skips** `X-Hub-Signature-256` checks. Do not do that in production.

If `WHATSAPP_ACCESS_TOKEN` or `WHATSAPP_PHONE_NUMBER_ID` is empty, inbound processing still runs but **replies are skipped** (logged as “credentials not configured”).

Host Postgres URL uses port **5440** when you use this repo’s Compose file (`postgresql://bizexpert:bizexpert_dev@localhost:5440/bizexpert`).

## 3. Start services

From the repo root:

```bash
docker compose up -d
cd apps/api && npm run start:dev
cd apps/main && npm run dev
```

Redis must be up. Bull queue `whatsapp-messages` and 24-hour message dedupe both use it.

## 4. Expose the webhook

Point a public HTTPS origin at the API, then register this callback in Meta:

```
https://<your-public-host>/api/v1/whatsapp/webhook
```

Local example with a tunnel on port 3001:

```
https://<tunnel-host>/api/v1/whatsapp/webhook
```

In Meta WhatsApp → Configuration → Webhook:

1. Callback URL = the URL above.
2. Verify token = the same value as `WHATSAPP_VERIFY_TOKEN`.
3. Subscribe the **messages** field.

Meta `GET`s with `hub.mode=subscribe`, `hub.verify_token`, and `hub.challenge`. The API returns the challenge when the token matches, otherwise `403`.

## 5. Link and verify a phone

1. Sign in as Owner or Admin.
2. Open `/dashboard/settings?tab=whatsapp`.
3. Enter the **personal WhatsApp number** that will chat with the bot (E.164), optional default store, then **Link number**.
4. BizExpert sends: `BizExpert: Your number was linked. Reply VERIFY to confirm this device.`
5. From that phone, open the **business** WhatsApp number (the Cloud API number) and send exactly `VERIFY` (case-insensitive, that word only).

You should get: your number is verified and you can ask about sales, stock, or record transactions.

If the link SMS never arrives: Meta only allows free-form outbound text inside the customer-care window. Message the business number first, then link again, or check API logs for Graph send errors (`sendMessage` logs failures and does not throw).

## 6. Try the assistant

From the same verified phone, text the business number, for example:

- `How much did we sell today?`
- `What is low stock?`
- Record a sale — the bot previews first; confirm with `CONFIRM <id>` (or the phrasing the model asks for).

Unlinked or unverified numbers get a message to visit Settings → WhatsApp.

## How a message moves

1. Meta `POST`s `/api/v1/whatsapp/webhook` with `X-Hub-Signature-256`.
2. Signature is checked (HMAC-SHA256 of the raw body with `WHATSAPP_APP_SECRET`). Nest is started with `rawBody: true`.
3. Non-text events are ignored. Duplicate `message.id` values are dropped in Redis (`wa:dedup:*`, 24h).
4. The handler returns `{ status: "ok" }` immediately; Bull job `process-message` does the work.
5. `VERIFY` sets `WhatsappIdentity.isVerified`. Other text goes to `AiService.handleWhatsAppMessage`.
6. Replies go to `https://graph.facebook.com/v19.0/<PHONE_NUMBER_ID>/messages`.

## Checklist when something fails

| Symptom                                  | Check                                                                                          |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Meta webhook verify fails                | Token in Meta equals `WHATSAPP_VERIFY_TOKEN`; URL includes `/api/v1`; tunnel reaches port 3001 |
| `401 Invalid WhatsApp webhook signature` | `WHATSAPP_APP_SECRET` matches the app; tunnel is not rewriting the body                        |
| No reply                                 | Redis up; token + phone number ID set; API logs for Graph errors                               |
| Always “not linked”                      | Number in Settings is E.164; WhatsApp `from` is that number with or without `+`                |
| `VERIFY` does nothing                    | Identity row exists first; send the word `VERIFY` alone                                        |
| Weak / no AI                             | `OPENAI_API_KEY` set; otherwise fallback mode                                                  |

## Related code

- Webhook: `apps/api/src/whatsapp/whatsapp.controller.ts`
- Send + signature: `apps/api/src/whatsapp/whatsapp.service.ts`
- Queue worker: `apps/api/src/whatsapp/whatsapp.processor.ts`
- Identities API: `apps/api/src/whatsapp/whatsapp-identities.controller.ts`
- Dashboard: `apps/main/src/container/Dashboard/BizExpertSettings/WhatsappSettings.tsx`
