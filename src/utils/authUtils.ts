export function getProjectPermissions(ownerId: string, user_id: string) {
  if (user_id === ownerId) return true;
  return false;
}
