import type { Permission } from "@prisma/client"

interface User {
  userId: string;
  username: string;
  role: string;
  permissions: Permission[];
}


export declare global {
    namespace Express {
      export interface Request {
        user?: User | null;
      }
    }
  }
