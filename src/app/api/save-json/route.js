// src/app/api/save-json/route.js
//
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/save-json
//
// A single generic API route that any screen in the project can call.
// The caller tells it WHICH file to update and WHAT rows changed.
// The route never hard-codes a file path — everything comes from the body.
//
// REQUEST BODY (JSON)
// {
//   "filePath"   : "src/data/InventoryData.json",   // relative to project root
//   "updatedRows": [ { "id": 3, "reorderLevel": 50, ... }, ... ],
//   "idField"    : "id"                             // optional, default "id"
// }
//
// RESPONSE (JSON)
// Success:  { "success": true,  "updated": 5, "skipped": 0, "total": 1000 }
// Failure:  { "success": false, "error": "<message>" }
//
// SECURITY NOTE
//   The filePath is resolved with path.join(process.cwd(), filePath) and then
//   checked to ensure it stays inside the project root (path traversal guard).
//   This route should NOT be exposed on a public production server without
//   additional auth middleware — it is intended for local dev / internal tools.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import path from "path";
import { updateJsonFile } from "../../../components/JsonFileUpdater/UpdateJsonFile";

export async function POST(request) {
    // ── Parse body ────────────────────────────────────────────────────────
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, error: "Request body is not valid JSON." },
            { status: 400 }
        );
    }

    const { filePath, updatedRows, idField = "id" } = body;

    // ── Validate required fields ─────────────────────────────────────────
    if (!filePath || typeof filePath !== "string") {
        return NextResponse.json(
            { success: false, error: "`filePath` is required and must be a string." },
            { status: 400 }
        );
    }

    if (!Array.isArray(updatedRows) || updatedRows.length === 0) {
        return NextResponse.json(
            { success: false, error: "`updatedRows` must be a non-empty array." },
            { status: 400 }
        );
    }

    // ── Path traversal guard ─────────────────────────────────────────────
    // Resolve against project root and make sure the resolved path is still
    // inside the project.  Prevents e.g. filePath = "../../etc/passwd".
    const projectRoot = process.cwd();
    const absPath = path.resolve(projectRoot, filePath);

    if (!absPath.startsWith(projectRoot)) {
        return NextResponse.json(
            { success: false, error: "filePath must be inside the project directory." },
            { status: 403 }
        );
    }

    // ── Delegate to utility ──────────────────────────────────────────────
    try {
        const result = await updateJsonFile(absPath, updatedRows, idField);
        return NextResponse.json({ success: true, ...result });
    } catch (err) {
        console.error("[save-json]", err.message);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}