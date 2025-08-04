import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Search, User as UserIcon, Shield, Crown, Eye, Calendar, Mail, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

const userFormSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Valid email is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["admin", "business_owner", "viewer"]),
  isActive: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "viewer",
      isActive: true,
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      return apiRequest("POST", "/api/admin/users", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      form.reset();
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: UserFormData & { id: string }) => {
      return apiRequest("PUT", `/api/admin/users/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      form.reset();
      setEditingUser(null);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (editingUser) {
      updateUserMutation.mutate({ ...data, id: editingUser.id });
    } else {
      createUserMutation.mutate(data);
    }
  };

  const loadUser = (user: User) => {
    setEditingUser(user);
    form.reset({
      id: user.id,
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      role: (user.role as "admin" | "business_owner" | "viewer") || "viewer",
      isActive: user.isActive !== false,
    });
  };

  const resetForm = () => {
    form.reset();
    setEditingUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-amber-500" />;
      case "business_owner":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <UserIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "business_owner":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const exportToCSV = () => {
    const csvHeaders = ["ID", "Email", "First Name", "Last Name", "Role", "Active", "Created At"];
    const csvData = filteredUsers.map(user => [
      user.id || "",
      user.email || "",
      user.firstName || "",
      user.lastName || "",
      user.role || "",
      user.isActive ? "Yes" : "No",
      user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvData.map(row => row.map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `users-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: `Exported ${filteredUsers.length} users to CSV`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={exportToCSV}
            variant="outline"
            className="border-coral-sunset text-coral-sunset hover:bg-coral-sunset hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-tropical-aqua hover:bg-tropical-aqua/90">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <UserForm 
                form={form} 
                onSubmit={onSubmit} 
                isSubmitting={createUserMutation.isPending}
                onReset={resetForm}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter Users</CardTitle>
          <CardDescription>Find users by name, email, or role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="business_owner">Business Owner</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="w-8 h-8 text-gray-500" />
              <div>
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-8 h-8 text-amber-500" />
              <div>
                <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
                <div className="text-sm text-gray-500">Admins</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{users.filter(u => u.role === 'business_owner').length}</div>
                <div className="text-sm text-gray-500">Business Owners</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-8 h-8 text-gray-500" />
              <div>
                <div className="text-2xl font-bold">{users.filter(u => u.role === 'viewer').length}</div>
                <div className="text-sm text-gray-500">Viewers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* User Cards */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    {getRoleIcon(user.role || "viewer")}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {user.firstName} {user.lastName}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleBadgeColor(user.role || "viewer")}>
                      {user.role?.replace('_', ' ').toUpperCase() || "VIEWER"}
                    </Badge>
                    
                    {!user.isActive && (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                    
                    <div className="flex items-center text-xs text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => loadUser(user)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      <UserForm 
                        form={form} 
                        onSubmit={onSubmit} 
                        isSubmitting={updateUserMutation.isPending}
                        onReset={resetForm}
                        isEditing={true}
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {user.firstName} {user.lastName}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => deleteUserMutation.mutate(user.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>

            {user.updatedAt && (
              <CardContent>
                <div className="text-xs text-gray-400">
                  Last updated: {new Date(user.updatedAt).toLocaleDateString()}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchQuery || roleFilter !== "all"
                ? "Try adjusting your search criteria or filters" 
                : "No users have been added yet"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// User Form Component
function UserForm({ 
  form, 
  onSubmit, 
  isSubmitting, 
  onReset, 
  isEditing = false 
}: { 
  form: any; 
  onSubmit: (data: UserFormData) => void; 
  isSubmitting: boolean; 
  onReset: () => void;
  isEditing?: boolean;
}) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input {...form.register("firstName")} />
          {form.formState.errors.firstName && (
            <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input {...form.register("lastName")} />
          {form.formState.errors.lastName && (
            <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input {...form.register("email")} type="email" />
        {form.formState.errors.email && (
          <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="role">Role *</Label>
        <Select 
          value={form.watch("role")} 
          onValueChange={(value) => form.setValue("role", value as "admin" | "business_owner" | "viewer")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewer">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span>Viewer</span>
              </div>
            </SelectItem>
            <SelectItem value="business_owner">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Business Owner</span>
              </div>
            </SelectItem>
            <SelectItem value="admin">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4" />
                <span>Admin</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.role && (
          <p className="text-sm text-red-600">{form.formState.errors.role.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isActive">Active User</Label>
        <Switch 
          checked={form.watch("isActive")} 
          onCheckedChange={(checked) => form.setValue("isActive", checked)}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onReset}>
          Reset
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-tropical-aqua hover:bg-tropical-aqua/90"
        >
          {isSubmitting ? "Saving..." : (isEditing ? "Update User" : "Create User")}
        </Button>
      </div>
    </form>
  );
}