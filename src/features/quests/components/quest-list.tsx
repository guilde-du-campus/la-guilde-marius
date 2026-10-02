import { Quest } from '@/features/quests/types';
import { QuestCard } from './quest-card';
import styles from '../styles/quest-card-list.module.css';

interface QuestListProps {
  quests: Quest[];
}

export default function QuestList({ quests }: QuestListProps) {
  return (
    <div className={styles.grid}>
      {quests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </div>
  );
}
