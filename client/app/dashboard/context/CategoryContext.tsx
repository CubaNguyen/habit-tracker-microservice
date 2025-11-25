"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { categoryApi } from "@/lib/api/habit";

type Category = { id: string; name: string };

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  refreshCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | null>(null);

export const CategoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshCategories();
  }, []);

  const refreshCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getAll();
      setCategories(res.data || []);
    } catch (err) {
      console.error("Load categories failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (name: string) => {
    try {
      const res = await categoryApi.create({ name });
      const newCat = res.data;
      setCategories((prev) => [...prev, newCat]);
      return newCat;
    } catch (err) {
      console.error("Create category failed:", err);
      return null;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryApi.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete category failed:", err);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        refreshCategories,
        createCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategory must be used within CategoryProvider");
  return ctx;
};
