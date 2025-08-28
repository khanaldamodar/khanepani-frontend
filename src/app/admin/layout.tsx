// app/admin/layout.tsx

import ClientAuthGuard from "@/components/global/ClientAuthGuard";
import AdminSidebar from "@/components/global/sidebar";
import "../globals.css";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 p-4 xl:ml-64">
        <ClientAuthGuard>
        {children}
        </ClientAuthGuard>
      </main>
    </div>
  );
}
