import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const DataTable = ({ data }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return data;
    return data.filter(item => {
      const name = item?.conductor_info?.name?.toLowerCase() || '';
      return name.includes(term);
    });
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    const copy = [...filteredData];
    if (sortBy === 'date') {
      return copy.sort((a, b) => {
        const aDate = new Date(a?.show_info?.opening || 0).getTime();
        const bDate = new Date(b?.show_info?.opening || 0).getTime();
        return aDate - bDate;
      });
    }
    return copy.sort((a, b) => {
      const aName = a?.conductor_info?.name || '';
      const bName = b?.conductor_info?.name || '';
      return aName.localeCompare(bName);
    });
  }, [filteredData, sortBy]);

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900/80 to-black border-2 border-yellow-900/40 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-serif text-yellow-500 font-bold">
            {t('dataTable.title')}
          </h3>
          <p className="text-gray-100 text-sm sm:text-base text-center">
            {t('dataTable.subtitle')}
          </p>
        </div>
        <div className="w-full md:w-auto flex flex-col gap-2 md:items-end">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-yellow-300/80">
            <span>{t('dataTable.sortedBy')} {sortBy === 'name' ? t('dataTable.name') : t('dataTable.date')}</span>
            <span className="text-yellow-500/40">•</span>
            <button
              type="button"
              onClick={() => setSortBy('name')}
              className={`transition-colors ${sortBy === 'name' ? 'text-yellow-200' : 'text-yellow-400/60 hover:text-yellow-300'}`}
            >
              {t('dataTable.name')}
            </button>
            <button
              type="button"
              onClick={() => setSortBy('date')}
              className={`transition-colors ${sortBy === 'date' ? 'text-yellow-200' : 'text-yellow-400/60 hover:text-yellow-300'}`}
            >
              {t('dataTable.date')}
            </button>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t('dataTable.searchPlaceholder')}
            className="w-full md:w-72 px-4 py-3 rounded-xl bg-black/70 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 transition-all"
            aria-label={t('dataTable.searchAria')}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full text-left text-sm sm:text-base">
          <thead className="text-yellow-300 uppercase tracking-widest text-xs border-b border-yellow-900/40">
            <tr>
              <th className="py-3 pr-4">{t('dataTable.headers.conductor')}</th>
              <th className="py-3 pr-4">{t('dataTable.headers.role')}</th>
              <th className="py-3 pr-4">{t('dataTable.headers.show')}</th>
              <th className="py-3 pr-4">{t('dataTable.headers.opening')}</th>
              <th className="py-3 pr-4">{t('dataTable.headers.decade')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {sortedData.map((item, index) => (
              <tr key={item?.id || `row-${index}`} className="hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4 text-white">
                  {item?.conductor_info?.name || t('dataTable.unknown')}
                </td>
                <td className="py-3 pr-4 text-gray-300">
                  {item?.conductor_info?.role ? t(`roles.${item.conductor_info.role}`, { defaultValue: item.conductor_info.role }) : t('dataTable.unknown')}
                </td>
                <td className="py-3 pr-4 text-gray-200">
                  {item?.show_info?.title || t('dataTable.unknown')}
                </td>
                <td className="py-3 pr-4 text-gray-100">
                  {item?.show_info?.opening || t('dataTable.unknown')}
                </td>
                <td className="py-3 pr-4 text-gray-100">
                  {item?.decade || t('dataTable.unknown')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-gray-100 text-xs sm:text-sm">
        {t('dataTable.showing', { count: sortedData.length, total: data.length })}
      </div>
    </motion.div>
  );
};

export default DataTable;
