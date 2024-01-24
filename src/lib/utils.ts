import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

//
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} روز پیش`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} روز پیش`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} ساعت پیش`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} دقیقه پیش`;
    default:
      return "همین الان";
  }
};

export const generateAuditId = (
  action: "like" | "comment" | "follow",
  userId: string,
  targetId: string
) => {
  switch (action) {
    case "like":
      return `${userId.slice(0, 12)}_likes_${targetId.slice(0, 12)}`;
    case "comment":
      return `${userId.slice(0, 12)}_comment_${targetId.slice(0, 12)}`;
    case "follow":
      return `${userId.slice(0, 12)}_follow_${targetId.slice(0, 12)}`;
  }
};

export function mediaType(file: File) {
  if (file.type.startsWith("video")) {
    return "video";
  } else {
    return "image";
  }
}

export class UnityHubError extends Error {
  constructor(public title: string, public message: string) {
    super(message);
    this.name = "UnityHubError";
  }
}
