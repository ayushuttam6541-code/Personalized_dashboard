'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ContentItem } from '@/types/content';
import { ContentCard } from './ContentCard';
import { RotateCcw, Grip } from 'lucide-react';

interface ContentGridProps {
  items: ContentItem[];
  enableDrag?: boolean;
  onReorder?: (newOrder: string[]) => void;
  onResetOrder?: () => void;
  hasCustomOrder?: boolean;
}

function SortableContentCard({ item }: { item: ContentItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.75 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ContentCard
        item={item}
        isDraggable={true}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function ContentGrid({
  items,
  enableDrag = true,
  onReorder,
  onResetOrder,
  hasCustomOrder = false,
}: ContentGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      if (onReorder) {
        onReorder(reorderedItems.map((item) => item.id));
      }
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Drag & Drop toolbar / notice */}
      {enableDrag && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-zinc-100/70 px-4 py-2 text-xs text-zinc-600 dark:bg-zinc-900/60 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Grip className="h-4 w-4 text-indigo-500" />
            <span>
              <strong>Drag cards</strong> using the handle in the top-left to customize your feed layout.
            </span>
          </div>

          {hasCustomOrder && onResetOrder && (
            <button
              type="button"
              onClick={onResetOrder}
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Arrangement
            </button>
          )}
        </div>
      )}

      {/* Grid view */}
      {enableDrag ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <SortableContentCard key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
