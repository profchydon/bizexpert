export type ISetNotifications = {
  companyId: string;
  payload: {
    notification: {
      orders: string[];
      billing: string[];
      support: string[];
    };
  };
};
