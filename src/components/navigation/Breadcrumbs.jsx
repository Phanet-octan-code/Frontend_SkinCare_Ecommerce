import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

/**
 * Reusable Breadcrumbs Component
 * @param {Array<{ label: string, link?: string }>} items
 */
export default function Breadcrumbs({ items = [], className = '' }) {
  const { t } = useTranslation();
  if (!items.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`breadcrumbs ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '0.84rem',
        color: 'var(--color-text-muted)',
        marginBottom: '24px',
      }}
    >
      <Link
        to="/"
        style={{
          color: 'var(--color-text-secondary)',
          transition: 'color var(--transition-fast)',
        }}
      >
        {t('common.home')}
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight size={13} style={{ color: 'var(--color-border-hover)' }} />
            {isLast || !item.link ? (
              <span
                style={{
                  color: 'var(--color-text-main)',
                  fontWeight: 600,
                  maxWidth: '300px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.link}
                style={{
                  color: 'var(--color-text-secondary)',
                  transition: 'color var(--transition-fast)',
                }}
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
