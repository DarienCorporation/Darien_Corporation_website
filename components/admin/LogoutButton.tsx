"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  const [pending, setPending] = useState(false);
  return (
    <Button
      variant="secondary"
      icon={false}
      loading={pending}
      onClick={async () => {
        setPending(true);
        await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" }).catch(() => null);
        window.location.assign("/admin/login");
      }}
    >
      Sign out
    </Button>
  );
}
