import {
  product_1,
  product_2,
  product_3,
  product_4,
  product_5,
  product_6,
} from "@/assets/images";
import { StaticImageData } from "next/image";

export interface IProduct {
  id: string;
  image: StaticImageData;
  name: string;
  description: string;
  full_description: string;
  price: string;
  details: string[];
}

export const productData: IProduct[] = [
  {
    id: "1",
    image: product_1,
    name: "Asset Code: 3998",
    description: `Apple MacBook Air 13" M1 Chip 8GB 256GB 2020 Model - Gray`,
    full_description: `Experience the power of the latest technology with the 2020 model Apple MacBook Air 13" featuring the M1 chip. With 8GB of memory and 256GB of storage, this sleek gray laptop offers lightning-fast performance and plenty of space to store all your important files.`,
    price: `₦ 795,000`,
    details: [
      "Brand New",
      "Computer",
      "MacBook Air 2020",
      "Intel Core i5",
      "Mac OS",
      "Apple",
      "8GB RAM",
      "Air 13’’ A1369/A1466",
      "128GB",
      "Gray",
    ],
  },
  {
    id: "2",
    image: product_2,
    name: "Asset Code: 9272",
    description: `Phone 8 - 256GB, 4G LTE, Green (Refurbished)`,
    full_description: `Experience the power of the latest technology with the 2020 model Apple MacBook Air 13" featuring the M1 chip. With 8GB of memory and 256GB of storage, this sleek gray laptop offers lightning-fast performance and plenty of space to store all your important files.`,
    price: `₦ 141,999`,
    details: ["Brand New", "Computer", "Air 13’’ A1369/A1466", "128GB", "Gray"],
  },
  {
    id: "3",
    image: product_3,
    name: "Asset Code: 2923",
    description: `Modern Office Table Desk Computer Table Furniture`,
    full_description: `Experience the power of the latest technology with the 2020 model Apple MacBook Air 13" featuring the M1 chip. With 8GB of memory and 256GB of storage, this sleek gray laptop offers lightning-fast performance and plenty of space to store all your important files.`,
    price: `₦ 37,000`,
    details: [
      "Brand New",
      "Computer",
      "MacBook Air 2020",
      "Intel Core i5",
      "Mac OS",
      "Apple",
    ],
  },
  {
    id: "4",
    image: product_4,
    name: "Asset Code: 0272",
    description: `Sony Xperia XA1 Ultra 6.0"  LTE Android 4GB 32GB`,
    full_description: `Experience the power of the latest technology with the 2020 model Apple MacBook Air 13" featuring the M1 chip. With 8GB of memory and 256GB of storage, this sleek gray laptop offers lightning-fast performance and plenty of space to store all your important files.`,
    price: `₦ 121,900`,
    details: [
      "Mac OS",
      "Apple",
      "8GB RAM",
      "Air 13’’ A1369/A1466",
      "128GB",
      "Gray",
    ],
  },
  {
    id: "5",
    image: product_5,
    name: "Asset Code: 2736",
    description: `Bose Earphones Open-type casual/sports, products`,
    full_description: `Experience the power of the latest technology with the 2020 model Apple MacBook Air 13" featuring the M1 chip. With 8GB of memory and 256GB of storage, this sleek gray laptop offers lightning-fast performance and plenty of space to store all your important files.`,
    price: `₦ 252,000`,
    details: [
      "Brand New",
      "Computer",
      "8GB RAM",
      "Air 13’’ A1369/A1466",
      "128GB",
      "Gray",
    ],
  },
  {
    id: "6",
    image: product_6,
    name: "Asset Code: 2763",
    description: `DELL Alienware X14 Core™ I7-12700H 512GB SSD/16GB`,
    full_description: `Experience the power of the latest technology with the 2020 model Apple MacBook Air 13" featuring the M1 chip. With 8GB of memory and 256GB of storage, this sleek gray laptop offers lightning-fast performance and plenty of space to store all your important files.`,
    price: `₦ 1,350,000`,
    details: [
      "Brand New",
      "Computer",
      "8GB RAM",
      "Air 13’’ A1369/A1466",
      "128GB",
      "Gray",
    ],
  },
];
