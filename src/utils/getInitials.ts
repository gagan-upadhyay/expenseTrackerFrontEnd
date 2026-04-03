// utils/getInitials.ts
export function getInitials(first = "", last = "") {
  return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
}