import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";

function AdminButton() {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount === 0) {
      return;
    }

    const timeout = setTimeout(() => {
      setClickCount(0);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [clickCount]);

  if (clickCount === 3) {
    toast.info("Opening admin menu in 5 clicks");
  }

  if (clickCount > 7) {
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <button
          className="border-red-500 absolute border top-0 left-0 w-50 h-50"
          onClick={() => {
            setClickCount(clickCount + 1);
          }}
        />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AdminButton;
