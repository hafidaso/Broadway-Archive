import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MoreCharts = ({ data }) => {
  const { t } = useTranslation();
  const { byDecade, byRole } = useMemo(() => {
    const decadeCounts = {};
    const roleCounts = {};

    data.forEach(item => {
      const decade = item?.decade ?? 'Unknown';
      const role = item?.conductor_info?.role ?? 'Unknown';
      decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    const byDecadeArr = Object.entries(decadeCounts)
      .map(([decade, count]) => ({ label: `${decade}s`, count }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const byRoleArr = Object.entries(roleCounts)
      .map(([role, count]) => ({ label: role, count }))
      .sort((a, b) => b.count - a.count);

    return { byDecade: byDecadeArr, byRole: byRoleArr };
  }, [data]);

  const maxDecade = Math.max(...byDecade.map(d => d.count), 1);
  const maxRole = Math.max(...byRole.map(r => r.count), 1);

  return (
    <motion.section
      className="mt-10 sm:mt-12 md:mt-16 bg-gradient-to-br from-gray-900/80 to-black border-2 border-yellow-900/40 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 sm:mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* By Decade */}
        <div className="bg-black/50 border border-gray-800 rounded-xl p-5 sm:p-6">
          <h4 className="text-yellow-300 text-sm uppercase tracking-widest mb-4">{t('moreCharts.byDecade')}</h4>
          <div className="space-y-3">
            {byDecade.map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-16 text-xs sm:text-sm text-gray-100">{item.label}</span>
                <div className="flex-1 bg-gray-800/60 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600"
                    style={{ width: `${(item.count / maxDecade) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-xs sm:text-sm text-gray-300 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Role */}
        <div className="bg-black/50 border border-gray-800 rounded-xl p-5 sm:p-6">
          <h4 className="text-yellow-300 text-sm uppercase tracking-widest mb-4">{t('moreCharts.byRole')}</h4>
          <div className="space-y-3">
            {byRole.map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-32 text-xs sm:text-sm text-gray-100 truncate">{item.label}</span>
                <div className="flex-1 bg-gray-800/60 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600"
                    style={{ width: `${(item.count / maxRole) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-xs sm:text-sm text-gray-300 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MoreCharts;
