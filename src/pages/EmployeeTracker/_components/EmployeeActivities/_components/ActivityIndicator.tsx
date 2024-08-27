import Card from '@/components/Card';

import { selectLanguage } from '@/stores/languageStore/languageSlice';

import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

interface Props {
  activities: { name: string; color: string }[];
}

const ActivityIndicator = ({ activities }: Props) => {
  const language = useAppSelector(selectLanguage);

  const Activity = ({ name, color }: { name: string; color: string }) => (
    <div className="flex items-center gap-2">
      <div
        className={`h-4 w-4 rounded-sm`}
        style={{ backgroundColor: color }}
      ></div>
      <span className="whitespace-nowrap">{localization(name, language)}</span>
    </div>
  );

  return (
    <Card className="flex h-fit w-fit flex-row flex-wrap gap-4 rounded-md p-2">
      {activities.map((activity, index) => (
        <Activity key={index} name={activity.name} color={activity.color} />
      ))}
    </Card>
  );
};

export default ActivityIndicator;
