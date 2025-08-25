import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertSuggestionSchema, type InsertSuggestion } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SuggestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuggestionModal({ open, onOpenChange }: SuggestionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertSuggestion>({
    resolver: zodResolver(insertSuggestionSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      priority: "",
      description: "",
    },
  });

  const createSuggestionMutation = useMutation({
    mutationFn: async (data: InsertSuggestion) => {
      const response = await apiRequest("POST", "/api/suggestions", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you for your suggestion!",
        description: "We value your feedback and will review it soon.",
      });
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/suggestions"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to submit suggestion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSuggestion) => {
    createSuggestionMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" data-testid="modal-suggestion">
        <DialogHeader>
          <DialogTitle data-testid="title-suggestion-modal">Share Your Suggestion</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your name" 
                      {...field} 
                      data-testid="input-suggestion-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="name23@iiserb.ac.in" 
                      {...field} 
                      data-testid="input-suggestion-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-suggestion-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new-feature">New Feature</SelectItem>
                      <SelectItem value="ui">UI Improvement</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="mobile-app">Mobile App</SelectItem>
                      <SelectItem value="search-filter">Search and Filter</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-suggestion-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your suggestion in detail" 
                      rows={4}
                      {...field} 
                      data-testid="textarea-suggestion-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90"
              disabled={createSuggestionMutation.isPending}
              data-testid="button-submit-suggestion"
            >
              {createSuggestionMutation.isPending ? "Submitting..." : "Submit Suggestion"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
