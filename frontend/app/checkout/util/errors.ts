// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (response: any) => {
  // Vérifie si la réponse contient un message d'erreur
  if (response.message) {
    // Si le message est un tableau, on récupère le premier élément
    if (Array.isArray(response.message)) {
      return formatErrorMessage(response.message[0]);
    }
    // Si le message est une chaîne de caractères, on le formate directement
    return formatErrorMessage(response.message);
  }
  // Si aucun message d'erreur n'est fourni, retourne un message d'erreur générique
  return "Unknown error occured.";
};

// Fonction utilitaire pour formater le message d'erreur avec une majuscule initiale
const formatErrorMessage = (message: string) => {
  return message.charAt(0).toUpperCase() + message.slice(1);
};
