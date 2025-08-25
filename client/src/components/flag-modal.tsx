import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertFlagSchema, type InsertFlag } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FlagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
}

export function FlagModal({ open, onOpenChange, productId, productName }: FlagModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertFlag>({
    resolver: zodResolver(insertFlagSchema),
    defaultValues: {
      productId: productId,
      reporterName: "",
      reporterEmail: "",
      reason: "",
      description: "",
    },
  });

  const createFlagMutation = useMutation({
    mutationFn: async (data: InsertFlag) => {
      const response = await apiRequest("POST", "/api/flags", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report submitted successfully",
        description: "Thank you for helping keep our marketplace safe. Admin will review this report.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to submit report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertFlag) => {
    createFlagMutation.mutate({ ...data, productId });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="modal-flag">
        <DialogHeader>
          <DialogTitle data-testid="title-flag-modal">Report Item</DialogTitle>
          <p className="text-sm text-gray-600">Report "{productName}" for inappropriate content</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reporterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your full name" 
                      {...field} 
                      data-testid="input-reporter-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reporterEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="name23@iiserb.ac.in" 
                      {...field} 
                      data-testid="input-reporter-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Report *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-reason">
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                      <SelectItem value="fake">Fake/Misleading</SelectItem>
                      <SelectItem value="spam">Spam</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please explain why you're reporting this item..." 
                      rows={3}
                      {...field} 
                      data-testid="textarea-flag-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={createFlagMutation.isPending}
              data-testid="button-submit-flag"
            >
              {createFlagMutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}