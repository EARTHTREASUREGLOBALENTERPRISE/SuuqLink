export { getCurrentUser } from "./session";
import { getVendorById } from "./serialize";

export async function getVendorOrFallback(id: number) {
  return (await getVendorById(id)) ?? null;
}
