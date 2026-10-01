// =============================================================================
// Les types de la feature « auth » · traduction du contrat (séance 1, TP2)
// =============================================================================

export type Role = 'MEMBER' | 'GUILD_MASTER';

// Le badge, tel que le livre des badges le décrit.
export interface Badge {
  code: string;
  name: string;
  description: string;
  icon: string;
  automatic: boolean;
}

// Un badge décerné : le badge, plus sa date d'attribution.
export interface AwardedBadge extends Badge {
  awardedAt: string;
}

// Ce que tout le monde voit d'un aventurier.
export interface PublicAdventurer {
  id: string;
  username: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  // Une string libre : le contrat ne liste pas les titres, il dit
  // seulement qu'ils s'affichent en français. On ne type pas plus fort
  // que ce que le serveur promet.
  honoraryTitle: string;
  badges: AwardedBadge[];
  validatedQuestsCount: number;
  memberSince: string;
}

// Le profil complet, visible uniquement par son propriétaire (GET /me).
export interface PrivateAdventurer extends PublicAdventurer {
  email: string;
  // Le solde disponible : les séquestres sont déjà déduits, côté serveur.
  helpPoints: number;
  role: Role;
}

export const ROLE_LABELS: Record<Role, string> = {
  MEMBER: 'Membre',
  GUILD_MASTER: 'Maître de guilde',
};
