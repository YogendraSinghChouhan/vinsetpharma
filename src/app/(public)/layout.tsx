import { PublicLayout } from "@/components/layout/public-layout";

function PublicLayoutSection({ children, params: _params }: LayoutProps<"/">) {
  return <PublicLayout>{children}</PublicLayout>;
}

export default PublicLayoutSection;
