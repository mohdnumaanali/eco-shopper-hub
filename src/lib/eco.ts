import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  eco_rating: number;
  material: string | null;
  recycling: string | null;
  description: string | null;
  image_query: string;
  is_alternative: boolean;
  alternative_for: string | null;
};

export type EcoTip = {
  id: string;
  category: string;
  title: string;
  body: string;
  image_query: string;
};

export const productsQuery = (search: string, category: string) => ({
  queryKey: ["products", search, category],
  queryFn: async (): Promise<Product[]> => {
    let query = supabase
      .from("products")
      .select("*")
      .order("eco_rating", { ascending: false })
      .order("name");
    if (search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`name.ilike.${term},category.ilike.${term},material.ilike.${term}`);
    }
    if (category !== "All") query = query.eq("category", category);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as Product[];
  },
});

export const productQuery = (id: string) => ({
  queryKey: ["product", id],
  queryFn: async () => {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data as Product | null;
  },
});

export const alternativesQuery = (id: string) => ({
  queryKey: ["alternatives", id],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("alternative_for", id)
      .order("eco_rating", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Product[];
  },
});

export const tipsQuery = () => ({
  queryKey: ["tips"],
  queryFn: async (): Promise<EcoTip[]> => {
    const { data, error } = await supabase.from("eco_tips").select("*").order("category");
    if (error) throw error;
    return (data ?? []) as EcoTip[];
  },
});

export const favoritesQuery = (userId: string | undefined) => ({
  queryKey: ["favorites", userId],
  enabled: Boolean(userId),
  queryFn: async (): Promise<string[]> => {
    const { data, error } = await supabase.from("favorites").select("product_id");
    if (error) throw error;
    return (data ?? []).map((row) => row.product_id as string);
  },
});
