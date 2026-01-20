type ReportTab = 'dashboard' | 'basic' | 'statistics';

interface TabsProps {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
}

const TABS: { id: ReportTab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' }
];

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <div className="flex gap-1 rounded-t-lg bg-white dark:bg-slate-800">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 border-b-2 px-4 py-3 text-center text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
