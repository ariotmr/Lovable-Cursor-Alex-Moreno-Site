import { AdminLayout } from "@/components/AdminLayout";
import { Link } from "react-router-dom";
import { BookingManager } from "@/components/admin/BookingManager";

export default function Bookings() {
  const breadcrumbs = (
    <>
      <Link to="/admin" className="text-muted-foreground hover:text-foreground">Admin</Link>
      <span>/</span>
      <span className="text-foreground font-medium">Bookings</span>
    </>
  );

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto animate-in fade-in-50">
        <BookingManager />
      </div>
    </AdminLayout>
  );
}
