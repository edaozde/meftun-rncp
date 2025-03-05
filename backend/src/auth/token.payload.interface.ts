export interface TokenPayload {
  userId: number;
  role: string; // Ajout du rôle pour différencier Admin / User
}
