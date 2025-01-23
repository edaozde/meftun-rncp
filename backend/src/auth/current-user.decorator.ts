import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const getCurrentUserByContext = (context: ExecutionContext) => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
//décoratateur pour récupérer user courant
//getCurrentUserByContext : Cette fonction récupère l'utilisateur actuellement authentifié à partir de la requête en accédant à context.switchToHttp().getRequest().user
//accéder à l'utilisateur actuellement authentifié à partir du contexte d'une requête HTTP
//Ici, le décorateur @CurrentUser() injecte automatiquement l'utilisateur authentifié dans la méthode du contrôleur, vous permettant de l'utiliser sans avoir à écrire du code redondant.
