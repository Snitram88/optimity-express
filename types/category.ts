export type Category = {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};