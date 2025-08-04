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
import { Plus, X, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@shared/schema";

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
  imageUrl: z.string().optional().or(z.literal("")).refine(val => {
    if (!val) return true;
    if (val.length > 1000) return false;
    // Allow full URLs or relative paths starting with /
    return val.startsWith('/') || /^https?:\/\//.test(val);
  }, "Image URL must be a valid URL or relative path starting with /"),
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

export default function AdminAddBusiness() {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
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

  const onSubmit = (data: BusinessFormData) => {
    createBusinessMutation.mutate(data);
  };

  const resetForm = () => {
    form.reset();
    setSelectedCategoryIds([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Business</h1>
        <p className="text-gray-600">Create a new business listing for the directory</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Complete all required fields to add a new business to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Business Name *</Label>
                      <Input {...form.register("name")} />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea {...form.register("description")} rows={3} />
                    </div>

                    <div>
                      <Label htmlFor="categories">Categories *</Label>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {selectedCategoryIds.map(categoryId => {
                            const category = categories.find(c => c.id === categoryId);
                            return category ? (
                              <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                                {category.name}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newIds = selectedCategoryIds.filter(id => id !== categoryId);
                                    setSelectedCategoryIds(newIds);
                                    form.setValue("categoryIds", newIds);
                                  }}
                                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                        <Select onValueChange={(value) => {
                          const categoryId = parseInt(value);
                          if (!selectedCategoryIds.includes(categoryId)) {
                            const newIds = [...selectedCategoryIds, categoryId];
                            setSelectedCategoryIds(newIds);
                            form.setValue("categoryIds", newIds);
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Add category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.filter(category => !selectedCategoryIds.includes(category.id)).map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {form.formState.errors.categoryIds && (
                        <p className="text-sm text-red-600">{form.formState.errors.categoryIds.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Location</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="latitude">Latitude *</Label>
                        <Input {...form.register("latitude")} placeholder="17.123456" />
                        {form.formState.errors.latitude && (
                          <p className="text-sm text-red-600">{form.formState.errors.latitude.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="longitude">Longitude *</Label>
                        <Input {...form.register("longitude")} placeholder="106.123456" />
                        {form.formState.errors.longitude && (
                          <p className="text-sm text-red-600">{form.formState.errors.longitude.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea {...form.register("address")} rows={2} />
                    </div>

                    <div>
                      <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
                      <Input {...form.register("googleMapsUrl")} placeholder="https://maps.google.com/..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Media */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input {...form.register("phone")} />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input {...form.register("email")} type="email" />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input {...form.register("website")} placeholder="https://..." />
                      {form.formState.errors.website && (
                        <p className="text-sm text-red-600">{form.formState.errors.website.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="hours">Operating Hours</Label>
                      <Textarea {...form.register("hours")} rows={2} placeholder="Mon-Fri: 9AM-6PM" />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Media</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="imageUrl">Main Image URL</Label>
                      <Input {...form.register("imageUrl")} placeholder="https://..." />
                      {form.formState.errors.imageUrl && (
                        <p className="text-sm text-red-600">{form.formState.errors.imageUrl.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="gallery">Gallery URLs (comma-separated)</Label>
                      <Textarea {...form.register("gallery")} rows={2} placeholder="https://image1.jpg, https://image2.jpg" />
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isActive">Active</Label>
                      <Switch {...form.register("isActive")} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="isPremium">Premium Listing</Label>
                      <Switch {...form.register("isPremium")} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="isVerified">Verified</Label>
                      <Switch {...form.register("isVerified")} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="isRecommended">Recommended</Label>
                      <Switch {...form.register("isRecommended")} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={resetForm}>
                Reset Form
              </Button>
              <Button 
                type="submit" 
                disabled={createBusinessMutation.isPending}
                className="bg-tropical-aqua hover:bg-tropical-aqua/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {createBusinessMutation.isPending ? "Creating..." : "Create Business"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}