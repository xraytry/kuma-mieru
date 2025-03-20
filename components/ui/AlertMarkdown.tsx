import React, { useMemo } from 'react';
import {
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Bell,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import type { Incident } from '@/types/monitor';
import { timeAgo } from '../utils/format';

// Workaround for https://github.com/markdown-it/markdown-it/issues/1082
const MarkdownIt = require('markdown-it');
const md = MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
  listIndent: true,
});

function IncidentAlert({ incident }: { incident: Incident }) {
  let { style, title, content, createdDate, lastUpdatedDate } = incident;

  createdDate = createdDate ? `${createdDate} +00:00` : '';
  lastUpdatedDate = lastUpdatedDate ? `${lastUpdatedDate} +00:00` : '';

  if (window.location.hostname === 'localhost') {
    console.log('incident', incident);
  }

  const Icon = useMemo(() => {
    switch (style) {
      case 'warning':
        return AlertOctagon;
      case 'danger':
        return ShieldAlert;
      case 'success':
        return ShieldCheck;
      case 'info':
        return Bell;
      default:
        return Info;
    }
  }, [style]);

  const colorClasses = useMemo(() => {
    switch (style) {
      case 'warning':
        return {
          border: 'border-yellow-200 dark:border-yellow-800/30',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          text: 'text-yellow-600 dark:text-yellow-400',
          icon: 'text-yellow-500 dark:text-yellow-400',
        };
      case 'danger':
        return {
          border: 'border-red-200 dark:border-red-800/30',
          bg: 'bg-red-50 dark:bg-red-900/20',
          text: 'text-red-600 dark:text-red-400',
          icon: 'text-red-500 dark:text-red-400',
        };
      case 'success':
        return {
          border: 'border-green-200 dark:border-green-800/30',
          bg: 'bg-green-50 dark:bg-green-900/20',
          text: 'text-green-600 dark:text-green-400',
          icon: 'text-green-500 dark:text-green-400',
        };
      default:
        return {
          border: 'border-blue-200 dark:border-blue-800/30',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          text: 'text-blue-600 dark:text-blue-400',
          icon: 'text-blue-500 dark:text-blue-400',
        };
    }
  }, [style]);

  const htmlContent = useMemo(() => {
    return md.render(content);
  }, [content]);

  return (
    <div
      className={`w-full mb-8 rounded-lg shadow-sm border ${colorClasses.border} ${colorClasses.bg}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`shrink-0 mt-1 ${colorClasses.icon}`}>
            <Icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <h3 className={`text-base font-medium ${colorClasses.text}`}>{title}</h3>
            </div>
            <div
              className="prose prose-sm dark:prose-invert max-w-none [&>:first-child]:mt-0 [&>:last-child]:mb-0
                prose-p:text-gray-600 dark:prose-p:text-gray-300
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-3
                prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
                prose-li:text-gray-600 dark:prose-li:text-gray-300
                prose-headings:text-gray-800 dark:prose-headings:text-gray-100
                prose-code:text-gray-800 dark:prose-code:text-gray-100
                prose-code:font-mono prose-code:text-sm"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: 相信 markdown-it 的安全性（
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
            <div className="flex justify-end gap-2 mt-4">
              {lastUpdatedDate && (
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  修改于 {timeAgo(lastUpdatedDate)}
                </span>
              )}
              <span className="text-sm text-gray-400 dark:text-gray-500">
                发布于 {timeAgo(createdDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentAlert;
