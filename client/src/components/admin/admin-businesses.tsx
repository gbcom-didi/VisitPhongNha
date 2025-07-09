import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Edit, Trash2, Eye, MapPin, Globe, Phone } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BusinessWithCategory } from "@shared/schema";

export default function AdminBusinesses() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: businesses = [], isLoading } = useQuery<BusinessWithCategory[]>({
    queryKey: ["/api/businesses", { showAll: true }],
    queryFn: () => fetch("/api/businesses?showAll=true").then(res => {
      if (!res.ok) throw new Error('Failed to fetch businesses');
      return res.json();
    }),
  });

  const deleteBusinessMutation = useMutation({
    mutationFn: async (businessId: number) => {
      return apiRequest("DELETE", `/api/businesses/${businessId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({
        title: "Success",
        description: "Business deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete business",
        variant: "destructive",
      });
    },
  });

  const filteredBusinesses = Array.isArray(businesses) ? businesses.filter((business) =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.address?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Businesses</h1>
          <p className="text-gray-600">Loading businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Businesses</h1>
        <p className="text-gray-600">View, edit, and manage business listings</p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Businesses</CardTitle>
          <CardDescription>Find businesses by name or location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by business name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredBusinesses.length} of {businesses.length} businesses
      </div>

      {/* Business Cards */}
      <div className="grid gap-6">
        {filteredBusinesses.map((business) => (
          <Card key={business.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">{business.name}</CardTitle>
                    {business.isPremium && (
                      <Badge variant="secondary" className="bg-mango-yellow text-black">
                        Premium
                      </Badge>
                    )}
                    {business.isVerified && (
                      <Badge variant="secondary" className="bg-jade-green text-white">
                        Verified
                      </Badge>
                    )}
                    {!business.isActive && (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {business.categories?.map((category) => (
                      <Badge 
                        key={category.id} 
                        variant="outline"
                        style={{ borderColor: category.color, color: category.color }}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Business</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{business.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => deleteBusinessMutation.mutate(business.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {business.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {business.description}
                    </p>
                  )}
                  
                  {business.address && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {business.address}
                    </div>
                  )}
                  
                  {business.phone && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-1" />
                      {business.phone}
                    </div>
                  )}
                  
                  {business.website && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Globe className="w-4 h-4 mr-1" />
                      <a 
                        href={business.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-tropical-aqua hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {business.rating && (
                    <div className="text-sm">
                      <span className="font-medium">Rating:</span> {parseFloat(business.rating).toFixed(1)}⭐
                      {business.reviewCount && business.reviewCount > 0 && (
                        <span className="text-gray-500"> ({business.reviewCount} reviews)</span>
                      )}
                    </div>
                  )}
                  
                  {business.priceRange && (
                    <div className="text-sm">
                      <span className="font-medium">Price Range:</span> {business.priceRange}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400">
                    Created: {new Date(business.createdAt).toLocaleDateString()}
                    {business.updatedAt && (
                      <> • Updated: {new Date(business.updatedAt).toLocaleDateString()}</>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? "Try adjusting your search criteria" 
                : "No businesses have been added yet"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}