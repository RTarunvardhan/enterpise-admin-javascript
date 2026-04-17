/**
 * FILE: sorting.js
 * PURPOSE: Pure utility functions for table column sorting.
 *
 * No visual / layout changes in this file – the logic is identical to
 * the original. Comments have been expanded for clarity.
 *
 * EXPORTED FUNCTIONS
 * ──────────────────
 * getComparator      – Returns a comparator function for a given column + direction.
 * stableSort         – Sorts an array while preserving original index order for equal elements.
 * handleRequestSort  – State-updater called when a column header is clicked.
 */

/* ─────────────────────────────────────────────────────────────────────────────
   1.  getComparator
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * getComparator
 * ─────────────
 * Builds and returns a comparator function used by stableSort.
 *
 * Handles three special cases before doing a standard value comparison:
 *   • NULL / undefined / empty string / "NULL"  → treated as null
 *   • Numeric strings (e.g. "42.5")              → coerced to float for numeric sort
 *   • Everything else                             → lowercased string comparison
 *
 * NULL placement rule (mirrors Excel-like behaviour):
 *   • Ascending  (asc)  → nulls sorted to the END   of the list
 *   • Descending (desc) → nulls sorted to the START of the list
 *
 * param {"asc"|"desc"} order   – Sort direction.
 * param {string}       orderBy – The row-object key to sort by.
 * returns {(a: object, b: object) => number}
 */
export function getComparator(order, orderBy) {
    return (a, b) => {
      /**
       * normalize
       * ─────────
       * Converts a raw cell value into a comparable primitive.
       * Returns `null` for any "empty" value so the NULL-placement
       * logic below can handle it uniformly.
       *
       * param {*} val – Raw value from a row object.
       * returns {number|string|null}
       */
      const normalize = (val) => {
        // Treat all "empty" representations as null
        if (val === null || val === undefined || val === "" || val === "NULL")
          return null;
        // Coerce numeric strings to float for proper numeric ordering
        return !isNaN(val) ? parseFloat(val) : String(val).toLowerCase();
      };
  
      const aValue = normalize(a[orderBy]);
      const bValue = normalize(b[orderBy]);
  
      /* ── NULL placement ─────────────────────────────────────────────────── */
      if (aValue === null || bValue === null) {
        if (aValue === null && bValue === null) return 0; // both null → equal
        return order === "asc"
          ? aValue === null ? 1 : -1   // nulls last  in ascending
          : aValue === null ? -1 : 1;  // nulls first in descending
      }
  
      /* ── Standard comparison ────────────────────────────────────────────── */
      if (aValue < bValue) return order === "desc" ? 1 : -1;
      if (aValue > bValue) return order === "desc" ? -1 : 1;
      return 0; // equal
    };
  }
  
  /* ─────────────────────────────────────────────────────────────────────────────
     2.  stableSort
     ─────────────────────────────────────────────────────────────────────────── */
  
  /**
   * stableSort
   * ──────────
   * Sorts `array` using the provided `comparator` while guaranteeing
   * a STABLE result – elements that compare as equal retain their original
   * relative order (important for predictable UI behaviour when re-sorting).
   *
   * Implementation:
   *   1. Map each element to a [element, originalIndex] tuple.
   *   2. Sort tuples: primary key = comparator result, secondary key = originalIndex.
   *   3. Map tuples back to plain elements.
   *
   * param {Array}    array      – The dataset to sort (not mutated).
   * param {Function} comparator – Comparator produced by getComparator().
   * returns {Array} A new sorted array.
   */
  export function stableSort(array, comparator) {
    return array
      .map((el, index) => [el, index])          // attach original index
      .sort((a, b) => {
        const order = comparator(a[0], b[0]);
        // Fall back to original index to ensure stability
        return order !== 0 ? order : a[1] - b[1];
      })
      .map((el) => el[0]);                       // strip the index back off
  }
  
  /* ─────────────────────────────────────────────────────────────────────────────
     3.  handleRequestSort
     ─────────────────────────────────────────────────────────────────────────── */
  
  /**
   * handleRequestSort
   * ─────────────────
   * Called by the column header's sort-label `onClick`.
   * Toggles direction (asc → desc → asc …) when the same column is clicked again;
   * resets to "asc" when a different column is selected.
   *
   * param {Event}    event    – The click event (unused, kept for API consistency).
   * param {object}   property – The column definition object; must have an `id` field.
   * param {Function} setOrder   – React state setter for sort direction.
   * param {Function} setOrderBy – React state setter for sorted column key.
   * param {"asc"|"desc"} order  – Current sort direction.
   * param {string}   orderBy    – Currently sorted column key.
   */
//   export const handleRequestSort = (
//     event,
//     property,
//     setOrder,
//     setOrderBy,
//     order,
//     orderBy
//   ) => {
//     // If the same column is clicked again, flip direction; otherwise default to "asc"
//     setOrder((prevOrder) =>
//       orderBy === property?.id && prevOrder === "asc" ? "desc" : "asc"
//     );
//     // Update the active sort column
//     setOrderBy(property?.id);
//   };