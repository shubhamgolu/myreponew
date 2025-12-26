"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { TrashIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInvoiceTableData, deleteInvoice } from "./fetch";
import { DownloadIcon, PreviewIcon } from "./icons";

/* ------------------------------- TYPES ------------------------------- */
interface InvoiceItem {
  id: string;
  webtitle: string;
  subdomain: string;
  date: string;
  status: "Paid" | "Unpaid" | "Pending";


  admin_username: string;
  admin_password: string;
  admin_email: string;
  siteUrl: string;
}

/* ----------------------- SKELETON ROW (EXISTING) ---------------------- */
function InvoiceSkeletonRow() {
  const base =
    "h-4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-dark-3 dark:via-dark-2 dark:to-dark-3 animate-wave";

  return (
    <TableRow>
      <TableCell><div className={`${base} w-6`} /></TableCell>
      <TableCell><div className={`${base} w-40`} /></TableCell>
      <TableCell><div className={`${base} w-28`} /></TableCell>
      <TableCell><div className={`${base} w-28 h-6 rounded-full`} /></TableCell>
      <TableCell>
        <div className="flex justify-end gap-3">
          <div className={`${base} w-5 h-5`} />
          <div className={`${base} w-5 h-5`} />
          <div className={`${base} w-5 h-5`} />
        </div>
      </TableCell>
    </TableRow>
  );
}

/* ----------------------------- COMPONENT ----------------------------- */
export function InvoiceTable() {
  const [data, setData] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<InvoiceItem | null>(null);

  /* Pagination */
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  /* ---------------------------- LOAD DATA ---------------------------- */
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getInvoiceTableData();
        setData(Array.isArray(res) ? res : res?.sites ?? []);
      } catch (e) {
        console.error(e);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ----------------------------- DELETE ------------------------------ */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return;

    try {
      setDeletingId(id);
      await deleteInvoice(id);
      setData((prev) => prev.filter((row) => row.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  /* --------------------------- PAGINATION ---------------------------- */
  const totalPages = Math.ceil(data.length / PAGE_SIZE);                                                                       
  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  /* ----------------------------- ESC CLOSE --------------------------- */
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewItem(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);
   
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F7F9FC] dark:bg-dark-2">
            <TableHead className="min-w-[80px]">Sr. No</TableHead>
            <TableHead className="min-w-[200px]">Website Title</TableHead>
            <TableHead className="min-w-[155px]">Date</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
                                                                      
        <TableBody>
          {/* 🔹 Loading skeleton */}
          {loading ? (
            [...Array(PAGE_SIZE)].map((_, i) => (
              <InvoiceSkeletonRow key={i} />
            ))
          ) : paginatedData.length ? (
            paginatedData.map((item, index) =>
              deletingId === item.id ? (
                <InvoiceSkeletonRow key={item.id} />
              ) : (
                <TableRow key={item.id}>
                  <TableCell>
                    {(page - 1) * PAGE_SIZE + index + 1}
                  </TableCell>

                  <TableCell className="font-medium text-dark dark:text-white">
                    {item.webtitle}
                  </TableCell>

                  <TableCell>
                    {dayjs(item.date).format("MMM DD, YYYY")}
                  </TableCell>

                  <TableCell>
                    <span className="rounded-full bg-gray-100 px-3.5 py-1 text-sm dark:bg-dark-3">
                      {item.subdomain}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-x-3.5">
                      {/* 👁 Preview */}
                      <button
                        title="Preview"
                        onClick={() => setPreviewItem(item)}
                      >
                        <PreviewIcon />
                      </button>

                      {/* 🗑 Delete */}
                      <button
                        disabled={deletingId === item.id}
                        onClick={() => handleDelete(item.id)}
                        className="disabled:opacity-50"
                      >

                        <TrashIcon />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            )
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="py-6 text-center">
                No invoices found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
        
      {/* 🔹 Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
                 
      {/* ---------------- PREVIEW MODAL ---------------- */}
      {previewItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Site Admin Details
        </h3>
        <button
          onClick={() => setPreviewItem(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-gray-500">Username</p>
          <p className="font-medium">{previewItem.admin_username}</p>
        </div>

        <div>
          <p className="text-gray-500">Password</p>
          <p className="font-medium">{previewItem.admin_password}</p>
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{previewItem.admin_email}</p>
        </div>

        <div>
          <p className="text-gray-500">Site URL</p>
          <a
            href={previewItem.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline"
          >
            {previewItem.siteUrl}
          </a>
        </div>
      </div>
       
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setPreviewItem(null)}
          className="rounded border px-4 py-1.5 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
          
    </div>
  );
}
