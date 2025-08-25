import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Store, LogOut, Package, Clock, Users, IndianRupee, Flag } from "lucide-react";
import { type Product, type Request, type Suggestion, type Flag as FlagType } from "@shared/schema";
import { formatCurrency, getUrgencyColor, getPriorityColor } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalProducts: number;
    pendingRequests: number;
    activeSellers: number;
    totalValue: number;
  }>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
  });

  const { data: requests, isLoading: requestsLoading } = useQuery<Request[]>({
    queryKey: ["/api/admin/requests"],
  });

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery<Suggestion[]>({
    queryKey: ["/api/admin/suggestions"],
  });

  const { data: flags, isLoading: flagsLoading } = useQuery<FlagType[]>({
    queryKey: ["/api/admin/flags"],
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/products/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const markSoldMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("PATCH", `/api/admin/products/${id}/sold`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product marked as sold",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to mark product as sold",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const approveRequestMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("PATCH", `/api/admin/requests/${id}/approve`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request approved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to approve request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteSuggestionMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/suggestions/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Suggestion deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/suggestions"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete suggestion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteFlagMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/flags/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Flag deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/flags"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete flag",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (statsLoading || productsLoading || requestsLoading || suggestionsLoading || flagsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Store className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">HostelMart</span>
                <div className="text-sm text-slate-300">Admin Dashboard</div>
              </div>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20" data-testid="button-logout">
                <LogOut className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2" data-testid="title-admin-dashboard">
              Dashboard Overview
            </h1>
            <p className="text-gray-600">Manage HostelMart for IISER Bhopal students</p>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Products</p>
                    <p className="text-3xl font-bold text-blue-900" data-testid="stat-total-products">
                      {stats?.totalProducts || 0}
                    </p>
                  </div>
                  <div className="bg-blue-600 p-3 rounded-full">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Pending Requests</p>
                    <p className="text-3xl font-bold text-orange-900" data-testid="stat-pending-requests">
                      {stats?.pendingRequests || 0}
                    </p>
                  </div>
                  <div className="bg-orange-600 p-3 rounded-full">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Active Sellers</p>
                    <p className="text-3xl font-bold text-emerald-900" data-testid="stat-active-sellers">
                      {stats?.activeSellers || 0}
                    </p>
                  </div>
                  <div className="bg-emerald-600 p-3 rounded-full">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Total Value</p>
                    <p className="text-3xl font-bold text-purple-900" data-testid="stat-total-value">
                      {stats?.totalValue ? formatCurrency(stats.totalValue) : "₹0"}
                    </p>
                  </div>
                  <div className="bg-purple-600 p-3 rounded-full">
                    <IndianRupee className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Tables */}
          <div className="space-y-8">
            {/* Products Table */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                <CardTitle className="text-xl font-bold text-gray-900" data-testid="title-products-management">
                  Products Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((product) => (
                        <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                          <TableCell data-testid={`cell-product-name-${product.id}`}>
                            {product.name}
                          </TableCell>
                          <TableCell data-testid={`cell-product-price-${product.id}`}>
                            {formatCurrency(product.price)}
                          </TableCell>
                          <TableCell data-testid={`cell-product-seller-${product.id}`}>
                            {product.sellerName}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={product.isSold ? "secondary" : "default"}
                              data-testid={`badge-product-status-${product.id}`}
                            >
                              {product.isSold ? "Sold" : "Active"}
                            </Badge>
                          </TableCell>
                          <TableCell className="space-x-2">
                            {!product.isSold && (
                              <Button
                                size="sm"
                                onClick={() => markSoldMutation.mutate(product.id)}
                                disabled={markSoldMutation.isPending}
                                className="bg-secondary hover:bg-secondary/90"
                                data-testid={`button-mark-sold-${product.id}`}
                              >
                                Mark Sold
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteProductMutation.mutate(product.id)}
                              disabled={deleteProductMutation.isPending}
                              data-testid={`button-delete-product-${product.id}`}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Requests Table */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                <CardTitle className="text-xl font-bold text-gray-900" data-testid="title-item-requests">
                  Item Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Max Price</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests?.map((request) => (
                        <TableRow key={request.id} data-testid={`row-request-${request.id}`}>
                          <TableCell data-testid={`cell-request-title-${request.id}`}>
                            {request.title}
                          </TableCell>
                          <TableCell data-testid={`cell-request-max-price-${request.id}`}>
                            {formatCurrency(request.maxPrice)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={getUrgencyColor(request.urgency)}
                              data-testid={`badge-request-urgency-${request.id}`}
                            >
                              {request.urgency}
                            </Badge>
                          </TableCell>
                          <TableCell data-testid={`cell-request-email-${request.id}`}>
                            {request.requesterEmail}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={request.isApproved ? "default" : "secondary"}
                              data-testid={`badge-request-status-${request.id}`}
                            >
                              {request.isApproved ? "Approved" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {!request.isApproved && (
                              <Button
                                size="sm"
                                onClick={() => approveRequestMutation.mutate(request.id)}
                                disabled={approveRequestMutation.isPending}
                                data-testid={`button-approve-request-${request.id}`}
                              >
                                Approve
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions Table */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                <CardTitle className="text-xl font-bold text-gray-900" data-testid="title-user-suggestions">
                  User Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {suggestions?.map((suggestion) => (
                        <TableRow key={suggestion.id} data-testid={`row-suggestion-${suggestion.id}`}>
                          <TableCell data-testid={`cell-suggestion-name-${suggestion.id}`}>
                            {suggestion.name}
                          </TableCell>
                          <TableCell data-testid={`cell-suggestion-category-${suggestion.id}`}>
                            {suggestion.category}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={getPriorityColor(suggestion.priority)}
                              data-testid={`badge-suggestion-priority-${suggestion.id}`}
                            >
                              {suggestion.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate" data-testid={`cell-suggestion-description-${suggestion.id}`}>
                            {suggestion.description}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteSuggestionMutation.mutate(suggestion.id)}
                              disabled={deleteSuggestionMutation.isPending}
                              data-testid={`button-delete-suggestion-${suggestion.id}`}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Flags Table */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2" data-testid="title-reported-items">
                  <Flag className="h-5 w-5 text-red-600" />
                  Reported Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flags?.map((flag) => (
                        <TableRow key={flag.id} data-testid={`row-flag-${flag.id}`}>
                          <TableCell data-testid={`cell-flag-reporter-${flag.id}`}>
                            <div>
                              <div className="font-medium">{flag.reporterName}</div>
                              <div className="text-xs text-gray-500">{flag.reporterEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell data-testid={`cell-flag-product-${flag.id}`}>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {flag.productId.slice(0, 8)}...
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={flag.reason === 'inappropriate' ? 'destructive' : 'secondary'}
                              data-testid={`badge-flag-reason-${flag.id}`}
                            >
                              {flag.reason}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate" data-testid={`cell-flag-description-${flag.id}`}>
                            {flag.description}
                          </TableCell>
                          <TableCell data-testid={`cell-flag-date-${flag.id}`}>
                            {new Date(flag.createdAt!).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                deleteProductMutation.mutate(flag.productId);
                                deleteFlagMutation.mutate(flag.id);
                              }}
                              disabled={deleteProductMutation.isPending || deleteFlagMutation.isPending}
                              data-testid={`button-delete-flagged-product-${flag.id}`}
                            >
                              Delete Product
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteFlagMutation.mutate(flag.id)}
                              disabled={deleteFlagMutation.isPending}
                              data-testid={`button-dismiss-flag-${flag.id}`}
                            >
                              Dismiss Flag
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
