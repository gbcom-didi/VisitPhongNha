import type { RequestHandler } from "express";

export enum UserRole {
  ADMIN = "admin",
  BUSINESS_OWNER = "business_owner", 
  VIEWER = "viewer"
}

export interface UserWithRole {
  id: string;
  role: UserRole;
  isActive: boolean;
  claims: any;
}

// Role hierarchy - higher roles include permissions of lower roles
const roleHierarchy = {
  [UserRole.ADMIN]: [UserRole.ADMIN, UserRole.BUSINESS_OWNER, UserRole.VIEWER],
  [UserRole.BUSINESS_OWNER]: [UserRole.BUSINESS_OWNER, UserRole.VIEWER],
  [UserRole.VIEWER]: [UserRole.VIEWER]
};

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole]?.includes(requiredRole) || false;
}

export function requireRole(role: UserRole): RequestHandler {
  return async (req: any, res, next) => {
    try {
      const user = req.user as UserWithRole;
      
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: "Account is inactive" });
      }

      if (!hasRole(user.role, role)) {
        return res.status(403).json({ 
          message: `Access denied. Required role: ${role}. Your role: ${user.role}` 
        });
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export const requireAdmin = requireRole(UserRole.ADMIN);
export const requireBusinessOwner = requireRole(UserRole.BUSINESS_OWNER);
export const requireViewer = requireRole(UserRole.VIEWER);

// Permission checks for specific actions
export const permissions = {
  // Business management
  canCreateBusiness: (userRole: UserRole) => hasRole(userRole, UserRole.BUSINESS_OWNER),
  canEditBusiness: (userRole: UserRole, businessOwnerId?: string, userId?: string) => {
    if (hasRole(userRole, UserRole.ADMIN)) return true;
    if (hasRole(userRole, UserRole.BUSINESS_OWNER) && businessOwnerId === userId) return true;
    return false;
  },
  canDeleteBusiness: (userRole: UserRole) => hasRole(userRole, UserRole.ADMIN),
  canVerifyBusiness: (userRole: UserRole) => hasRole(userRole, UserRole.ADMIN),
  
  // User management
  canManageUsers: (userRole: UserRole) => hasRole(userRole, UserRole.ADMIN),
  canViewUserList: (userRole: UserRole) => hasRole(userRole, UserRole.ADMIN),
  canChangeUserRole: (userRole: UserRole) => hasRole(userRole, UserRole.ADMIN),
  
  // Content management
  canCreateCategory: (userRole: UserRole) => hasRole(userRole, UserRole.ADMIN),
  canEditCategory: (userRole: UserRole) => hasRole(userRole, UserRole.ADMIN),
  canDeleteCategory: (userRole: UserRole) => hasRole(userRole, UserRole.ADMIN),
  
  // Site access
  canAccessAdminPanel: (userRole: UserRole) => hasRole(userRole, UserRole.BUSINESS_OWNER),
  canViewBusinesses: (userRole: UserRole) => hasRole(userRole, UserRole.VIEWER),
  canLikeBusinesses: (userRole: UserRole) => hasRole(userRole, UserRole.VIEWER),
};