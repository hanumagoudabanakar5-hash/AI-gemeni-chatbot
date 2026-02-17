"use client";

import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Streamdown } from "streamdown";

import { BotIcon, UserIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import { ListRepositories } from "../github/list-repositories";
import { ListIssues } from "../github/list-issues";
import { RepositoryDetails } from "../github/repository-details";

export const Message = ({
  chatId,
  role,
  content,
  toolInvocations,
  attachments,
}: {
  chatId: string;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {content && typeof content === "string" && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Streamdown>{content}</Streamdown>
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;

                return (
                  <div key={toolCallId}>
                    {toolName === "searchRepositories" ? (
                      <ListRepositories chatId={chatId} results={result} />
                    ) : toolName === "findGoodFirstIssues" ? (
                      <ListIssues results={result} />
                    ) : toolName === "getRepositoryDetails" ? (
                      <RepositoryDetails repository={result} />
                    ) : (
                      <div className="rounded-lg bg-muted px-4 py-3">
                        <pre className="text-xs overflow-x-auto">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId} className="skeleton">
                    {toolName === "searchRepositories" ? (
                      <div className="rounded-lg bg-muted px-4 py-3 animate-pulse">
                        <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-full"></div>
                      </div>
                    ) : toolName === "findGoodFirstIssues" ? (
                      <div className="rounded-lg bg-muted px-4 py-3 animate-pulse">
                        <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-full"></div>
                      </div>
                    ) : toolName === "getRepositoryDetails" ? (
                      <div className="rounded-lg bg-muted px-4 py-3 animate-pulse">
                        <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-full"></div>
                      </div>
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        )}

        {attachments && (
          <div className="flex flex-row gap-2">
            {attachments.map((attachment) => (
              <PreviewAttachment key={attachment.url} attachment={attachment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
