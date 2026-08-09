import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { favoritesQuery, type Product } from "@/lib/eco";

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: favoriteIds = [] } = useQuery(favoritesQuery(user?.id));

  const mutation = useMutation({
    mutationFn: async (product: Product) => {
      if (!user) throw new Error("Sign in to save favorites");
      if (favoriteIds.includes(product.id)) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("product_id", product.id)
          .eq("user_id", user.id);
        if (error) throw error;
        return "removed" as const;
      }
      const { error } = await supabase
        .from("favorites")
        .insert({ product_id: product.id, user_id: user.id });
      if (error) throw error;
      return "added" as const;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(result === "added" ? "Saved to favorites" : "Removed from favorites");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    favoriteIds,
    isSignedIn: Boolean(user),
    toggleFavorite: (product: Product) => mutation.mutate(product),
  };
}
