export interface AuditLog {
  id: number;
  action: string;
  createdAt: string;
  user: {
    email: string;
    role: string;
  };
  product?: {
    name: string;
  };
}
