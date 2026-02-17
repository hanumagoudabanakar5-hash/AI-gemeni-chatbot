"use client";

export function RepositoryDetails({
  repository,
}: {
  repository: {
    name: string;
    fullName: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
    topics: string[];
    openIssues: number;
    hasWiki: boolean;
    hasIssues: boolean;
    license?: string;
    defaultBranch: string;
  };
}) {
  return (
    <div className="rounded-lg bg-muted px-4 py-3 flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <a
          href={repository.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold hover:underline text-blue-600 dark:text-blue-400"
        >
          {repository.fullName}
        </a>
        {repository.description && (
          <p className="text-sm text-muted-foreground">
            {repository.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Stars</span>
          <span className="font-medium">⭐ {repository.stars.toLocaleString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Forks</span>
          <span className="font-medium">🔱 {repository.forks.toLocaleString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Issues</span>
          <span className="font-medium">📋 {repository.openIssues}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Language</span>
          <span className="font-medium">{repository.language || "N/A"}</span>
        </div>
      </div>

      {repository.topics.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Topics</span>
          <div className="flex flex-wrap gap-1.5">
            {repository.topics.map((topic) => (
              <span
                key={topic}
                className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {repository.license && (
          <span>📜 License: {repository.license}</span>
        )}
        <span>🌿 Default branch: {repository.defaultBranch}</span>
        {repository.hasWiki && <span>📚 Has Wiki</span>}
        {repository.hasIssues && <span>🐛 Issues enabled</span>}
      </div>
    </div>
  );
}
