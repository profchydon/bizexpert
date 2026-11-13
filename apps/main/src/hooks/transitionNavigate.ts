import { TransitionStartFunction } from "react";

export const transitionNavigate = (
  startTransition: TransitionStartFunction,
  navigate: () => void,
) => {
  startTransition(navigate);
};
