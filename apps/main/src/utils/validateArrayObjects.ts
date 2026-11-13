// interface MyObject {
//   [key: string]: any;
// }

// export const validateArrayObjects = (
//   objects: MyObject[],
//   properties: string[],
// ): boolean | string => {
//   const missingProperties: Set<string> = new Set();
//   const emptyProperties: Set<string> = new Set();

//   objects.forEach((obj) => {
//     properties.forEach((prop) => {
//       if (!(prop in obj)) {
//         missingProperties.add(prop);
//       } else if (
//         obj[prop] === null ||
//         obj[prop] === undefined ||
//         obj[prop] === ""
//       ) {
//         emptyProperties.add(prop);
//       }
//     });
//   });

//   if (missingProperties.size === 0 && emptyProperties.size === 0) {
//     return true;
//   }

//   const missingPropsArray = Array.from(missingProperties);
//   const emptyPropsArray = Array.from(emptyProperties);

//   let message = "";

//   if (missingPropsArray.length > 0) {
//     message += `Missing properties: ${missingPropsArray.join(", ")}. `;
//   }

//   if (emptyPropsArray.length > 0) {
//     message += `Empty properties: ${emptyPropsArray.join(", ")}.`;
//   }

//   return message;
// };

interface MyObject {
  [key: string]: any;
}

export const validateArrayObjects = (
  objects: MyObject[],
  properties: string[],
): boolean | string => {
  const missingProperties: Set<string> = new Set();
  const emptyProperties: Set<string> = new Set();
  const negativePriceObjects: Set<number> = new Set();

  objects.forEach((obj, index) => {
    properties.forEach((prop) => {
      if (!(prop in obj)) {
        missingProperties.add(prop);
      } else if (
        obj[prop] === null ||
        obj[prop] === undefined ||
        obj[prop] === ""
      ) {
        emptyProperties.add(prop);
      }
    });

    // if (
    //   "purchase_price" in obj &&
    //   typeof obj.purchase_price === "number" &&
    //   obj.purchase_price < 0
    // ) {
    //   negativePriceObjects.add(index);
    // }
  });

  if (
    missingProperties.size === 0 &&
    emptyProperties.size === 0 &&
    negativePriceObjects.size === 0
  ) {
    return true;
  }

  const missingPropsArray = Array.from(missingProperties);
  const emptyPropsArray = Array.from(emptyProperties);
  const negativePriceArray = Array.from(negativePriceObjects);

  let message = "";

  if (missingPropsArray.length > 0) {
    message += `Missing properties: ${missingPropsArray.join(", ")}. `;
  }

  if (emptyPropsArray.length > 0) {
    message += `Empty properties: ${emptyPropsArray.join(", ")}. `;
  }

  // if (negativePriceArray.length > 0) {
  //   message += `Negative purchase_price found at indices: ${negativePriceArray.join(", ")}.`;
  // }

  return message;
};
