import React from "react";
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground">Loading, please wait…</p>
    </div>
  );
};

export default Loading;
