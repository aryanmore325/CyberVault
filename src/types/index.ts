export interface UserFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  created_at: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
}