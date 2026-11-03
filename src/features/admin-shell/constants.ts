import {
  IconArticle,
  IconBox,
  IconCategory,
  IconFileInvoice,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import { ROUTES } from "@/config/site";

export const ADMIN_NAV = [
  {
    title: "Dashboard",
    url: ROUTES.admin,
    icon: IconLayoutDashboard,
  },
  {
    title: "Products",
    url: ROUTES.adminProducts,
    icon: IconBox,
  },
  {
    title: "Categories",
    url: ROUTES.adminCategories,
    icon: IconCategory,
  },
  {
    title: "Quote Requests",
    url: ROUTES.adminQuotes,
    icon: IconFileInvoice,
  },
  {
    title: "Blogs",
    url: ROUTES.adminBlogs,
    icon: IconArticle,
  },
] as const;

export type AdminNavItem = (typeof ADMIN_NAV)[number];
