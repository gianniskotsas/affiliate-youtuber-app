import { columns } from "./invoice-columns";
import { DataTable } from "./invoice-data-table";
import { Invoice } from "@/app/api/stripe/invoices/route";
import { useEffect, useState } from "react";

export default function InvoicesPage({ userId }: { userId: string }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  useEffect(() => {
    if (!userId) return;

    setLoadingInvoices(true);
    fetch("/api/stripe/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.invoices) {
          setInvoices(data.invoices);
        } else {
          console.error("Failed to fetch invoices");
        }
      })
      .catch((err) => console.error("Error fetching invoices:", err))
      .finally(() => setLoadingInvoices(false));
  }, [userId]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-xl font-semibold mb-4">Invoices</h1>
      <DataTable columns={columns} data={invoices} />
    </div>
  );
}
