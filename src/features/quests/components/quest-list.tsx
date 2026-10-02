import { Quest } from '@/features/quests/types';

interface QuestListProps {
  quests: Quest[];
}

export default function QuestList({ quests }: QuestListProps) {
  return (
    <ul>
      {quests.map((quest) => (
        <li key={quest.id}>{quest.title}</li>
      ))}
    </ul>
  );
}
