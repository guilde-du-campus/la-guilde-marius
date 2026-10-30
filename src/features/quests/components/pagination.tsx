import Link from 'next/link';
import styles from '@/features/quests/styles/pagination.module.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  params: URLSearchParams;
}

function pageHref(params: URLSearchParams, page: number): string {
  const next = new URLSearchParams(params);
  if (page <= 1) {
    next.delete('page');
  } else {
    next.set('page', String(page));
  }
  const qs = next.toString();
  return qs ? `/?${qs}` : '/';
}

export function Pagination({ page, totalPages, params }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Pagination du tableau" className={styles.pagination}>
      {page > 1 ? (
        <Link href={pageHref(params, page - 1)} className={styles.link}>
          ← Précedent
        </Link>
      ) : (
        <span aria-hidden="true" className={styles.disabled}>
          {' '}
          ← Précedent
        </span>
      )}

      <span className={styles.counter}>
        page {page} sur {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={pageHref(params, page + 1)} className={styles.link}>
          Suivant →
        </Link>
      ) : (
        <span aria-hidden="true" className={styles.disabled}>
          Suivant →
        </span>
      )}
    </nav>
  );
}
