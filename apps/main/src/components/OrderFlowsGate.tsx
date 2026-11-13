"use client";

import React from "react";

interface OrderFlowsGateProps {
  legacy: React.ReactNode;
  updated: React.ReactNode;
  forceLegacy?: boolean;
}

const OrderFlowsGate: React.FC<OrderFlowsGateProps> = ({
  legacy,
  updated,
  forceLegacy = false,
}) => (forceLegacy ? legacy : updated);

export default OrderFlowsGate;
