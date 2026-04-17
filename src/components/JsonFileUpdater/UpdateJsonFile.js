// src/utils/updateJsonFile.js
//
// ─────────────────────────────────────────────────────────────────────────────
// updateJsonFile  — Next.js API-route helper
//
// PURPOSE
//   Merges an array of changed records into a local JSON file using the
//   record's `id` field as the unique key.  Only the fields that are present
//   in each incoming record are overwritten — all other fields on the stored
//   record are preserved.
//
// HOW IT WORKS
//   1. Read the JSON file from disk.
//   2. Build a Map keyed by `id` from the stored array.
//   3. For every record in `updatedRows`, find its matching stored record by
//      `id` and shallow-merge the changed fields onto it.
//      Records whose `id` is not found in the file are ignored (no phantom inserts).
//   4. Write the merged array back to the same file (pretty-printed, 2-space indent).
//   5. Return a result object — the caller (API route) decides the HTTP response.
//
// PARAMETERS
//   filePath    {string}   Absolute path to the JSON file.
//               Use path.join(process.cwd(), "src/data/InventoryData.json")
//               in the API route — never hard-code __dirname here so the
//               helper stays portable.
//
//   updatedRows {Array}    The rows that were edited on the screen.
//               Must be plain objects. Each object MUST contain an `id` field.
//               Only the keys present in each object are merged; missing keys
//               in the payload are NOT deleted from the stored record.
//
//   idField     {string}   Optional. The name of the unique-key field.
//               Defaults to "id". Change to e.g. "productId" if your JSON
//               uses a different primary key name.
//
// RETURN VALUE  { updated: number, skipped: number, total: number }
//   updated  — how many records were actually changed on disk
//   skipped  — rows in updatedRows whose id was not found in the file
//   total    — total records now in the file
//
// USAGE (inside a Next.js API route, e.g. src/app/api/save-json/route.js)
//
//   import { updateJsonFile } from "@/utils/updateJsonFile";
//   import path from "path";
//
//   export async function POST(request) {
//     const { filePath, updatedRows, idField } = await request.json();
//     const absPath = path.join(process.cwd(), filePath);   // "src/data/InventoryData.json"
//     const result  = await updateJsonFile(absPath, updatedRows, idField);
//     return Response.json({ success: true, ...result });
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

import fs from "fs/promises";
import path from "path";

/**
 * @param {string} filePath    - Absolute path to the JSON file on disk.
 * @param {Array}  updatedRows - Records to merge in.  Each must have an `idField` key.
 * @param {string} [idField]   - Primary-key field name (default: "id").
 * @returns {Promise<{ updated: number, skipped: number, total: number }>}
 */
export async function updateJsonFile(filePath, updatedRows, idField = "id") {
    // ── 1. Validate inputs ──────────────────────────────────────────────────
    if (!filePath || typeof filePath !== "string") {
        throw new Error("updateJsonFile: `filePath` must be a non-empty string.");
    }
    if (!Array.isArray(updatedRows) || updatedRows.length === 0) {
        throw new Error("updateJsonFile: `updatedRows` must be a non-empty array.");
    }

    // ── 2. Read current file ────────────────────────────────────────────────
    let raw;
    try {
        raw = await fs.readFile(filePath, "utf-8");
    } catch (err) {
        throw new Error(`updateJsonFile: Cannot read file at "${filePath}". ${err.message}`);
    }

    let storedArray;
    try {
        storedArray = JSON.parse(raw);
    } catch (err) {
        throw new Error(`updateJsonFile: File at "${filePath}" is not valid JSON. ${err.message}`);
    }

    if (!Array.isArray(storedArray)) {
        throw new Error(
            `updateJsonFile: Expected the JSON file to contain an Array at the root level.`
        );
    }

    // ── 3. Build lookup map by idField ─────────────────────────────────────
    // Map<id, index> so we can mutate storedArray in-place by index.
    const indexById = new Map();
    storedArray.forEach((record, i) => {
        const key = record[idField];
        if (key !== undefined && key !== null) {
            indexById.set(String(key), i);
        }
    });

    // ── 4. Merge each incoming row ──────────────────────────────────────────
    let updated = 0;
    let skipped = 0;

    for (const incomingRow of updatedRows) {
        const incomingId = incomingRow[idField];

        if (incomingId === undefined || incomingId === null) {
            // Row has no id — cannot match, skip silently
            skipped++;
            continue;
        }

        const idx = indexById.get(String(incomingId));

        if (idx === undefined) {
            // id not found in the stored file — skip (no phantom inserts)
            skipped++;
            continue;
        }

        // Shallow-merge: only the keys present in incomingRow are overwritten.
        // Keys not present in incomingRow are left untouched on the stored record.
        storedArray[idx] = {
            ...storedArray[idx],  // keep all original fields
            ...incomingRow,       // overwrite only the changed fields
        };

        updated++;
    }

    // ── 5. Write back ───────────────────────────────────────────────────────
    // Only write if something actually changed — avoids unnecessary disk I/O
    // and filesystem watcher triggers.
    if (updated > 0) {
        const output = JSON.stringify(storedArray, null, 2);
        await fs.writeFile(filePath, output, "utf-8");
    }

    return {
        updated,
        skipped,
        total: storedArray.length,
    };
}