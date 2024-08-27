import { CSSProperties, useMemo } from 'react';

import { cn } from '@/lib/utils';

import groupColors from '@/utils/constants/defaultValues/groupColors';
import rapidsenseExtendColors from '@/utils/constants/rapidsenseExtendColors';

const rsColors = Object.values(rapidsenseExtendColors);

type Props<D extends { groupColor?: string; name: string }> = {
  groups: Array<D>;
  className?: CSSProperties;
};

const generateColor = (id: string, colors: string[]) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 16) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const GroupTableButton = <
  D extends { groupColor?: string; name: string; id: number },
>(
  props: Props<D>,
) => {
  const { groups, className } = props;

  const initialGroupColors = [...groupColors, ...rsColors];

  const colorMapping = useMemo(() => {
    const mapping = new Map<string, string>();
    groups.forEach((group) => {
      const key = group.id.toString(); // or group.name for name-based consistency
      if (!mapping.has(key)) {
        mapping.set(key, generateColor(key, initialGroupColors));
      }
    });
    return mapping;
  }, [groups, initialGroupColors]);

  return (
    <div
      className={cn(
        'max-h-120 flex w-auto flex-wrap gap-6 overflow-y-auto overflow-x-hidden',
        className,
      )}
    >
      {groups.map(({ id, name, groupColor }) => {
        const dynamicBackgroundColor = groupColor
          ? groupColor
          : colorMapping.get(id.toString()) ??
            `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        return (
          <button
            title={name}
            key={id}
            className="cursor-default whitespace-nowrap rounded-full border-0 px-6 py-2 transition-colors duration-300 hover:opacity-80"
            style={{ backgroundColor: dynamicBackgroundColor }}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};

export default GroupTableButton;
