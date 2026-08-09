import { User } from "@supabase/supabase-js";

export function getUserRole(user: User | null): string {
  if (!user) return "anon";
  const role =
    user.app_metadata?.role ||
    user.user_metadata?.role ||
    user.role ||
    (user.app_metadata?.is_admin || user.user_metadata?.is_admin ? "admin" : "user");
  return String(role);
}

export function isAdminUser(user: User | null): boolean {
  if (!user) return false;
  const role = getUserRole(user);
  const isAdminFlag =
    user.app_metadata?.is_admin === true ||
    user.user_metadata?.is_admin === true ||
    user.app_metadata?.isAdmin === true ||
    user.user_metadata?.isAdmin === true;

  return role === "admin" || isAdminFlag;
}
