import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 24, text = '' }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className="animate-spin" size={size} />
      {text && <span className="text-sm text-gray-400">{text}</span>}
    </div>
  );
};