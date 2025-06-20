import { useAuth } from "./useAuth";

export type UserRole = "admin" | "business_owner" | "viewer";

export function useRBAC() {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!isAuthenticated || !user) return false;
    
    const userRole = (user as any).role as UserRole;
    
    // Role hierarchy - higher roles include permissions of lower roles
    const roleHierarchy: Record<UserRole, UserRole[]> = {
      admin: ["admin", "business_owner", "viewer"],
      business_owner: ["business_owner", "viewer"],
      viewer: ["viewer"]
    };

    return roleHierarchy[userRole]?.includes(requiredRole) || false;
  };

  const permissions = {
    // Business management
    canCreateBusiness: hasRole("business_owner"),
    canEditOwnBusiness: hasRole("business_owner"),
    canEditAnyBusiness: hasRole("admin"),
    canDeleteBusiness: hasRole("admin"),
    canVerifyBusiness: hasRole("admin"),
    
    // User management
    canManageUsers: hasRole("admin"),
    canViewUserList: hasRole("admin"),
    canChangeUserRole: hasRole("admin"),
    
    // Content management
    canCreateCategory: hasRole("admin"),
    canEditCategory: hasRole("admin"),
    canDeleteCategory: hasRole("admin"),
    
    // Site access
    canAccessAdminPanel: hasRole("business_owner"),
    canAccessUserManagement: hasRole("admin"),
    canViewBusinesses: hasRole("viewer"),
    canLikeBusinesses: hasRole("viewer"),
  };

  return {
    user,
    userRole: (user as any)?.role as UserRole,
    isAuthenticated,
    hasRole,
    permissions,
    isAdmin: hasRole("admin"),
    isBusinessOwner: hasRole("business_owner"),
    isViewer: hasRole("viewer"),
  };
}