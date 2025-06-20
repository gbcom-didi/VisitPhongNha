import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Save, Eye, X, Edit } from "lucide-react";
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
  imageUrl: z.string().url().optional().or(z.literal("")),
  gallery: z.string().optional(),
  categoryIds: z.array(z.number()).min(1, "At least one category is required"),
  tags: z.string().optional(),
  priceRange: z.string().optional(),
  amenities: z.string().optional(),
  bookingType: z.enum(["none", "direct", "affiliate"]).default("none"),
  affiliateLink: z.string().url().optional().or(z.literal("")),
  directBookingContact: z.string().optional(),
  enquiryFormEnabled: z.boolean().default(false),
  featuredText: z.string().optional(),
  isActive: z.boolean().default(true),
  isPremium: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  isRecommended: z.boolean().default(false),
});

type BusinessFormData = z.infer<typeof businessFormSchema>;

export default function Admin() {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithCategory | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: businesses = [] } = useQuery<BusinessWithCategory[]>({
    queryKey: ["/api/businesses"],
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
      directBookingContact: "",
      enquiryFormEnabled: false,
      featuredText: "",
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
        gallery: data.gallery ? data.gallery.split(',').map(url => url.trim()) : null,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : null,
        amenities: data.amenities ? data.amenities.split(',').map(amenity => amenity.trim()) : null,
      };
      return apiRequest("/api/businesses", "POST", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      form.reset();
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

  const loadBusiness = (business: BusinessWithCategory) => {
    setSelectedBusiness(business);
    const categoryIds = business.categories?.map(c => c.id) || (business.category ? [business.category.id] : []);
    setSelectedCategoryIds(categoryIds);
    form.reset({
      name: business.name,
      description: business.description || "",
      latitude: business.latitude,
      longitude: business.longitude,
      address: business.address || "",
      phone: business.phone || "",
      email: business.email || "",
      website: business.website || "",
      hours: business.hours || "",
      imageUrl: business.imageUrl || "",
      gallery: business.gallery?.join(', ') || "",
      categoryIds: categoryIds,
      tags: business.tags?.join(', ') || "",
      priceRange: business.priceRange || "",
      amenities: business.amenities?.join(', ') || "",
      bookingType: (business.bookingType as "none" | "direct" | "affiliate") || "none",
      affiliateLink: business.affiliateLink || "",
      directBookingContact: business.directBookingContact || "",
      enquiryFormEnabled: business.enquiryFormEnabled || false,
      featuredText: business.featuredText || "",
      isActive: business.isActive !== false,
      isPremium: business.isPremium || false,
      isVerified: business.isVerified || false,
      isRecommended: business.isRecommended || false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ĐiĐi VUi Admin</h1>
          <p className="text-gray-600">Manage business listings and content</p>
        </div>

        <Tabs defaultValue="add-business" className="space-y-6">
          <TabsList>
            <TabsTrigger value="add-business">Add Business</TabsTrigger>
            <TabsTrigger value="manage-businesses">Manage Businesses</TabsTrigger>
          </TabsList>

          <TabsContent value="add-business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Business Listing</CardTitle>
                <CardDescription>
                  Complete business information for the directory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Basic Information</h3>
                      
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

                      <div>
                        <Label htmlFor="featuredText">Featured Text</Label>
                        <Input {...form.register("featuredText")} placeholder="Short marketing tagline" />
                      </div>
                    </div>

                    {/* Location & Contact */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Location & Contact</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="latitude">Latitude *</Label>
                          <Input {...form.register("latitude")} placeholder="12.345678" />
                        </div>
                        <div>
                          <Label htmlFor="longitude">Longitude *</Label>
                          <Input {...form.register("longitude")} placeholder="109.123456" />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea {...form.register("address")} rows={2} />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input {...form.register("phone")} />
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input {...form.register("email")} type="email" />
                      </div>

                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input {...form.register("website")} placeholder="https://" />
                      </div>

                      <div>
                        <Label htmlFor="hours">Opening Hours</Label>
                        <Input {...form.register("hours")} placeholder="Mon-Sun: 9am-10pm" />
                      </div>
                    </div>
                  </div>

                  {/* Media & Content */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Media & Content</h3>
                    
                    <div>
                      <Label htmlFor="imageUrl">Main Image URL</Label>
                      <Input {...form.register("imageUrl")} placeholder="https://" />
                    </div>

                    <div>
                      <Label htmlFor="gallery">Gallery URLs</Label>
                      <Textarea {...form.register("gallery")} rows={2} placeholder="Comma-separated URLs" />
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input {...form.register("tags")} placeholder="budget, kitesurf, beachfront" />
                    </div>

                    <div>
                      <Label htmlFor="amenities">Amenities</Label>
                      <Input {...form.register("amenities")} placeholder="WiFi, Free breakfast, Surf rental" />
                    </div>

                    <div>
                      <Label htmlFor="priceRange">Price Range</Label>
                      <Input {...form.register("priceRange")} placeholder="200k-400k VND or $$" />
                    </div>
                  </div>

                  {/* Booking & Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Booking & Settings</h3>
                    
                    <div>
                      <Label htmlFor="bookingType">Booking Type</Label>
                      <Select onValueChange={(value) => form.setValue("bookingType", value as "none" | "direct" | "affiliate")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select booking type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Booking</SelectItem>
                          <SelectItem value="direct">Direct Booking</SelectItem>
                          <SelectItem value="affiliate">Affiliate Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="affiliateLink">Affiliate Link</Label>
                      <Input {...form.register("affiliateLink")} placeholder="https://booking.com/..." />
                    </div>

                    <div>
                      <Label htmlFor="directBookingContact">Direct Booking Contact</Label>
                      <Input {...form.register("directBookingContact")} placeholder="Phone, WhatsApp, or email" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch {...form.register("enquiryFormEnabled")} />
                        <Label>Enquiry Form</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch {...form.register("isActive")} />
                        <Label>Active</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch {...form.register("isPremium")} />
                        <Label>Premium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch {...form.register("isVerified")} />
                        <Label>Verified</Label>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch {...form.register("isRecommended")} />
                      <Label>Recommended</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => {
                      form.reset();
                      setSelectedCategoryIds([]);
                    }}>
                      Clear Form
                    </Button>
                    <Button type="submit" disabled={createBusinessMutation.isPending}>
                      <Save className="w-4 h-4 mr-2" />
                      {createBusinessMutation.isPending ? "Creating..." : "Create Business"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage-businesses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Existing Businesses ({businesses.length})</CardTitle>
                <CardDescription>
                  View and manage current business listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {businesses.map((business) => (
                    <div key={business.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{business.name}</h4>
                          <div className="text-sm text-gray-600 mb-2">
                            {business.categories?.map(cat => cat.name).join(', ') || business.category?.name || 'No category'}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {business.isPremium && <Badge variant="secondary">Premium</Badge>}
                            {business.isVerified && <Badge variant="outline">Verified</Badge>}
                            {business.isRecommended && <Badge className="bg-tropical-aqua text-white">Recommended</Badge>}
                            {!business.isActive && <Badge variant="destructive">Inactive</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => loadBusiness(business)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}