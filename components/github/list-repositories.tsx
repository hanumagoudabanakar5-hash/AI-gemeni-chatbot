"use client";

import { useChat } from "ai/react";

export function ListRepositories({
  chatId,
  results,
}: {
  chatId: string;
  results: {
    repositories: Array<{
      name: string;
      fullName: string;
      description: string;
      stars: number;
      language: string;
      url: string;
      topics: string[];
      openIssues: number;
    }>;
    total: number;
  };
}) {
  const { append } = useChat({
    id: chatId,
    body: { id: chatId },
    maxSteps: 5,
  });

  if (results.repositories.length === 0) {
    return (
      <div className="rounded-lg bg-muted px-4 py-3">
        <p className="text-sm text-muted-foreground">
          No repositories found. Try different search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-muted px-4 py-1.5 flex flex-col">
      <div className="text-sm text-muted-foreground mb-2 pt-2">
        Found {results.total} repositories. Showing top {results.repositories.length}:
      </div>
      {results.repositories.map((repo) => (
        <div
          key={repo.fullName}
          className="cursor-pointer flex flex-col border-b dark:border-zinc-700 py-3 last-of-type:border-none group"
          onClick={() => {
            append({
              role: "user",
              content: `Tell me more about ${repo.fullName} and find good first issues in it`,
            });
          }}
        >
          <div className="flex flex-row justify-between items-start gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <div className="text-base font-medium group-hover:underline">
                {repo.fullName}
              </div>
              {repo.description && (
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {repo.description}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-1">
                {repo.language && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {repo.language}
                  </span>
                )}
                {repo.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-sm">
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span className="text-muted-foreground">{repo.stars.toLocaleString()}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {repo.openIssues} open issues
              </div>
            </div>
          </div>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 dark:text-blue-400 hover:underline mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            View on GitHub →
          </a>
        </div>
      ))}
    </div>
  );
}
