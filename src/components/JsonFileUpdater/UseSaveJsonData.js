// src/hooks/useSaveJsonData.js
//
// ─────────────────────────────────────────────────────────────────────────────
// useSaveJsonData — reusable React hook for saving edits back to a local JSON
//
// WHAT IT DOES
//   Sends the edited table rows to POST /api/save-json, which writes the
//   changes directly into the JSON file on disk.  The hook:
//     • Tracks loading / success / error state
//     • Returns a `save` function you call from any onSubmit handler
//     • Is completely screen-agnostic — you pass the file path and rows
//
// PARAMETERS  (passed to the returned `save` function)
//   filePath    {string}  e.g. "src/data/InventoryData.json"
//               Relative to the project root.
//
//   tableData   {Array}   The FULL current table state from your screen
//               (including edits the user made in the table cells).
//               The hook will compare this against `originalData` and only
//               send rows that actually changed.
//
//   originalData {Array}  The original data loaded from the JSON file.
//               Used to compute which rows are "dirty" (changed).
//
//   idField     {string}  Optional. The primary-key field name. Default "id".
//
// RETURN VALUE  { save, saving, result, error, dirtyCount }
//   save        — async function(filePath, tableData, originalData, idField?)
//   saving      — boolean  (true while the fetch is in-flight)
//   result      — last API response object { updated, skipped, total } or null
//   error       — last error message string or null
//   dirtyCount  — number of rows that differ from originalData (updated live)
//
// USAGE (inside your page.js)
//
//   import { useSaveJsonData } from "@/hooks/useSaveJsonData";
//
//   const { save, saving, result, error } = useSaveJsonData();
//
//   const handleSubmit = () => {
//     save(
//       "src/data/InventoryData.json",
//       tableData,          // current state from your CustomTable
//       InventoryData,      // the original import
//       "id"                // idField
//     );
//   };
//
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useCallback, useMemo } from "react";

// ── Internal: shallow-diff two records ────────────────────────────────────────
// Returns true if any field value differs between `original` and `current`.
function isRowDirty(original, current, idField) {
    if (!original) return true; // new row — always dirty

    const allKeys = new Set([...Object.keys(original), ...Object.keys(current)]);

    for (const key of allKeys) {
        if (key === idField) continue; // skip the id itself

        // Loose equality is intentional: JSON numbers vs. edited string "42"
        // eslint-disable-next-line eqeqeq
        if (original[key] != current[key]) return true;
    }

    return false;
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useSaveJsonData() {
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState(null);   // { updated, skipped, total }
    const [error, setError] = useState(null);

    /**
     * save
     * ─────
     * Computes the dirty rows (changed vs. originalData), then POSTs them to
     * /api/save-json.  If nothing changed it resolves immediately without an
     * HTTP call.
     *
     * @param {string} filePath
     * @param {Array}  tableData     - current full table state
     * @param {Array}  originalData  - the data as loaded from JSON (no SR_NO)
     * @param {string} [idField]     - primary key field name, default "id"
     * @returns {Promise<{ updated, skipped, total } | null>}
     */
    const save = useCallback(async (
        filePath,
        tableData,
        originalData,
        idField = "id"
    ) => {
        setError(null);
        setResult(null);

        // ── Strip SR_NO (added by serializedata) before comparing ──────────
        const cleanRows = tableData.map(({ SR_NO, ...rest }) => rest);

        // ── Build originalData lookup by idField ───────────────────────────
        const originalMap = new Map(
            originalData.map((row) => [String(row[idField]), row])
        );

        // ── Find only the rows that actually changed ───────────────────────
        const dirtyRows = cleanRows.filter((row) => {
            const original = originalMap.get(String(row[idField]));
            return isRowDirty(original, row, idField);
        });

        if (dirtyRows.length === 0) {
            // Nothing changed — resolve immediately, no network call
            const noOp = { updated: 0, skipped: 0, total: tableData.length };
            setResult(noOp);
            return noOp;
        }

        // ── POST to API route ──────────────────────────────────────────────
        setSaving(true);

        try {
            const response = await fetch("/api/save-json", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filePath, updatedRows: dirtyRows, idField }),
            });

            const json = await response.json();

            if (!response.ok || !json.success) {
                throw new Error(json.error || `HTTP ${response.status}`);
            }

            setResult(json);
            return json;
        } catch (err) {
            const msg = err.message || "Unknown error saving data.";
            setError(msg);
            console.error("[useSaveJsonData]", msg);
            return null;
        } finally {
            setSaving(false);
        }
    }, []);

    return { save, saving, result, error };
}