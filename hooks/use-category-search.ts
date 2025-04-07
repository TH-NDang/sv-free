import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export interface Option {
  value: string;
  label: string;
  group?: string;
  description?: string;
  disable?: boolean;
  fixed?: boolean;
  [key: string]: string | boolean | undefined;
}

/**
 * Types for category API responses
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook for searching and managing categories
 * Provides functionality for:
 * - Loading categories with pagination
 * - Searching categories by name/description
 * - Creating new categories
 */
export function useCategorySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Fetch initial categories (no search term)
   */
  const fetchCategories = async (): Promise<Option[]> => {
    try {
      const response = await fetch("/api/categories?limit=50");

      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.statusText}`);
      }
      const data: Category[] = await response.json();

      // Transform categories from DB format to Option format
      return data.map((category) => ({
        value: category.id,
        label: category.name,
        group: "Categories",
        description: category.description || undefined,
      }));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Không thể tải danh sách danh mục");
      return [];
    }
  };

  /**
   * Initial categories load with React Query
   */
  const {
    data: initialCategories = [],
    isLoading: isLoadingInitial,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Search query with React Query
   */
  const { data: searchResults = [], isLoading: isLoadingSearch } = useQuery({
    queryKey: ["categories", "search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return initialCategories;

      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/categories?search=${encodeURIComponent(searchTerm)}`
        );

        if (!response.ok) {
          throw new Error(`Error searching categories: ${response.statusText}`);
        }

        const data: Category[] = await response.json();

        // Transform search results to Option format
        return data.map((category) => ({
          value: category.id,
          label: category.name,
          group: "Categories",
          description: category.description || undefined,
        }));
      } catch (error) {
        console.error("Failed to search categories:", error);
        return [];
      } finally {
        setIsSearching(false);
      }
    },
    enabled: !!searchTerm,
    staleTime: 60 * 1000, // 1 minute
  });

  /**
   * Create a new category
   */
  const createCategory = async (name: string): Promise<Option | null> => {
    try {
      // Generate a simple slug from the name
      const slug = name.toLowerCase().replace(/\s+/g, "-");

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, slug }),
      });

      if (!response.ok) {
        throw new Error(`Error creating category: ${response.statusText}`);
      }

      const newCategory: Category = await response.json();

      // Refresh the category list
      refetchCategories();

      return {
        value: newCategory.id,
        label: newCategory.name,
        group: "Categories",
        description: newCategory.description || undefined,
      };
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Không thể tạo danh mục mới");
      return null;
    }
  };

  /**
   * This function is called by the MultiSelect component when user types
   */
  const handleSearch = async (term: string): Promise<Option[]> => {
    setSearchTerm(term);

    // Return immediately, the query above will handle the actual search
    return term ? searchResults : initialCategories;
  };

  // Determine which categories to show
  const categoryOptions = searchTerm ? searchResults : initialCategories;
  const isLoading = isLoadingInitial || isLoadingSearch || isSearching;

  return {
    handleSearch,
    categoryOptions,
    isLoading,
    createCategory,
    refetchCategories,
  };
}
