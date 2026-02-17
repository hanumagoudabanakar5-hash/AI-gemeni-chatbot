import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";

import { geminiProModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import {
  deleteChatById,
  getChatById,
  saveChat,
} from "@/db/queries";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const result = await streamText({
    model: geminiProModel,
    system: `\n
        - You are a helpful assistant that helps engineering students find good first issues in GitHub repositories
        - You specialize in finding repositories related to decentralized applications (DApps), blockchain, Web3, and related technologies
        - When users ask for repository recommendations, search for repositories with "good-first-issue" labels
        - Consider the user's skill level (e.g., 2nd year engineering student = beginner to intermediate)
        - Look for repositories with good documentation, active communities, and beginner-friendly issues
        - Provide clear explanations about why each repository is a good fit
        - Today's date is ${new Date().toLocaleDateString()}
        - Focus on decentralized technologies like: Ethereum, Solidity, Web3.js, IPFS, Smart Contracts, DeFi, NFTs, DAOs
      `,
    messages: coreMessages,
    tools: {
      searchRepositories: {
        description: "Search for GitHub repositories related to decentralized applications",
        parameters: z.object({
          topics: z.array(z.string()).describe("Topics to search for (e.g., 'blockchain', 'web3', 'ethereum', 'defi')"),
          difficulty: z.enum(["beginner", "intermediate", "advanced"]).describe("Difficulty level for the student"),
        }),
        execute: async ({ topics, difficulty }) => {
          // Construct search query for GitHub API
          const topicQuery = topics.map(t => `topic:${t}`).join("+");
          const labelQuery = "label:good-first-issue+OR+label:beginner-friendly";
          const query = `${topicQuery}+${labelQuery}+stars:>50`;
          
          try {
            const response = await fetch(
              `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=5`,
              {
                headers: {
                  "Accept": "application/vnd.github.v3+json",
                  "User-Agent": "AI-Gemini-Chatbot"
                }
              }
            );

            if (!response.ok) {
              return { error: "Failed to fetch repositories from GitHub" };
            }

            const data = await response.json();
            
            return {
              repositories: data.items.map((repo: any) => ({
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description,
                stars: repo.stargazers_count,
                language: repo.language,
                url: repo.html_url,
                topics: repo.topics,
                openIssues: repo.open_issues_count,
              })),
              total: data.total_count,
            };
          } catch (error) {
            return { error: "Error searching for repositories" };
          }
        },
      },
      findGoodFirstIssues: {
        description: "Find good first issues in a specific GitHub repository",
        parameters: z.object({
          repository: z.string().describe("Repository name in format 'owner/repo' (e.g., 'ethereum/web3.js')"),
        }),
        execute: async ({ repository }) => {
          try {
            // Search for issues with good-first-issue label
            const response = await fetch(
              `https://api.github.com/search/issues?q=repo:${repository}+label:good-first-issue+state:open&sort=created&order=desc&per_page=10`,
              {
                headers: {
                  "Accept": "application/vnd.github.v3+json",
                  "User-Agent": "AI-Gemini-Chatbot"
                }
              }
            );

            if (!response.ok) {
              return { error: "Failed to fetch issues from GitHub" };
            }

            const data = await response.json();
            
            return {
              issues: data.items.map((issue: any) => ({
                title: issue.title,
                number: issue.number,
                url: issue.html_url,
                labels: issue.labels.map((l: any) => l.name),
                createdAt: issue.created_at,
                comments: issue.comments,
              })),
              total: data.total_count,
            };
          } catch (error) {
            return { error: "Error fetching issues" };
          }
        },
      },
      getRepositoryDetails: {
        description: "Get detailed information about a specific GitHub repository",
        parameters: z.object({
          repository: z.string().describe("Repository name in format 'owner/repo'"),
        }),
        execute: async ({ repository }) => {
          try {
            const response = await fetch(
              `https://api.github.com/repos/${repository}`,
              {
                headers: {
                  "Accept": "application/vnd.github.v3+json",
                  "User-Agent": "AI-Gemini-Chatbot"
                }
              }
            );

            if (!response.ok) {
              return { error: "Failed to fetch repository details" };
            }

            const repo = await response.json();
            
            return {
              name: repo.name,
              fullName: repo.full_name,
              description: repo.description,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
              url: repo.html_url,
              topics: repo.topics,
              openIssues: repo.open_issues_count,
              hasWiki: repo.has_wiki,
              hasIssues: repo.has_issues,
              license: repo.license?.name,
              defaultBranch: repo.default_branch,
            };
          } catch (error) {
            return { error: "Error fetching repository details" };
          }
        },
      },
    },
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error("Failed to save chat");
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
