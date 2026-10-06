import {
  type MessageWithUser,
  messagesWithPaginationSchema,
  messageWithUserSchema,
} from "@chat/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowNarrowRight,
  IconDeviceDesktop,
  IconLogout2,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { Link, useRouter } from "@typeroute/router";
import type { PublicationContext } from "centrifuge";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Mark } from "@/components/mark";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { centrifuge, chatSubscription } from "@/lib/centrifuge";
import { cn, mergeDedupeSort } from "@/lib/utils";

const messageSchema = z.object({
  message: z.string().trim().min(1),
});

const url = new URL(`${import.meta.env.VITE_SERVER_URL}/messages`);

const errorToast = (message: string) =>
  toast.add({ type: "error", title: "Error", description: message });

const EMPTY_PROMPTS = ["Say hi", "Ask a question", "Share something"];

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function Chat() {
  const [isCsrfTokenLoading, setIsCsrfTokenLoading] = useState<boolean>(false);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageWithUser>>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [nextOffset, setNextOffset] = useState<number>(0);
  const { data: sessionData, isPending: isSessionPending } =
    authClient.useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const nextTheme =
    theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const [connState, setConnState] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const connectionLabel =
    connState === "connected"
      ? "Live"
      : connState === "disconnected"
        ? "Reconnecting"
        : "Connecting";
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });
  const { message } = useWatch({ control: form.control });
  const isMessageEmpty = !message?.trim();

  const onSignOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.add({
        type: "error",
        title: "Sign out failed",
        description:
          error.message ||
          "An unknown error occurred while trying to sign out.",
      });
    }

    return router.navigate({ to: "/sign-in" });
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    if (csrfToken === "") {
      toast.add({
        type: "error",
        title: "Invalid CSRF token",
        description:
          "CSRF token is invalid. Please refresh the page and try again.",
      });

      return;
    }

    if (!sessionData) {
      toast.add({
        type: "error",
        title: "Not signed in",
        description: "You must be signed in to send a message",
      });

      return onSignOut();
    }

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ content: data.message }),
    });

    if (!response.ok) {
      errorToast("Failed to send message");

      return;
    }

    form.resetField("message");
  };

  const getMessages = async (offset: number) => {
    try {
      setIsMessagesLoading(true);
      const target = new URL(url);
      target.searchParams.append("offset", offset.toString());
      const response = await fetch(target, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load messages");
      }

      const { messages, hasMore } = messagesWithPaginationSchema.parse(
        await response.json(),
      );

      if (messages.length !== 0) {
        setMessages((prevMessages) =>
          mergeDedupeSort<MessageWithUser>(
            prevMessages,
            messages,
            (message) => message.id,
            (message) => message.createdAt,
          ),
        );
      }

      setHasMore(hasMore);
      setNextOffset(offset + messages.length);
    } catch (error) {
      let errorMessage = "Failed to load messages";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorToast(errorMessage);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    await getMessages(nextOffset);
    setIsLoadingMore(false);
  };

  const getCsrfToken = async () => {
    try {
      setIsCsrfTokenLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/csrf-token`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to get CSRF token");
      }

      const { csrfToken } = (await response.json()) as { csrfToken: string };

      setCsrfToken(csrfToken);
    } catch (error) {
      let errorMessage = "Failed to get CSRF token";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorToast(errorMessage);
    } finally {
      setIsCsrfTokenLoading(false);
    }
  };

  useEffect(() => {
    getCsrfToken();
    getMessages(0);
    centrifuge.connect();
    chatSubscription.subscribe();

    let hasConnectedBefore = false;

    const onConnecting = () => {
      setConnState("connecting");
    };

    const onConnected = () => {
      setConnState("connected");

      if (hasConnectedBefore) return;

      getMessages(0);
      hasConnectedBefore = true;
    };

    const onDisconnected = () => {
      setConnState("disconnected");
    };

    const onPublication = (context: PublicationContext): void => {
      const message = messageWithUserSchema.parse(context.data);

      setMessages((prevMessages) =>
        mergeDedupeSort<MessageWithUser>(
          prevMessages,
          [{ ...message }],
          (message) => message.id,
          (message) => message.createdAt,
        ),
      );
    };

    centrifuge.on("connecting", onConnecting);
    centrifuge.on("connected", onConnected);
    centrifuge.on("disconnected", onDisconnected);
    chatSubscription.on("publication", onPublication);

    return () => {
      centrifuge.off("connecting", onConnecting);
      centrifuge.off("connected", onConnected);
      centrifuge.off("disconnected", onDisconnected);
      chatSubscription.off("publication", onPublication);
      chatSubscription.unsubscribe();
      centrifuge.disconnect();
    };
  }, []);

  if (
    isSessionPending &&
    isCsrfTokenLoading &&
    isMessagesLoading &&
    !sessionData
  ) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Spinner className="size-16" />
      </div>
    );
  }

  const groups: Array<{
    key: string;
    user: MessageWithUser["user"];
    messages: MessageWithUser[];
  }> = [];

  for (const message of messages) {
    const current = groups.at(-1);

    if (current && current.user.id === message.user.id) {
      current.messages.push(message);
    } else {
      groups.push({
        key: message.id,
        user: message.user,
        messages: [message],
      });
    }
  }

  for (const group of groups) {
    group.key = group.messages[group.messages.length - 1].id;
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
      <header className="grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-border border-b px-2">
        <h1 className="sr-only">Chat</h1>
        <div className="flex items-center gap-1.5 justify-self-start">
          <Mark className="size-6 text-primary" />
        </div>
        <span
          role="status"
          aria-label={connectionLabel}
          className="justify-self-center"
        >
          {connState !== "connected" && (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap border border-border px-2 py-0.5 text-xs">
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 animate-pulse rounded-full motion-reduce:animate-none",
                  connState === "disconnected"
                    ? "bg-destructive"
                    : "bg-muted-foreground",
                )}
              />
              <span aria-hidden="true" className="hidden sm:inline">
                {connectionLabel}
              </span>
            </span>
          )}
        </span>
        <div className="flex items-center gap-1 justify-self-end">
          <Button
            variant="ghost"
            className="size-11 hover:cursor-pointer"
            aria-label={`Switch theme (current: ${theme})`}
            title={`Theme: ${theme}`}
            onClick={() => setTheme(nextTheme)}
          >
            {theme === "dark" ? (
              <IconMoon className="size-6" />
            ) : theme === "light" ? (
              <IconSun className="size-6" />
            ) : (
              <IconDeviceDesktop className="size-6" />
            )}
          </Button>
          <Button
            variant="ghost"
            className="size-11 hover:cursor-pointer hover:text-destructive"
            aria-label="Sign out"
            onClick={onSignOut}
          >
            <IconLogout2 className="size-6" />
          </Button>
        </div>
      </header>
      {hasMore && (
        <div className="flex shrink-0 items-center gap-3 px-2 py-1">
          <Separator className="flex-1" />
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full px-4 hover:cursor-pointer"
            onClick={loadMoreMessages}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <Spinner className="size-4" />
            ) : (
              "Earlier messages"
            )}
          </Button>
          <Separator className="flex-1" />
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col-reverse gap-4 overflow-y-auto px-2 py-2">
        {messages.length === 0 && isMessagesLoading && (
          <div className="m-auto flex w-5/6 flex-col gap-4" aria-hidden="true">
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className="flex animate-pulse flex-col gap-2 motion-reduce:animate-none"
              >
                <div className="flex items-center gap-2">
                  <div className="size-6 bg-muted" />
                  <div className="h-3 w-24 bg-muted" />
                  <div className="ml-auto h-3 w-12 bg-muted" />
                </div>
                <div className="h-4 w-3/4 bg-muted" />
                <div className="h-4 w-1/2 bg-muted" />
              </div>
            ))}
          </div>
        )}
        {messages.length === 0 && !isMessagesLoading && (
          <div className="m-auto flex flex-col items-center gap-3 px-4 text-center">
            <Mark className="size-10 text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm">No messages yet.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {EMPTY_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="hover:cursor-pointer"
                  onClick={() => {
                    form.setValue("message", prompt);
                    document.getElementById("message")?.focus();
                  }}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}
        {groups.map((group, groupIndex) => {
          const own = group.user.id === sessionData?.user.id;
          const newest = group.messages[0];

          return (
            <div
              key={group.key}
              className={cn(
                "flex w-fit max-w-[80%] flex-col",
                own ? "items-end self-end" : "items-start self-start",
              )}
            >
              {!own && (
                <div className="flex items-center gap-2 px-1 pb-1">
                  <span
                    aria-hidden="true"
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground text-xs"
                  >
                    {initialsOf(group.user.name)}
                  </span>
                  <span className="font-medium text-sm">{group.user.name}</span>
                </div>
              )}
              <div className={cn("flex flex-col", own ? "gap-[2px]" : "gap-1")}>
                {group.messages.map((message, messageIndex) => {
                  const isLast = messageIndex === group.messages.length - 1;

                  return (
                    <div
                      key={message.id}
                      style={{
                        animationDelay: `${Math.min(groupIndex, 8) * 40}ms`,
                      }}
                      className={cn(
                        "wrap-break-word fade-in slide-in-from-bottom-1 animate-in rounded-2xl px-3 py-1.5 text-sm shadow-sm duration-300 motion-reduce:animate-none",
                        isLast && own && "rounded-br-[5px]",
                        isLast && !own && "rounded-bl-[5px]",
                        own
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-card-foreground",
                      )}
                    >
                      {message.content}
                    </div>
                  );
                })}
              </div>
              <time
                className="mt-0.5 px-1 text-muted-foreground text-xs tabular-nums"
                dateTime={newest.createdAt.toISOString()}
              >
                {formatTime(newest.createdAt)}
              </time>
            </div>
          );
        })}
      </div>
      <form
        className="shrink-0 border-border border-t px-2 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit(onSubmit)(e);
        }}
      >
        <Controller
          name="message"
          control={form.control}
          render={({ field, formState }) => (
            <div className="flex items-center gap-2">
              <Input
                {...field}
                id={field.name}
                className="h-11 flex-1 rounded-full px-4 text-base md:text-sm"
                placeholder="Message"
                aria-disabled={field.disabled}
                autoComplete="off"
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Send message"
                className="size-11 shrink-0 rounded-full hover:cursor-pointer"
                disabled={
                  csrfToken === "" || isMessageEmpty || formState.isSubmitting
                }
                aria-disabled={
                  csrfToken === "" || isMessageEmpty || formState.isSubmitting
                }
              >
                {formState.isSubmitting ? (
                  <Spinner className="size-5" />
                ) : (
                  <IconArrowNarrowRight className="size-5" />
                )}
              </Button>
            </div>
          )}
        ></Controller>
      </form>
      <footer className="shrink-0 px-2 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] text-center text-muted-foreground text-xs">
        <Link
          to="/privacy"
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          Privacy
        </Link>
        <span aria-hidden="true">{" · "}</span>
        <Link
          to="/terms"
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          Terms
        </Link>
      </footer>
    </div>
  );
}

export default Chat;
