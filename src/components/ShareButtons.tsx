'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOnTwitter = () => {
    const twitterUrl = new URL('https://twitter.com/intent/tweet');
    twitterUrl.searchParams.append('text', title);
    twitterUrl.searchParams.append('url', url);
    window.open(twitterUrl.toString(), '_blank', 'width=550,height=420');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = new URL('https://www.linkedin.com/sharing/share-offsite/');
    linkedInUrl.searchParams.append('url', url);
    window.open(linkedInUrl.toString(), '_blank', 'width=550,height=420');
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-[#6b7280] dark:text-[#a0aec0]">
        Share
      </span>

      {/* Twitter/X */}
      <button
        onClick={shareOnTwitter}
        className="p-2 rounded-lg bg-gray-100 dark:bg-[#1a2a3a] text-[#1a1a2e] dark:text-white hover:bg-gray-200 dark:hover:bg-[#254052] transition-colors"
        aria-label="Share on Twitter"
        title="Share on Twitter"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11.5 3l1.4 2h2.5l-3 3v2l2 2h-2l1 3h-2l-1-3h-2l1-3H7l3-3V5l-2-2h2.5L11.5 3z" />
          <path d="M3 3h5v2H3V3zm8 0h5v2h-5V3z" />
        </svg>
      </button>

      {/* LinkedIn */}
      <button
        onClick={shareOnLinkedIn}
        className="p-2 rounded-lg bg-gray-100 dark:bg-[#1a2a3a] text-[#1a1a2e] dark:text-white hover:bg-gray-200 dark:hover:bg-[#254052] transition-colors"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M16.338 16.338H13.67v-5.207c0-1.241-.457-2.051-1.529-2.051-.835 0-1.335.562-1.556 1.1-.08.194-.1.469-.1.745v5.413h-2.668V9.309h2.668v1.491c.371-.574 1.04-1.393 2.531-1.393 1.845 0 3.227 1.205 3.227 3.797v3.534zM4.997 8.193c-.857 0-1.554-.568-1.554-1.269 0-.701.697-1.27 1.554-1.27.86 0 1.555.569 1.555 1.27 0 .701-.695 1.269-1.555 1.269zm1.348 7.957H3.677V9.309h2.668v6.841zM17.11 0H2.885A2.88 2.88 0 000 2.885v14.23A2.88 2.88 0 002.884 20h14.225A2.88 2.88 0 0020 17.115V2.884A2.88 2.88 0 0017.11 0z" />
        </svg>
      </button>

      {/* Copy Link */}
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-lg bg-gray-100 dark:bg-[#1a2a3a] text-[#1a1a2e] dark:text-white hover:bg-gray-200 dark:hover:bg-[#254052] transition-colors"
        aria-label="Copy link to clipboard"
        title="Copy link"
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <Copy className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
