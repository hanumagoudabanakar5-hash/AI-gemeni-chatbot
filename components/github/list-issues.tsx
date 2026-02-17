"use client";

import { formatDistanceToNow } from "date-fns";

export function ListIssues({
  results,
}: {
  results: {
    issues: Array<{
      title: string;
      number: number;
      url: string;
      labels: string[];
      createdAt: string;
      comments: number;
    }>;
    total: number;
  };
}) {
  if (results.issues.length === 0) {
    return (
      <div className="rounded-lg bg-muted px-4 py-3">
        <p className="text-sm text-muted-foreground">
          No good first issues found in this repository.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-muted px-4 py-1.5 flex flex-col">
      <div className="text-sm text-muted-foreground mb-2 pt-2">
        Found {results.total} good first issues. Showing recent {results.issues.length}:
      </div>
      {results.issues.map((issue) => (
        <div
          key={issue.number}
          className="flex flex-col border-b dark:border-zinc-700 py-3 last-of-type:border-none"
        >
          <div className="flex flex-row justify-between items-start gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <a
                href={issue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium hover:underline text-blue-600 dark:text-blue-400"
              >
                #{issue.number} {issue.title}
              </a>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {issue.labels.map((label) => (
                  <span
                    key={label}
                    className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
              <div>
                {formatDistanceToNow(new Date(issue.createdAt), {
                  addSuffix: true,
                })}
              </div>
              <div>{issue.comments} comments</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
