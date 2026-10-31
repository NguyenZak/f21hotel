import { Shell } from "@/cms/client/Shell";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Shell>{children}</Shell>;
}
