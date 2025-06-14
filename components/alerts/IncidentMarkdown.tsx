import { Alert } from '@/components/ui/Alert';
import type { Incident } from '@/types/monitor';
import { useFormatter, useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import { dateStringToTimestamp, extractSentence } from '../utils/format';

// Workaround for https://github.com/markdown-it/markdown-it/issues/1082
const MarkdownIt = require('markdown-it');
const md = MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
  listIndent: true,
});

function IncidentMarkdownAlert({ incident }: { incident: Incident }) {
  const t = useTranslations('alert');
  const format = useFormatter();
  const now = Date.now();

  let { style, title, content, createdDate, lastUpdatedDate } = incident;

  createdDate = createdDate ? `${createdDate} +00:00` : '';
  lastUpdatedDate = lastUpdatedDate ? `${lastUpdatedDate} +00:00` : '';

  const alertColor = useMemo(() => {
    switch (style) {
      case 'info':
        return 'primary';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'danger';
      case 'light':
        return 'default';
      case 'dark':
        return 'secondary';
      default:
        return 'primary';
    }
  }, [style]);

  const htmlContent = useMemo(() => {
    return md.render(content);
  }, [content]);

  return (
    <Alert
      title={title}
      description={extractSentence(content)}
      color={alertColor}
      variant="flat"
      className="mb-8"
    >
      <div
        className="prose prose-sm dark:prose-invert w-full [&>:first-child]:mt-0 [&>:last-child]:mb-0
          prose-p:text-gray-600 dark:prose-p:text-gray-300
          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-3
          prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
          prose-li:text-gray-600 dark:prose-li:text-gray-300
          prose-headings:text-gray-800 dark:prose-headings:text-gray-100
          prose-code:text-gray-800 dark:prose-code:text-gray-100
          prose-code:font-mono prose-code:text-sm"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 相信 markdown-it 的安全性
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <div className="flex flex-col items-end gap-1 mt-4">
        {lastUpdatedDate && (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {t('updatedAt', {
              time: format.relativeTime(dateStringToTimestamp(lastUpdatedDate), now),
            })}
          </span>
        )}
        <span className="text-sm text-gray-400 dark:text-gray-500">
          {t('createdAt', {
            time: format.dateTime(dateStringToTimestamp(createdDate), 'normal'),
          })}
        </span>
      </div>
    </Alert>
  );
}

export default IncidentMarkdownAlert;
