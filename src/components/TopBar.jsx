import { User } from 'lucide-react';

function TopBar({ title }) {
  const email = localStorage.getItem('email') || 'User';

  return (
    <div className="h-16 bg-white shadow-md flex items-center justify-between px-8 ml-20">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-green-600" />
        </div>
        <span className="text-sm text-gray-600">{email}</span>
      </div>
    </div>
  );
}

export default TopBar;
