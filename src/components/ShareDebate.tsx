/**
 * Share debate component — copy link, share to social.
 */
import { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";
import { useToast } from "./Toast";

interface ShareDebateProps {
  debateId: string;
  topic: string;
}

export default function ShareDebate({ debateId, topic }: ShareDebateProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const shareUrl = `${window.location.origin}/#/debate/${debateId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast("success", "Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("error", "Failed to copy. Try selecting the URL manually.");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Debate: ${topic}`,
          text: `Check out this AI-generated debate analysis on "${topic}"`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed — no action needed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all cursor-pointer"
        title="Copy share link"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <button
        onClick={handleNativeShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all cursor-pointer"
        title="Share debate"
      >
        <Share2 className="h-3.5 w-3.5" />
        <span>Share</span>
      </button>
    </div>
  );
}
