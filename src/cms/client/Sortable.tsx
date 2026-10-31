"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { HTMLAttributes, ReactNode } from "react";
import { Icon } from "./icons";

// Danh sách kéo thả để sắp xếp (dnd-kit): dòng của trường "rows", ảnh của trường "media".
// Kéo bằng tay nắm ⠿; bàn phím: Tab tới tay nắm, Space để nhấc, mũi tên để di chuyển, Space để thả, Esc để huỷ.
// Tải riêng (next/dynamic, ssr: false) từ fields.tsx.

export type SortableProps<T> = {
  items: T[];
  /** Khoá ổn định của từng mục, cùng thứ tự với items */
  ids: string[];
  layout: "list" | "grid";
  /** Tên mục để đọc cho trình đọc màn hình, ví dụ "Dòng 2" */
  label: (item: T, index: number) => string;
  onReorder: (items: T[], ids: string[]) => void;
  /** Dựng một mục; đặt `handle` vào chỗ muốn có tay nắm kéo */
  render: (item: T, index: number, handle: ReactNode) => ReactNode;
  className?: string;
  itemClassName?: string;
  itemAs?: "div" | "figure";
};

function Item({
  id,
  as: Tag = "div",
  className,
  label,
  children,
}: {
  id: string;
  as?: "div" | "figure";
  className?: string;
  label: string;
  children: (handle: ReactNode) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      className="c-drag"
      aria-label={`Kéo để đổi thứ tự: ${label}`}
      {...attributes}
      {...(listeners as HTMLAttributes<HTMLButtonElement>)}
    >
      <Icon name="grip" size={16} />
    </button>
  );
  return (
    <Tag
      ref={setNodeRef}
      className={`${className ?? ""}${isDragging ? " is-dragging" : ""}`}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      {children(handle)}
    </Tag>
  );
}

export default function Sortable<T>({ items, ids, layout, label, onReorder, render, className, itemClassName, itemAs }: SortableProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    // Trên điện thoại: giữ tay nắm 150 ms mới kéo, để vuốt cuộn trang không bị nhầm
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const nameOf = (id: string | number) => {
    const i = ids.indexOf(String(id));
    return i < 0 ? "mục" : label(items[i], i);
  };
  const pos = (id: string | number | undefined) => (id === undefined ? 0 : ids.indexOf(String(id)) + 1);
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Đã nhấc ${nameOf(active.id)}.`,
    onDragOver: ({ active, over }) => (over ? `${nameOf(active.id)} ở vị trí ${pos(over.id)} trên ${ids.length}.` : undefined),
    onDragEnd: ({ active, over }) => (over ? `Đã thả ${nameOf(active.id)} vào vị trí ${pos(over.id)}.` : `Đã thả ${nameOf(active.id)}.`),
    onDragCancel: ({ active }) => `Đã huỷ kéo ${nameOf(active.id)}, giữ nguyên vị trí.`,
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    onReorder(arrayMove(items, from, to), arrayMove(ids, from, to));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable: "Nhấn Space để nhấc. Dùng phím mũi tên để di chuyển, Space để thả, Esc để huỷ.",
        },
      }}
    >
      <SortableContext items={ids} strategy={layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, i) => (
            <Item key={ids[i]} id={ids[i]} as={itemAs} className={itemClassName} label={label(item, i)}>
              {(handle) => render(item, i, handle)}
            </Item>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
