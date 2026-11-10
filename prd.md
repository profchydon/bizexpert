# Updated PRD: Inventory Management System with WhatsApp AI

Version 1.1 · October 2026 · MVP specification

The PRD is updated to reflect all five decisions. The MVP will support sales recording through both the web dashboard and WhatsApp, weighted-average inventory costing, multiple shops or warehouses under one business, Nigerian Naira only, and a WhatsApp assistant that can both answer analytics questions and execute confirmed sales or stock updates.

## 1. Confirmed product decisions

| Area                  | Decision                                          |
| --------------------- | ------------------------------------------------- |
| Sales entry           | Web dashboard and WhatsApp                        |
| Inventory costing     | Weighted-average cost                             |
| Business structure    | One business can manage multiple locations        |
| Currency              | NGN (₦) only                                      |
| WhatsApp capabilities | Read analytics and perform confirmed transactions |

## 2. Revised MVP scope

Business and location management

Create a business, manage multiple shops or warehouses, assign staff permissions, and view consolidated or location-specific performance.

Products and inventory

Manage products, packaging conversions, opening balances, stock receipts, adjustments, stock transfers between locations, and low-stock thresholds.

Sales and purchases

Record sales from either interface, track payment status, receive purchased stock, handle cancellations and refunds, and maintain a complete transaction history.

Analytics

View sales, gross profit, inventory valuation, top-selling products, slow-moving products, and stock alerts by location or across the entire business.

WhatsApp AI assistant

Answer natural-language questions, preview proposed transactions, request confirmation, execute authorized actions, and report transaction outcomes.

### Explicitly excluded from this MVP

Full accounting, payroll, tax filing, supplier marketplaces, automated purchasing, foreign currencies, complex procurement approvals, and predictive AI forecasting remain out of scope.

Multi-location support is included, but the first version does not need advanced warehouse bin management or complex inter-branch logistics.

## 3. Product overview and target users

The product is a lightweight inventory and sales management platform for Nigerian wholesalers and retailers. It combines a responsive web dashboard with a WhatsApp AI assistant that allows business owners to manage operations and understand performance conversationally.

Primary users:

- Retailers: Manage daily sales, stock levels, and replenishment.
- Wholesalers: Track bulk inventory, packaging units, and sales to retailers.
- Business owners: Monitor several shops or warehouses from one account.
- Managers and attendants: Record transactions and manage stock within their assigned permissions.

## 4. Functional requirements

### 4.1 Business and multi-location management

Each business can create multiple locations, such as a main shop, branch, or warehouse.

Requirements:

- A business owner can create, edit, deactivate, and view locations.
- Every inventory balance belongs to a specific location.
- A business can view consolidated reports or filter by location.
- Staff can be assigned to one or more locations with role-based permissions.
- Sales and stock updates must be associated with the correct location.
- The WhatsApp assistant must ask which location is intended when a request is ambiguous and no default location has been configured.

Example: A wholesaler with a warehouse in Lagos and a shop in Ibadan can see stock and sales separately or across both locations.

### 4.2 Product catalogue

Each product must support:

- Product name and SKU.
- Category.
- Selling price in NGN.
- Purchase cost in NGN.
- Base unit of measurement.
- Packaging conversions, such as carton to piece.
- Location-specific stock quantities.
- Location-specific low-stock thresholds.
- Active/inactive status.

Product identity and default pricing can be shared across locations. Stock quantities must be tracked independently per location.

### 4.3 Inventory management

Users can:

- Record opening stock.
- Receive new stock.
- Adjust stock with a reason.
- Record damaged, expired, or missing stock.
- View movement history.
- Transfer stock between locations.
- See current stock and inventory valuation.

All inventory changes must create traceable stock movement records.

Stock transfer rules:

1. The source location must have sufficient stock.
2. A transfer must identify the source, destination, quantity, and responsible user.
3. Stock must not be counted twice during a transfer.
4. Transfers must preserve the inventory cost basis.
5. Transfers must be atomic or use an explicit in-transit status if they cannot be completed atomically.

### 4.4 Sales and purchases

Sales can be created through the web dashboard or WhatsApp.

Every completed sale must identify its location, items, quantities, selling prices, applicable discounts, cost basis, payment status, and responsible user.

The backend must validate stock, record the sale, calculate gross profit, and deduct stock as one consistent transaction.

Purchase receipts must record the actual received quantity and unit purchase cost. Partial receipts should be supported where a purchase is received in stages.

Cancelled sales and refunds must create explicit reversals. The system must distinguish a refund of money from the physical return of goods; inventory is increased only when goods are actually returned to sellable stock.

### 4.5 Weighted-average inventory costing

The system will use perpetual weighted-average costing, calculated separately for each product at each location.

The average unit cost after a stock receipt is:

\\[ \text{New Average Cost} = \frac{\text{Existing Stock Value}+\text{Received Stock Cost}} {\text{Existing Quantity}+\text{Received Quantity}} \\]

For example:

| Event         | Quantity | Unit cost         | Stock value |
| ------------- | -------- | ----------------- | ----------- |
| Opening stock | 100      | ₦1,000            | ₦100,000    |
| New purchase  | 50       | ₦1,200            | ₦60,000     |
| Total         | 150      | ₦1,066.67 average | ₦160,000    |

If the business subsequently sells 30 units, the cost of goods sold is approximately ₦32,000, leaving 120 units valued at approximately ₦128,000.

The system must retain the cost applied to each sale line so historical gross profit does not change when new stock arrives.

For MVP simplicity, all monetary amounts are in NGN. Rounding rules must be consistent, with calculations performed at appropriate precision before displaying currency values.

### 4.6 Sales and inventory analytics

The web dashboard and WhatsApp assistant must share the same calculation logic.

Required analytics:

- Daily, weekly, and monthly sales revenue.
- Gross profit and cost of goods sold.
- Number of completed sales.
- Best-selling products.
- Slow-moving and unsold products.
- Low-stock alerts.
- Inventory valuation at weighted-average cost.
- Location-level and consolidated business performance.

Revenue, profit, and inventory reports must respect the selected date range and location filters. Reports must exclude cancelled transactions and apply refund rules consistently.

## 5. WhatsApp AI assistant

### 5.1 Read and write capabilities

The assistant supports two categories of operations.

Read operations

Users can ask questions about sales, gross profit, stock, inventory value, low-stock products, and branch performance. Results come from authorized backend analytics.

Write operations

Authorized users can record sales, receive stock, adjust inventory, and initiate supported stock transfers through a preview-and-confirm flow.

### 5.2 Example commands

| WhatsApp message                                                 | Expected behaviour                                      |
| ---------------------------------------------------------------- | ------------------------------------------------------- |
| How much did I sell today?                                       | Return today's sales summary                            |
| How much profit did the Lagos shop make?                         | Return gross profit for the specified location          |
| Add 20 cartons of noodles to my Ikeja shop at ₦25,000 per carton | Preview a stock receipt and its cost implications       |
| Record a sale of 3 cartons of drinks for ₦45,000                 | Resolve the product and location, then preview the sale |
| Move 10 cartons from the warehouse to the shop                   | Preview a stock transfer after validating availability  |
| Which products need restocking?                                  | List products at or below their thresholds              |

### 5.3 Transaction confirmation flow

1\. User sends a command

“Record a sale of 3 cartons of drinks.”

2\. AI resolves details

Product, location, quantity, price, permissions, and stock availability

3\. Preview and confirm

Show transaction details and ask the user to confirm

4\. Backend executes transaction

Validate again, commit once, and update stock and analytics

5\. Send confirmation

Provide transaction reference, amount, location, and updated stock where applicable

The assistant must never interpret a proposed action as permission to execute it. A confirmation must be tied to the exact transaction preview, expire after a reasonable period, and be invalidated if relevant stock, price, or permissions change.

The backend must revalidate the transaction at execution time. Duplicate WhatsApp webhook deliveries or repeated confirmation messages must not create duplicate transactions.

For the MVP, the bot should not autonomously change prices, delete transaction history, or execute purchases without explicit user approval.

## 6. Revised data model

The data model must account for multiple locations and write operations initiated through WhatsApp.

| Entity                 | Purpose                                                     |
| ---------------------- | ----------------------------------------------------------- |
| `businesses`           | Business profile and NGN settings                           |
| `users`                | User identities                                             |
| `business_memberships` | Business roles and permissions                              |
| `locations`            | Shops and warehouses                                        |
| `location_memberships` | Optional location-specific staff access                     |
| `products`             | Shared product catalogue                                    |
| `product_units`        | Packaging conversion definitions                            |
| `inventory_balances`   | Current quantity and average cost per product/location      |
| `stock_movements`      | Receipts, deductions, adjustments, transfers, and reversals |
| `sales`                | Sale headers, location, status, and totals                  |
| `sale_items`           | Quantities, prices, discounts, and cost snapshots           |
| `purchases`            | Purchase and receipt records                                |
| `purchase_items`       | Received quantities and purchase costs                      |
| `payments`             | Payment records and status                                  |
| `stock_transfers`      | Transfer headers, source, destination, and status           |
| `whatsapp_identities`  | Verified WhatsApp identities and account mappings           |
| `pending_actions`      | Proposed transactions awaiting confirmation                 |
| `audit_logs`           | Important user and system actions                           |

### Data integrity requirements

- Inventory balances must be uniquely identified by product and location.
- Business ownership must be enforced for every related record.
- Every inventory mutation must have a corresponding stock movement.
- A transaction must not be committed twice due to retries.
- Sale cost snapshots must be immutable after posting, except through explicit correction or reversal procedures.
- Inventory transfers must maintain a traceable relationship between the source deduction and destination receipt.

## 7. Revised technical architecture

Keep the system as a modular monolith initially.

| Component               | Responsibility                                                      |
| ----------------------- | ------------------------------------------------------------------- |
| Next.js frontend        | Product, stock, sales, location, and reporting interfaces           |
| Laravel API             | Business rules, permissions, transactions, inventory, and analytics |
| PostgreSQL              | Authoritative business and transaction records                      |
| Meta WhatsApp Cloud API | Incoming messages and outgoing replies                              |
| OpenAI API              | Natural-language interpretation and authorized tool selection       |
| Queue worker            | Webhook processing, notifications, and retry handling               |
| Audit and monitoring    | Transaction traceability, errors, and operational visibility        |

The AI layer should call narrowly scoped backend functions, such as `get_sales_summary`, `get_product_stock`, `preview_sale`, `confirm_sale`, `preview_stock_receipt`, `confirm_stock_receipt`, and `preview_stock_transfer`.

All tools must enforce business and location permissions server-side. The model must not receive unrestricted database access or be trusted to calculate authoritative financial figures.

## 8. Revised acceptance criteria

The following criteria replace the previous acceptance checklist and align with all five confirmed decisions.

### Business and locations

- An owner can create and manage multiple shops or warehouses under one business.
- Products can be shared across locations while stock balances remain location-specific.
- Staff permissions can be restricted by business role and location.
- Reports can be filtered by location or consolidated across the business.
- Ambiguous location-specific commands prompt for clarification.

### Inventory and costing

- Opening stock, receipts, adjustments, and transfers are recorded with an audit trail.
- Stock quantities are correctly converted between packaging units.
- Stock transfers deduct from the source and credit the destination without duplicating inventory.
- Weighted-average cost is calculated independently for each product at each location.
- Sale cost snapshots remain stable when subsequent purchases change the average cost.
- Insufficient stock prevents a sale or transfer by default.
- Inventory valuation reconciles with recorded balances and their average costs.

### Sales and purchases

- Sales can be recorded through both the web dashboard and WhatsApp.
- A completed sale updates the relevant location's stock exactly once.
- Purchase receipts update stock and weighted-average cost correctly.
- Refunds and cancellations are recorded through traceable reversals.
- The system distinguishes cash collected from total sales revenue.
- All monetary values are denominated in NGN.

### WhatsApp AI

- A verified WhatsApp user can query authorized business data.
- The bot answers the supported analytics questions with verified backend results.
- Authorized users can preview and confirm supported sale and stock operations.
- No write operation occurs without explicit confirmation.
- The backend rechecks stock, permissions, prices, and transaction validity before committing.
- Repeated messages and webhook retries cannot duplicate a transaction.
- Every successful write returns a transaction reference and a clear outcome.
- Failed transactions clearly report the failure without claiming success.
- Users cannot access another business's data through prompts or crafted commands.

### Quality and reliability

- Automated tests cover sales, stock deductions, costing, transfers, refunds, and tenant isolation.
- Analytics results reconcile with independently verified calculations.
- The dashboard and WhatsApp use the same business logic.
- Common dashboard views target a response time below 2 seconds under normal load.
- Common WhatsApp analytics queries target a response time below 10 seconds under normal load.
- Backup and recovery procedures are tested before the pilot.

## 9. Updated implementation plan

A realistic initial target remains 4–6 weeks for a small team, assuming a controlled pilot and no complex integrations.

| Phase     | Work                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| Week 1    | Business tenancy, authentication, roles, locations, products, opening balances |
| Week 2    | Inventory engine, weighted-average costing, packaging conversions, transfers   |
| Week 3    | Sales and purchases, dashboard, analytics, transaction reversals               |
| Week 4    | WhatsApp integration, AI tools, previews, confirmation, idempotency            |
| Weeks 5–6 | End-to-end QA, security testing, reconciliation, pilot onboarding              |

The most important implementation dependency is to finish the inventory and transaction engine before allowing the AI to perform write operations.

## 10. MVP launch criteria

The product is ready for a pilot when a business can manage at least two locations, record sales through both interfaces, reconcile inventory using weighted-average cost, and use WhatsApp to retrieve analytics or execute confirmed operations without compromising data integrity.

The pilot should validate three outcomes:

1. Operational accuracy: Stock balances and financial reports reconcile with physical counts and transaction records.
2. Ease of use: Sellers can record sales and obtain useful business information without extensive training.
3. AI usefulness: Sellers regularly use WhatsApp for analytics and find confirmed transaction entry reliable enough for daily operations.

The recommended MVP is therefore a multi-location inventory platform with a shared transaction engine and a WhatsApp assistant that is both an analytics interface and a controlled operational interface. This keeps the product small while delivering meaningful value to wholesalers and retailers from the first release.

Build this with  

NestJs for backend
NextJs for frontend