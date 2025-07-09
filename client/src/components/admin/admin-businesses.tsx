import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BusinessModal } from "@/components/business-modal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Save, Eye, X, Edit, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Category, Business, BusinessWithCategory } from "@shared/schema";

const businessFormSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().optional(),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  hours: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")).refine(val => !val || val.length <= 1000, "Image URL must be less than 1000 characters"),
  gallery: z.string().optional(),
  categoryIds: z.array(z.number()).min(1, "At least one category is required"),
  tags: z.string().optional(),
  priceRange: z.string().optional(),
  amenities: z.string().optional(),
  bookingType: z.enum(["none", "direct", "affiliate"]).default("none"),
  affiliateLink: z.string().url().optional().or(z.literal("")),
  bookingComUrl: z.string().url().optional().or(z.literal("")),
  agodaUrl: z.string().url().optional().or(z.literal("")),
  directBookingContact: z.string().optional(),
  enquiryFormEnabled: z.boolean().default(false),
  featuredText: z.string().optional(),
  rating: z.string().optional(),
  reviewCount: z.string().optional(),
  reviews: z.string().optional(),
  googleMapsUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  isPremium: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  isRecommended: z.boolean().default(false),
});

type BusinessFormData = z.infer<typeof businessFormSchema>;

export default function AdminBusinesses() {
  const [editingBusiness, setEditingBusiness] = useState<BusinessWithCategory | null>(null);
  const [viewingBusiness, setViewingBusiness] = useState<BusinessWithCategory | null>(null);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: businesses = [], isLoading: businessesLoading } = useQuery<BusinessWithCategory[]>({
    queryKey: ["/api/businesses", { showAll: true }],
    queryFn: () => fetch("/api/businesses?showAll=true").then(res => {
      if (!res.ok) throw new Error('Failed to fetch businesses');
      return res.json();
    }),
  });

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: "",
      description: "",
      latitude: "",
      longitude: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      hours: "",
      imageUrl: "",
      gallery: "",
      categoryIds: [],
      tags: "",
      priceRange: "",
      amenities: "",
      bookingType: "none",
      affiliateLink: "",
      bookingComUrl: "",
      agodaUrl: "",
      directBookingContact: "",
      enquiryFormEnabled: false,
      featuredText: "",
      rating: "",
      reviewCount: "",
      reviews: "",
      googleMapsUrl: "",
      isActive: true,
      isPremium: false,
      isVerified: false,
      isRecommended: false,
    },
  });

  const createBusinessMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      const payload = {
        ...data,
        gallery: data.gallery ? data.gallery.split(',').map(url => url.trim()).filter(url => url.length > 0) : [],
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        amenities: data.amenities ? data.amenities.split(',').map(amenity => amenity.trim()).filter(amenity => amenity.length > 0) : [],
        reviewCount: data.reviewCount ? parseInt(data.reviewCount) : undefined,
        reviews: data.reviews ? JSON.parse(data.reviews) : undefined,
      };
      
      return apiRequest("POST", "/api/businesses", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      form.reset();
      setSelectedCategoryIds([]);
      toast({
        title: "Success",
        description: "Business created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create business",
        variant: "destructive",
      });
    },
  });

  const updateBusinessMutation = useMutation({
    mutationFn: async (data: BusinessFormData & { id: number }) => {
      const payload = {
        ...data,
        gallery: data.gallery ? data.gallery.split(',').map(url => url.trim()).filter(url => url.length > 0) : [],
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        amenities: data.amenities ? data.amenities.split(',').map(amenity => amenity.trim()).filter(amenity => amenity.length > 0) : [],
        reviewCount: data.reviewCount ? parseInt(data.reviewCount) : undefined,
        reviews: data.reviews ? JSON.parse(data.reviews) : undefined,
      };
      
      return apiRequest("PUT", `/api/businesses/${data.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      setEditingBusiness(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Business updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update business",
        variant: "destructive",
      });
    },
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

  

  // Effect to load business data when editing
  useEffect(() => {
    if (editingBusiness) {
      const categoryIds = editingBusiness.categories?.map(cat => cat.id) || [];
      setSelectedCategoryIds(categoryIds);
      
      form.reset({
        name: editingBusiness.name,
        description: editingBusiness.description || "",
        latitude: editingBusiness.latitude?.toString() || "",
        longitude: editingBusiness.longitude?.toString() || "",
        address: editingBusiness.address || "",
        phone: editingBusiness.phone || "",
        email: editingBusiness.email || "",
        website: editingBusiness.website || "",
        hours: editingBusiness.hours || "",
        imageUrl: editingBusiness.imageUrl || "",
        gallery: Array.isArray(editingBusiness.gallery) ? editingBusiness.gallery.join(', ') : "",
        categoryIds: categoryIds,
        tags: Array.isArray(editingBusiness.tags) ? editingBusiness.tags.join(', ') : "",
        priceRange: editingBusiness.priceRange || "",
        amenities: Array.isArray(editingBusiness.amenities) ? editingBusiness.amenities.join(', ') : "",
        bookingType: (editingBusiness.bookingType as "none" | "direct" | "affiliate") || "none",
        affiliateLink: editingBusiness.affiliateLink || "",
        bookingComUrl: editingBusiness.bookingComUrl || "",
        agodaUrl: editingBusiness.agodaUrl || "",
        directBookingContact: editingBusiness.directBookingContact || "",
        enquiryFormEnabled: editingBusiness.enquiryFormEnabled || false,
        featuredText: editingBusiness.featuredText || "",
        rating: editingBusiness.rating?.toString() || "",
        reviewCount: editingBusiness.reviewCount?.toString() || "",
        reviews: editingBusiness.reviews ? JSON.stringify(editingBusiness.reviews, null, 2) : "",
        googleMapsUrl: editingBusiness.googleMapsUrl || "",
        isActive: editingBusiness.isActive ?? true,
        isPremium: editingBusiness.isPremium || false,
        isVerified: editingBusiness.isVerified || false,
        isRecommended: editingBusiness.isRecommended || false,
      });
    }
  }, [editingBusiness, form]);

  const onSubmit = (data: BusinessFormData) => {
    const formData = {
      ...data,
      categoryIds: selectedCategoryIds,
    };
    
    if (editingBusiness) {
      updateBusinessMutation.mutate({ ...formData, id: editingBusiness.id });
    } else {
      createBusinessMutation.mutate(formData);
    }
  };

  if (businessesLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Businesses</h1>
          <p className="text-gray-600">Loading businesses...</p>
        </div>
      </div>
    );
  }

  const filteredBusinesses = searchQuery
    ? businesses.filter((business) =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : businesses;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Existing Businesses ({filteredBusinesses.length} of {businesses.length})</CardTitle>
          <CardDescription>View and manage current business listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search businesses by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

                <div className="space-y-4">
              {filteredBusinesses.map((business) => (
                <div key={business.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{business.name}</h3>
                      {business.categories && business.categories.length > 0 && (
                        <p className="text-sm text-gray-600 mb-2">
                          {business.categories.map(cat => cat.name).join(', ')}
                        </p>
                      )}
                      {business.address && (
                        <p className="text-sm text-gray-500 mb-2">{business.address}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {business.isActive && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                        {business.isPremium && <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>}
                        {business.isVerified && <Badge className="bg-blue-100 text-blue-800">Verified</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setViewingBusiness(business);
                          setIsBusinessModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingBusiness(business);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4 text-red-600" />
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
                              onClick={() => deleteBusinessMutation.mutate(business.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Modal */}
      {viewingBusiness && (
        <BusinessModal
          business={viewingBusiness}
          isOpen={isBusinessModalOpen}
          onClose={() => {
            setIsBusinessModalOpen(false);
            setViewingBusiness(null);
          }}
        />
      )}

      {/* Edit Business Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Business</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Business Name *</Label>
                <Input
                  id="edit-name"
                  {...form.register("name")}
                  placeholder="Enter business name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  {...form.register("address")}
                  placeholder="Enter business address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-latitude">Latitude *</Label>
                <Input
                  id="edit-latitude"
                  {...form.register("latitude")}
                  placeholder="e.g., 17.4738"
                  type="number"
                  step="any"
                />
                {form.formState.errors.latitude && (
                  <p className="text-sm text-red-600">{form.formState.errors.latitude.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-longitude">Longitude *</Label>
                <Input
                  id="edit-longitude"
                  {...form.register("longitude")}
                  placeholder="e.g., 106.6229"
                  type="number"
                  step="any"
                />
                {form.formState.errors.longitude && (
                  <p className="text-sm text-red-600">{form.formState.errors.longitude.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                {...form.register("description")}
                placeholder="Enter business description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Categories *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategoryIds([...selectedCategoryIds, category.id]);
                        } else {
                          setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== category.id));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
              {selectedCategoryIds.length === 0 && form.formState.errors.categoryIds && (
                <p className="text-sm text-red-600">{form.formState.errors.categoryIds.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingBusiness(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateBusinessMutation.isPending}>
                {updateBusinessMutation.isPending ? "Updating..." : "Update Business"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}