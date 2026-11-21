/** True when this user is the configured fantasy price admin. */
export function canEditFantasyPrices(userId: string, priceAdminId: string): boolean {
  return userId === priceAdminId;
}
