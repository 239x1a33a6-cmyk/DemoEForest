"use client";
import React, { useEffect, useState } from "react";
import { fetchAllApplications, updateApplicationStatus } from "@/lib/applications";
import { getCurrentUser } from "@/lib/auth";

// Simple admin UID allowlist for demo purposes. Replace with proper admin checks.
const ALLOWED_ADMIN_UIDS: string[] = [
  // add admin uids here or implement better admin detection via custom claims
];

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApps();
  }, []);

  async function loadApps() {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAllApplications();
      setApps(list || []);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id: string, status: string) {
    setLoading(true);
    setError(null);
    try {
      await updateApplicationStatus(id, status);
      await loadApps();
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  const user = getCurrentUser();
  if (!user) return <div className="p-4">Please log in to view admin panel.</div>;
  if (ALLOWED_ADMIN_UIDS.length && !ALLOWED_ADMIN_UIDS.includes(user.uid)) {
    return <div className="p-4">You are not authorized to view this page.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Applications (Admin)</h1>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      {loading && <div>Loading...</div>}

      <div className="overflow-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Scheme</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-2">{a.id}</td>
                <td className="px-4 py-2">{a.schemeName || a.scheme || "-"}</td>
                <td className="px-4 py-2">{a.userId}</td>
                <td className="px-4 py-2">{a.status}</td>
                <td className="px-4 py-2">
                  <button
                    className="mr-2 px-3 py-1 bg-green-600 text-white rounded"
                    onClick={() => handleUpdate(a.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="mr-2 px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => handleUpdate(a.id, "rejected")}
                  >
                    Reject
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-500 text-white rounded"
                    onClick={() => handleUpdate(a.id, "pending")}
                  >
                    Reset
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
