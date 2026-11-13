export const removeEmptyProperties = (array: any[]) => {
  return array.map((order) => {
    const cleanedOrder: any = {};
    for (const key in order) {
      if (
        order[key] !== undefined &&
        order[key] !== null &&
        order[key] !== "" &&
        !(Array.isArray(order[key]) && order[key].length === 0)
      ) {
        cleanedOrder[key] = order[key];
      }
    }
    return cleanedOrder;
  });
};
