import type { PropsWithChildren } from "react";

export function Container(props: PropsWithChildren) {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {props.children}
    </div>
  );
}
