import OpenAI from "openai";

export const AI_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_sales_summary",
      description:
        "Get sales revenue, gross profit, and count for a time period",
      parameters: {
        type: "object",
        properties: {
          period: {
            type: "string",
            enum: [
              "today",
              "yesterday",
              "this_week",
              "this_month",
              "last_30_days",
            ],
          },
          location_name: {
            type: "string",
            description: "Location/shop name (optional)",
          },
        },
        required: ["period"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_product_stock",
      description: "Check current stock level for a product at a location",
      parameters: {
        type: "object",
        properties: {
          product_name: { type: "string" },
          location_name: { type: "string" },
        },
        required: ["product_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_low_stock_alerts",
      description: "List products running low on stock",
      parameters: {
        type: "object",
        properties: { location_name: { type: "string" } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_inventory_valuation",
      description: "Get total inventory value at weighted-average cost",
      parameters: {
        type: "object",
        properties: { location_name: { type: "string" } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "preview_sale",
      description:
        "Preview a sale before confirmation. Shows items, prices, and stock check.",
      parameters: {
        type: "object",
        properties: {
          location_name: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                product_name: { type: "string" },
                quantity: { type: "number" },
                unit_name: { type: "string" },
                unit_price: { type: "number" },
              },
              required: ["product_name", "quantity"],
            },
          },
          customer_name: { type: "string" },
        },
        required: ["items"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "preview_stock_receipt",
      description:
        "Preview receiving new stock. Shows cost impact and new average cost.",
      parameters: {
        type: "object",
        properties: {
          location_name: { type: "string" },
          product_name: { type: "string" },
          quantity: { type: "number" },
          unit_name: { type: "string" },
          unit_cost: { type: "number" },
        },
        required: ["product_name", "quantity", "unit_cost"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "preview_stock_transfer",
      description: "Preview transferring stock between locations",
      parameters: {
        type: "object",
        properties: {
          source_location: { type: "string" },
          destination_location: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                product_name: { type: "string" },
                quantity: { type: "number" },
              },
              required: ["product_name", "quantity"],
            },
          },
        },
        required: ["source_location", "destination_location", "items"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "confirm_pending_action",
      description: "Confirm and execute a previously previewed transaction",
      parameters: {
        type: "object",
        properties: {
          action_id: {
            type: "string",
            description: "8-character action ID from the preview",
          },
        },
        required: ["action_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "cancel_pending_action",
      description: "Cancel a pending transaction",
      parameters: {
        type: "object",
        properties: { action_id: { type: "string" } },
        required: ["action_id"],
      },
    },
  },
];
