type CartEventListener = () => void;

let itemAddedListeners: CartEventListener[] = [];
let overviewOpenListeners: CartEventListener[] = [];

const onCartItemAdded = (listener: CartEventListener) => {
  itemAddedListeners = [...itemAddedListeners, listener];

  return () => {
    itemAddedListeners = itemAddedListeners.filter(
      (current) => current !== listener,
    );
  };
};

const emitCartItemAdded = () => {
  itemAddedListeners.forEach((listener) => listener());
};

const onCartOverviewOpen = (listener: CartEventListener) => {
  overviewOpenListeners = [...overviewOpenListeners, listener];

  return () => {
    overviewOpenListeners = overviewOpenListeners.filter(
      (current) => current !== listener,
    );
  };
};

const emitCartOverviewOpen = () => {
  overviewOpenListeners.forEach((listener) => listener());
};

export {
  emitCartItemAdded,
  emitCartOverviewOpen,
  onCartItemAdded,
  onCartOverviewOpen,
};
