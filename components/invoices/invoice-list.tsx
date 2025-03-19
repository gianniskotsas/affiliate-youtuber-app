import { columns } from "./invoice-columns";
import { DataTable } from "./invoice-data-table";

export default function InvoicesPage({ invoices }: { invoices: any[] }) {
 
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-xl font-semibold mb-4">Invoices</h1>
      <DataTable columns={columns} data={invoices} />
    </div>
  );
}
