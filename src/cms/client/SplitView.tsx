"use client";

import { Group, Panel, Separator, useDefaultLayout } from "react-resizable-panels";
import type { ReactNode } from "react";

// Hai khung cạnh nhau, kéo vạch giữa để đổi tỉ lệ (react-resizable-panels); tỉ lệ được nhớ trong trình duyệt.
// Bấm đúp vạch giữa để về tỉ lệ mặc định. Chỉ dùng trên màn hình rộng; tải riêng (next/dynamic, ssr: false).
export default function SplitView({ id, left, right, rightLabel }: { id: string; left: ReactNode; right: ReactNode; rightLabel: string }) {
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ id, storage: localStorage, onlySaveAfterUserInteractions: true });
  return (
    <Group id={id} className="c-split" orientation="horizontal" defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
      <Panel id="list" className="c-split__pane" defaultSize="62%" minSize="40%">
        {left}
      </Panel>
      <Separator className="c-split__handle" aria-label={`Kéo để đổi độ rộng khung ${rightLabel}`} />
      <Panel id="detail" className="c-split__pane" defaultSize="38%" minSize={300} maxSize="55%">
        {right}
      </Panel>
    </Group>
  );
}
