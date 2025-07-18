import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Search, Calendar, MapPin, Eye, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Article } from "@shared/schema";

const articleFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  summary: z.string().min(1, "Summary is required"),
  mainImageUrl: z.string().optional().or(z.literal("")),
  publicationDate: z.string().min(1, "Publication date is required"),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  tags: z.string().optional(),
  contentHtml: z.string().min(1, "Content is required"),
  mapOverlay: z.string().optional(),
  externalUrl: z.string().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type ArticleFormData = z.infer<typeof articleFormSchema>;

export default function AdminArticles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      author: "",
      summary: "",
      mainImageUrl: "",
      publicationDate: "",
      latitude: "",
      longitude: "",
      tags: "",
      contentHtml: "",
      mapOverlay: "",
      externalUrl: "",
      isFeatured: false,
      isActive: true,
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const payload = {
        ...data,
        publicationDate: new Date(data.publicationDate).toISOString(),
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      };
      
      return apiRequest("POST", "/api/articles", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      form.reset();
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Article created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create article",
        variant: "destructive",
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData & { id: number }) => {
      const payload = {
        ...data,
        publicationDate: new Date(data.publicationDate).toISOString(),
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      };
      
      return apiRequest("PUT", `/api/articles/${data.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      form.reset();
      setEditingArticle(null);
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update article",
        variant: "destructive",
      });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (articleId: number) => {
      return apiRequest("DELETE", `/api/articles/${articleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete article",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    console.log('Form submission data:', data);
    console.log('Form errors:', form.formState.errors);
    
    if (editingArticle) {
      updateArticleMutation.mutate({ ...data, id: editingArticle.id });
    } else {
      createArticleMutation.mutate(data);
    }
  };

  const loadArticle = (article: Article) => {
    setEditingArticle(article);
    form.reset({
      title: article.title,
      author: article.author,
      summary: article.summary,
      mainImageUrl: article.mainImageUrl || "",
      publicationDate: new Date(article.publicationDate).toISOString().split('T')[0],
      latitude: article.latitude.toString(),
      longitude: article.longitude.toString(),
      tags: article.tags?.join(', ') || "",
      contentHtml: article.contentHtml,
      mapOverlay: article.mapOverlay || "",
      externalUrl: article.externalUrl || "",
      isFeatured: article.isFeatured || false,
      isActive: article.isActive !== false,
    });
  };

  const resetForm = () => {
    form.reset();
    setEditingArticle(null);
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inspiration Articles</h1>
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inspiration Articles</h1>
          <p className="text-gray-600">Manage editorial content and travel inspiration</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-tropical-aqua hover:bg-tropical-aqua/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Article</DialogTitle>
              <DialogDescription>Create a new inspiration article for travelers visiting Phong Nha.</DialogDescription>
            </DialogHeader>
            <ArticleForm 
              form={form} 
              onSubmit={onSubmit} 
              isSubmitting={createArticleMutation.isPending}
              onReset={resetForm}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="manage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="manage">Manage Articles</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Search Articles</CardTitle>
              <CardDescription>Find articles by title or author</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="text-sm text-gray-600">
            Showing {filteredArticles.length} of {articles.length} articles
          </div>

          {/* Article Cards */}
          <div className="grid gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        {article.isFeatured && (
                          <Badge variant="secondary" className="bg-mango-yellow text-black">
                            Featured
                          </Badge>
                        )}
                        {!article.isActive && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(article.publicationDate).toLocaleDateString()}
                        </div>
                        <div>By {article.author}</div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {parseFloat(article.latitude).toFixed(4)}, {parseFloat(article.longitude).toFixed(4)}
                        </div>
                      </div>

                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`/inspiration/${article.id}`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => loadArticle(article)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Article</DialogTitle>
                            <DialogDescription>Update the article details and content.</DialogDescription>
                          </DialogHeader>
                          <ArticleForm 
                            form={form} 
                            onSubmit={onSubmit} 
                            isSubmitting={updateArticleMutation.isPending}
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
                            <AlertDialogTitle>Delete Article</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{article.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => deleteArticleMutation.mutate(article.id)}
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
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {article.summary}
                    </p>
                    
                    <div className="text-xs text-gray-400">
                      Created: {new Date(article.createdAt).toLocaleDateString()}
                      {article.updatedAt && (
                        <> • Updated: {new Date(article.updatedAt).toLocaleDateString()}</>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? "Try adjusting your search criteria" 
                    : "No articles have been created yet"
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Article Form Component
function ArticleForm({ 
  form, 
  onSubmit, 
  isSubmitting, 
  onReset, 
  isEditing = false 
}: { 
  form: any; 
  onSubmit: (data: ArticleFormData) => void; 
  isSubmitting: boolean; 
  onReset: () => void;
  isEditing?: boolean;
}) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="author">Author *</Label>
            <Input {...form.register("author")} />
            {form.formState.errors.author && (
              <p className="text-sm text-red-600">{form.formState.errors.author.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="summary">Summary *</Label>
            <Textarea {...form.register("summary")} rows={3} />
            {form.formState.errors.summary && (
              <p className="text-sm text-red-600">{form.formState.errors.summary.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="publicationDate">Publication Date *</Label>
            <Input {...form.register("publicationDate")} type="date" />
            {form.formState.errors.publicationDate && (
              <p className="text-sm text-red-600">{form.formState.errors.publicationDate.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input {...form.register("tags")} placeholder="caves, adventure, culture" />
          </div>
        </div>

        {/* Location & Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Location & Media</h3>
          
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
            <Label htmlFor="mainImageUrl">Main Image URL</Label>
            <Input {...form.register("mainImageUrl")} placeholder="https://... or images/..." />
            {form.formState.errors.mainImageUrl && (
              <p className="text-sm text-red-600">{form.formState.errors.mainImageUrl.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="externalUrl">External URL</Label>
            <Input {...form.register("externalUrl")} placeholder="https://..." />
            {form.formState.errors.externalUrl && (
              <p className="text-sm text-red-600">{form.formState.errors.externalUrl.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isFeatured">Featured Article</Label>
              <Controller
                name="isFeatured"
                control={form.control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Controller
                name="isActive"
                control={form.control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        <Label htmlFor="contentHtml">Content (HTML) *</Label>
        <Textarea {...form.register("contentHtml")} rows={10} className="font-mono text-sm" />
        {form.formState.errors.contentHtml && (
          <p className="text-sm text-red-600">{form.formState.errors.contentHtml.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onReset}>
          Reset
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-tropical-aqua hover:bg-tropical-aqua/90"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? "Saving..." : (isEditing ? "Update Article" : "Create Article")}
        </Button>
      </div>
    </form>
  );
}