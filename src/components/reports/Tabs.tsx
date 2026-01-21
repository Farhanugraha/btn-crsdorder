type ReportTab = 'dashboard' | 'basic' | 'statistics';

interface TabsProps {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
}

const TABS: { id: ReportTab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'statistics', label: 'Statistik', icon: '📈' }
];

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="overflow-x-auto border-b border-slate-200 dark:border-slate-700">
      <div className="flex min-w-min gap-1 bg-white dark:bg-slate-800 sm:min-w-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-none whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors sm:flex-1 sm:px-4 sm:py-3 sm:text-sm ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">{tab.icon} </span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
