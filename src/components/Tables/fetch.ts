import * as logos from "@/assets/logos";

export async function deleteInvoice(id: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await fetch(`${BASE_URL}/api/table/site-table?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AISAAS_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Delete failed");
    }

    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}
   
export async function getInvoiceTableData() {
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  // Fake delay
   const res = await fetch(`${BASE_URL}/api/table/site-table`, {
    cache: "no-store", // always fresh d
    // ata
  });

  if (!res) {
    throw new Error("Failed to fetch invoices");
  }
   console.log(res)
  return res.json();
}
