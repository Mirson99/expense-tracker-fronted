export const getCategoryStyles = (categoryName: string) => {
  const normalized = categoryName.toLowerCase();

  switch (normalized) {    
    case 'food':
      return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    
    case 'transport':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';

    case 'shopping':
      return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';

    case 'entertainment':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';

    case 'healthcare':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';

    case 'bills':
      return 'bg-red-500/10 text-red-400 border border-red-500/20';

    case 'housing':
      return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';

    case 'education':
      return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';

    case 'travel':
      return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';

    case 'subscriptions':
      return 'bg-violet-500/10 text-violet-400 border border-violet-500/20';

    case 'savings':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';

    case 'other':
    default:
      return 'bg-gray-700/50 text-gray-400 border border-gray-600';
  }
};