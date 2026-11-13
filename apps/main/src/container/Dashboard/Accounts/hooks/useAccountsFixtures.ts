"use client";

import { useSyncExternalStore } from "react";
import {
  defaultCardCaptureOutcome,
  defaultClosureBlockers,
  type CardCaptureOutcome,
  type ClosureBlockers,
} from "../data/accountsFixtures";

let closureBlockers = defaultClosureBlockers;
let cardCaptureOutcome = defaultCardCaptureOutcome;
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getClosureSnapshot() {
  return closureBlockers;
}

function getCardCaptureSnapshot() {
  return cardCaptureOutcome;
}

export function setClosureBlockersForTests(value: ClosureBlockers) {
  closureBlockers = value;
  listeners.forEach((listener) => listener());
}

export function setCardCaptureOutcomeForTests(value: CardCaptureOutcome) {
  cardCaptureOutcome = value;
  listeners.forEach((listener) => listener());
}

export function resetAccountsFixturesForTests() {
  closureBlockers = defaultClosureBlockers;
  cardCaptureOutcome = defaultCardCaptureOutcome;
  listeners.clear();
}

export function useAccountsFixtureValues() {
  const closureBlockersValue = useSyncExternalStore(
    subscribe,
    getClosureSnapshot,
    getClosureSnapshot,
  );
  const cardCaptureOutcomeValue = useSyncExternalStore(
    subscribe,
    getCardCaptureSnapshot,
    getCardCaptureSnapshot,
  );

  return {
    closureBlockers: closureBlockersValue,
    cardCaptureOutcome: cardCaptureOutcomeValue,
  };
}
