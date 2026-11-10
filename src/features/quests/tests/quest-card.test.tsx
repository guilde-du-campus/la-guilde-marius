// =============================================================================
// Les tests de QuestCard · TD5 de la séance 4
// -----------------------------------------------------------------------------
// On interroge par rôle et par libellé, comme un utilisateur : jamais par
// classe CSS ni état interne. Le critère : ces tests survivent à un
// refactor du composant, et échouent si un libellé ment.
// =============================================================================
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { QuestCard } from '../components/quest-card';
import type { Quest } from '../types';
// La quête d'exemple : choisie, parlante : les mêmes données que les stories.
const openQuest: Quest = {
  id: 'q-1',
  title: 'SOS régression CSS avant la démo de vendredi',
  description: 'Ma grille se casse en dessous de 768 px et je présente vendredi.',
  type: 'HELP',
  category: 'DEV',
  status: 'OPEN',
  reward: 30,
  photoUrl: null,
  author: { id: 'a-1', username: 'Perceval_404', avatarUrl: null, level: 2 },
  taker: null,
  createdAt: '2026-10-01T09:00:00.000Z',
  takenAt: null,
  completedAt: null,
  validatedAt: null,
};

describe('QuestCard', () => {
  test("la carte d'une quête ouverte affiche son titre et ses libellés français", () => {
    render(<QuestCard quest={openQuest} />);
    // Le titre est un heading : si ça cesse d'être vrai, l'accessibilité
    // a régressé et le test le dit : deux exigences, un seul filet.
    expect(screen.getByRole('heading', { name: /SOS régression CSS/ })).toBeInTheDocument();
    // Ce que VOIT l'utilisateur : le libellé français, pas la valeur OPEN
    // de l'enum. Tester l'enum serait tester l'implémentation.
    expect(screen.getByText('Ouverte')).toBeInTheDocument();
    expect(screen.getByText('Entraide')).toBeInTheDocument(); // Aide
    expect(screen.getByText('Dev')).toBeInTheDocument();
  });
  test("la carte d'une quête prise affiche le pseudo du preneur", () => {
    // L'état se force par dérivation : pas de base, pas d'API : une copie.
    const taken: Quest = {
      ...openQuest,
      status: 'IN_PROGRESS',
      taker: { id: 'a-2', username: 'Morgane_la_Merge', avatarUrl: null, level: 5 },
      takenAt: '2026-10-01T10:00:00.000Z',
    };
    render(<QuestCard quest={taken} />);
    expect(screen.getByText('En cours')).toBeInTheDocument();
    expect(screen.getByText(/prise par Morgane_la_Merge/)).toBeInTheDocument();
  });
  test("une quête sans récompense n'affiche pas de points", () => {
    render(<QuestCard quest={{ ...openQuest, reward: 0 }} />);
    // L'absence se teste avec queryBy : getBy lèverait avant l'assertion.
    expect(screen.queryByText(/pts/)).not.toBeInTheDocument();
  });
});
