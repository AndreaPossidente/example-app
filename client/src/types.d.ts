type Permission = { name: string; description: string };
type Role = { name: string; permissions: Permission[] };
interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  roleName: string;
}

interface Session {
  userId: string;
  username: string;
  role: string;
  permissions: Permission[];
  iat: number;
}
