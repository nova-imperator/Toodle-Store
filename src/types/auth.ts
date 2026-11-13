/** Returned by both login methods so the login screen can greet the shopper. */
export interface LoginResult {
  name: string | null;
  isNew: boolean;
}
