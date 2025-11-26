import { Category } from "./category";

export interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  refreshCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<void>;
}
