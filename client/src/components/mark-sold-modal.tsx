import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const markSoldSchema = z.object({
  sellerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type MarkSoldForm = z.infer<typeof markSoldSchema>;

interface MarkSoldModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
}

export function MarkSoldModal({ open, onOpenChange, productId, productName }: MarkSoldModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MarkSoldForm>({
    resolver: zodResolver(markSoldSchema),
    defaultValues: {
      sellerPhone: "",
    },
  });

  const markSoldMutation = useMutation({
    mutationFn: async (data: MarkSoldForm) => {
      const response = await apiRequest("PATCH", `/api/products/${productId}/mark-sold`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Item marked as sold!",
        description: "Your item has been marked as sold and removed from the marketplace.",
      });
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to mark as sold",
        description: "Please verify your phone number matches the one used when listing the item.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MarkSoldForm) => {
    markSoldMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="modal-mark-sold">
        <DialogHeader>
          <DialogTitle data-testid="title-mark-sold-modal">Mark as Sold</DialogTitle>
          <p className="text-sm text-gray-600">Mark "{productName}" as sold</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sellerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verify Your Phone Number *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your phone number to verify" 
                      {...field} 
                      data-testid="input-seller-phone-verify"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500">
                    Enter the same phone number you used when listing this item
                  </p>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={markSoldMutation.isPending}
              data-testid="button-confirm-mark-sold"
            >
              {markSoldMutation.isPending ? "Marking as Sold..." : "Confirm - Mark as Sold"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}