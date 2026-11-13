interface I_PlanFeature {
  item: string;
  isChecked: boolean;
}

interface I_AnnualData {
  plan: string;
  description: string;
  price: string | number;
  currency?: string;
  feature_description: string;
  feature: I_PlanFeature[];
  customID: string;
  uuid?: string;
}

export const annualData: I_AnnualData[] = [
  {
    customID: "1",
    plan: "Procure plan",
    description: "Our most popular plan for small teams.",
    price: "50",
    currency: "$",
    feature_description: "This is what our free plan offers",
    feature: [
      {
        item: "Only 1 user",
        isChecked: true,
      },
      {
        item: "Unlimited employees",
        isChecked: true,
      },
      {
        item: "RaydaCare",
        isChecked: true,
      },
      {
        item: "No catalogs creations",
        isChecked: false,
      },
      {
        item: "No Credit",
        isChecked: false,
      },
      {
        item: "No integrations",
        isChecked: false,
      },
    ],
  },
  {
    customID: "2",
    plan: "Manage plan",
    description: "Advanced managing of personnel & vendors",
    price: 299,
    currency: "$",
    feature_description: "Everything in our procure plan plus....",
    feature: [
      {
        item: "3 users",
        isChecked: true,
      },
      {
        item: "3 Catalogs creations",
        isChecked: true,
      },
      {
        item: "$3,000 Credit limit",
        isChecked: true,
      },
      {
        item: "Gsuite integration",
        isChecked: true,
      },
      {
        item: "Microsoft integration",
        isChecked: true,
      },
      {
        item: "ABM integration",
        isChecked: true,
      },
      {
        item: "Microsoft Intune integration",
        isChecked: true,
      },
      {
        item: "Dedicated support",
        isChecked: true,
      },
    ],
  },
  {
    customID: "3",
    plan: "Operate plan",
    description: "Workflow builders and asset checklist",
    price: 599,
    currency: "$",
    feature_description: "Everything in our manage plan plus....",
    feature: [
      {
        item: "5 users",
        isChecked: true,
      },
      {
        item: "5 Catalogs",
        isChecked: true,
      },
      {
        item: "Device Lease",
        isChecked: true,
      },
      {
        item: "$10,000 Credit limit",
        isChecked: true,
      },
      {
        item: "Slack integration",
        isChecked: true,
      },
      {
        item: "Device Buyback/Recycling",
        isChecked: true,
      },
      {
        item: "JamF integration",
        isChecked: true,
      },
    ],
  },
  {
    customID: "4",
    plan: "Scale plan",
    description: "Unlimited insurance polices ",
    price: "1,450",
    currency: "$",
    feature_description: "Everything in our operate plan plus....",
    feature: [
      {
        item: "Unlimited users",
        isChecked: true,
      },
      {
        item: "Unlimited catalogs",
        isChecked: true,
      },
      {
        item: "$40,000 Credit limit",
        isChecked: true,
      },
      {
        item: "Jira integration",
        isChecked: true,
      },
    ],
  },
];
