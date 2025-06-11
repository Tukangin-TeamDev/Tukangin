interface ActivityItem {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

interface RecentActivityListProps {
  activities: ActivityItem[];
}

export default function RecentActivityList({ activities }: RecentActivityListProps) {
  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <div
          key={activity.id}
          className="flex items-start rounded-md border border-transparent p-2 transition-all hover:border-gray-200 hover:bg-gray-50"
        >
          <div
            className={`mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${activity.color}`}
          >
            {activity.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800">{activity.message}</p>
            <span className="text-xs text-gray-500">{activity.time}</span>
          </div>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">Tidak ada aktivitas terbaru</p>
        </div>
      )}
    </div>
  );
}
