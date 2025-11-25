"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { tagApi } from "@/lib/api/habit";

type Tag = { id: string; name: string };

interface TagContextType {
  tags: Tag[];
  loading: boolean;
  refreshTags: () => Promise<void>;
  createTag: (name: string) => Promise<Tag | null>;
  deleteTag: (id: string) => Promise<void>;
}

const TagContext = createContext<TagContextType | null>(null);

export const TagProvider = ({ children }: { children: React.ReactNode }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshTags();
  }, []);

  const refreshTags = async () => {
    try {
      setLoading(true);
      const res = await tagApi.getAll();
      setTags(res.data || []);
    } catch (err) {
      console.error("Load tags failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (name: string) => {
    try {
      const res = await tagApi.create({ name });
      const newTag = res.data;
      setTags((prev) => [...prev, newTag]);
      return newTag;
    } catch (err) {
      console.error("Create tag failed:", err);
      return null;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      await tagApi.delete(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete tag failed:", err);
    }
  };

  return (
    <TagContext.Provider
      value={{
        tags,
        loading,
        refreshTags,
        createTag,
        deleteTag,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

export const useTag = () => {
  const ctx = useContext(TagContext);
  if (!ctx) throw new Error("useTag must be used within TagProvider");
  return ctx;
};
