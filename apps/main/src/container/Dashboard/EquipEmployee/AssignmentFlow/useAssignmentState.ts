import { useEffect, useMemo, useReducer, useRef } from "react";
import { ICart } from "@/types/cart";
import {
  buildInitialState,
  countAssigned,
  getCartItemsSignature,
  reducer,
} from "./assignmentReducer";

const useAssignmentState = (items: ICart[]) => {
  const [state, dispatch] = useReducer(reducer, items, buildInitialState);
  const cartSignature = useMemo(() => getCartItemsSignature(items), [items]);
  const lastSignatureRef = useRef(cartSignature);

  useEffect(() => {
    if (lastSignatureRef.current === cartSignature) {
      return;
    }

    lastSignatureRef.current = cartSignature;
    dispatch({ type: "RESET_FROM_CART", items });
  }, [cartSignature, items]);

  return {
    state,
    dispatch,
    ...countAssigned(state),
  };
};

export default useAssignmentState;
