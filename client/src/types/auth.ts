export enum UserRole {
  ADMIN = "admin",
  BUSINESS_OWNER = "business_owner", 
  VIEWER = "viewer"
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
}