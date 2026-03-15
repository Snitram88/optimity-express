export type ExplorerListing = {
  id: string;
  title: string;
  description: string | null;
  price_optional: number | null;
  is_featured: boolean;
  vendor: {
    business_name: string;
    slug: string;
  } | null;
};

export type ExplorerSubcategory = {
  id: string;
  name: string;
  slug: string;
};

export type ExplorerCategory = {
  id: string;
  name: string;
  slug: string;
  subcategories: ExplorerSubcategory[];
  recommendedListings: ExplorerListing[];
};
