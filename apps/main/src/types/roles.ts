export interface IRoles {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  pivot: {
    user_id: string;
    role_id: string;
  };
}
