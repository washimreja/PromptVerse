"use client";

import { useEffect, useState } from "react";
import { Laptop, Smartphone, Tablet, Trash2, Shield, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DeviceSession {
  id: string;
  deviceName: string | null;
  browser: string | null;
  os: string | null;
  ip: string | null;
  lastActive: string;
  createdAt: string;
}

export function ActiveDevicesList() {
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [maxDevices, setMaxDevices] = useState<number>(1);
  const [membership, setMembership] = useState<string>("FREE");
  const [loading, setLoading] = useState<boolean>(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/devices");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
        setMaxDevices(data.maxDevices || 1);
        setMembership(data.membership || "FREE");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load active devices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleRevoke = async (sessionId: string) => {
    try {
      setRevokingId(sessionId);
      const res = await fetch("/api/user/devices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (res.ok) {
        toast.success("Device access revoked successfully");
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      } else {
        toast.error("Could not revoke device");
      }
    } catch (err) {
      toast.error("Error revoking device session");
    } finally {
      setRevokingId(null);
    }
  };

  const getDeviceIcon = (deviceName?: string | null, os?: string | null) => {
    const combined = `${deviceName || ""} ${os || ""}`.toLowerCase();
    if (combined.includes("ipad") || combined.includes("tablet")) return <Tablet className="w-5 h-5 text-amber-400" />;
    if (combined.includes("phone") || combined.includes("ios") || combined.includes("android")) return <Smartphone className="w-5 h-5 text-emerald-400" />;
    return <Laptop className="w-5 h-5 text-brand" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-brand" />
        <span className="text-sm">Loading active sessions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Device Usage Status Pill */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand/10 text-brand">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Active Device Quota</h4>
            <p className="text-xs text-muted-foreground">
              {membership === "PRO" || membership === "LIFETIME" 
                ? "Pro Tier allows up to 3 active devices simultaneously." 
                : "Free Tier allows 1 active device. Upgrading to Pro unlocks 3 devices."}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-brand/20 text-brand border border-brand/30">
            {sessions.length} / {maxDevices} Devices
          </span>
        </div>
      </div>

      {/* Session Cards */}
      <div className="grid gap-3">
        {sessions.map((session, index) => (
          <div 
            key={session.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-white/5 hover:border-white/10 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                {getDeviceIcon(session.deviceName, session.os)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">
                    {session.deviceName || "Desktop Browser"}
                  </span>
                  {index === 0 && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Current / Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span>{session.os || "Unknown OS"}</span>
                  <span>•</span>
                  <span>{session.browser || "Unknown Browser"}</span>
                  {session.ip && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-[11px] opacity-75">{session.ip}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRevoke(session.id)}
              disabled={revokingId === session.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold transition-all disabled:opacity-50"
            >
              {revokingId === session.id ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Revoke</span>
            </button>
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="text-center p-8 border border-dashed border-white/10 rounded-2xl text-muted-foreground text-sm">
            No active sessions found.
          </div>
        )}
      </div>
    </div>
  );
}
