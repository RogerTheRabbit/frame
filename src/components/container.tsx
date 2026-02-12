import type { PropsWithChildren } from "react";

export function Container(props: PropsWithChildren) {
  return (
    <div className="h-screen w-screen flex flex-row justify-center items-center space-y-5">
      {props.children}
    </div>
  );
}
