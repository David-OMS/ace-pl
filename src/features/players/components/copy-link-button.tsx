"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/ui/button";
import { Icon } from "@/ui/icon";

import { playersCopy } from "../copy";

const COPIED_FEEDBACK_MS = 2000;

export function CopyLinkButton({ url }: { url: string }): React.JSX.Element {
  const [isCopied, setIsCopied] = useState(false);

  async function copyLink(): Promise<void> {
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS);
  }

  return (
    <Button onClick={copyLink} fullWidth>
      <Icon icon={isCopied ? Check : Copy} size="sm" />
      {isCopied ? playersCopy.claimLink.copied : playersCopy.claimLink.copy}
    </Button>
  );
}
