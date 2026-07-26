import { prisma } from "@/lib/prisma";

export const FREE_MAX_DEVICES = 1;
export const PRO_MAX_DEVICES = 3;

export interface UserAgentInfo {
  deviceName: string;
  browser: string;
  os: string;
}

export function parseUserAgent(userAgentString: string | null | undefined): UserAgentInfo {
  if (!userAgentString) {
    return { deviceName: "Unknown Device", browser: "Unknown Browser", os: "Unknown OS" };
  }

  const ua = userAgentString;
  let os = "Desktop OS";
  let deviceName = "PC / Desktop";

  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS";
    deviceName = /ipad/i.test(ua) ? "iPad" : "iPhone";
  } else if (/android/i.test(ua)) {
    os = "Android";
    deviceName = "Android Phone";
  } else if (/linux/i.test(ua)) os = "Linux";

  let browser = "Web Browser";
  if (/edg/i.test(ua)) browser = "Microsoft Edge";
  else if (/chrome|crios/i.test(ua)) browser = "Google Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Mozilla Firefox";
  else if (/safari/i.test(ua)) browser = "Safari";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  return { deviceName, browser, os };
}

/**
 * Enforces the active device limit for a user.
 * If current active sessions exceed max allowed, deletes the oldest sessions (Option B).
 */
export async function enforceDeviceLimit(userId: string, membership: string) {
  try {
    const maxDevices = membership === "PRO" || membership === "LIFETIME" 
      ? PRO_MAX_DEVICES 
      : FREE_MAX_DEVICES;

    const activeSessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { lastActive: "asc" }, // Oldest active sessions first
    });

    if (activeSessions.length >= maxDevices) {
      // Calculate how many old sessions need to be removed to fit the new session
      const sessionsToDeleteCount = activeSessions.length - maxDevices + 1;
      const sessionsToDelete = activeSessions.slice(0, sessionsToDeleteCount);

      const sessionIdsToDelete = sessionsToDelete.map((s) => s.id);
      await prisma.session.deleteMany({
        where: { id: { in: sessionIdsToDelete } },
      });
    }
  } catch (error) {
    console.error("Failed to enforce device limits:", error);
  }
}
