"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Download } from "lucide-react"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Invoice } from "@/app/api/stripe/invoices/route"

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as Date
      return <div>{format(date, "PPP")}</div>
    },
  },
  {
    accessorKey: "paid",
    header: "Status",
    cell: ({ row }) => {
      const paid = row.getValue("paid") as boolean

      return (
        <Badge className  ={cn(paid ? "bg-green-100 hover:bg-green-200 text-green-700" : "bg-white hover:bg-neutral-100 text-neutral-700", "font-normal border-none")}>
          {paid ? "Paid" : "Pending"}
        </Badge>
      )
    },

  }, 
  {
    accessorKey: "amount_paid",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount_paid"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original
      const url = invoice.url
      return (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log(`Downloading invoice ${invoice.invoiceNumber}`)
              // Implement actual download functionality here
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
          >
            <Download className="h-4 w-4" />
            Invoice
          </Button>
        </div>
      )
    },
  },
]

