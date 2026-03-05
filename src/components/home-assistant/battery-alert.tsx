import { useContext, useEffect, useState } from "react";
import { HomeAssistantContext } from "./home-assistant-context";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";

export default function BatteryAlert() {
  const hassContext = useContext(HomeAssistantContext);
  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (
      !toastId &&
      hassContext &&
      hassContext.batteryLevel &&
      hassContext.batteryLevel <= 33
    ) {
      const id = toast.warning("Low Battery", {
        description: "Charge Phone",
        duration: Infinity,
        onAutoClose(_) {
          setToastId(undefined);
        },
        onDismiss(_) {
          setToastId(undefined);
        },
      });
      setToastId(id);
    } else if (
      hassContext &&
      hassContext.batteryLevel &&
      hassContext.batteryLevel >= 75
    ) {
      toast.dismiss(toastId);
    }

    return () => {};
  }, [hassContext?.batteryLevel]);

  return <Toaster />;
}
