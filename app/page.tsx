'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import adminsData from '../data/admins.json';

interface Creation {
  _id: string;
  name?: string;
  thumbnail?: string;
  url?: string;
  createdAt: string;
}

export default function Home() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [isAdmin, setIsAdmin] = useState(false);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      const userAddress = user.wallet.address.toLowerCase();
      const adminAddresses = adminsData.adminWallets.map(w => w.address.toLowerCase());
      const adminStatus = adminAddresses.includes(userAddress);
      setIsAdmin(adminStatus);

      // Fetch creations if user is admin
      if (adminStatus) {
        fetchCreations();
      }
    } else {
      setIsAdmin(false);
    }
  }, [authenticated, user]);

  const fetchCreations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/creations?limit=20');
      if (!response.ok) throw new Error('Failed to fetch creations');
      const data = await response.json();
      setCreations(data.docs || []);
    } catch (error) {
      console.error('Error fetching creations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 max-w-md w-full shadow-2xl">
          <h1 className="text-white text-2xl font-semibold mb-8 tracking-tight text-center">
            SOLIENNE
          </h1>

          <button
            onClick={login}
            className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 max-w-md w-full shadow-2xl">
          <h1 className="text-white text-2xl font-semibold mb-8 tracking-tight text-center">
            SOLIENNE
          </h1>

          <div className="mb-6">
            <p className="text-neutral-300 text-base mb-2">
              Access Denied
            </p>
            <p className="text-neutral-500 text-sm">
              This wallet does not have admin privileges.
            </p>
          </div>

          <button
            onClick={logout}
            className="w-full bg-neutral-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-neutral-700 transition-colors border border-neutral-700"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-white text-3xl font-semibold tracking-tight">
            SOLIENNE
          </h1>
          <button
            onClick={logout}
            className="bg-neutral-900 text-white py-2 px-6 rounded-lg font-medium hover:bg-neutral-800 transition-colors border border-neutral-800"
          >
            Disconnect
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-white text-xl font-semibold mb-2">
            Recent Creations
          </h2>
          <p className="text-neutral-400 text-sm">
            Last 20 creations from Eden
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-neutral-400">Loading creations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {creations.map((creation) => (
              <div
                key={creation._id}
                className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-700 transition-colors cursor-pointer"
              >
                {creation.url || creation.thumbnail ? (
                  <img
                    src={creation.url || creation.thumbnail}
                    alt="Creation"
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square bg-neutral-800 flex items-center justify-center">
                    <span className="text-neutral-600 text-sm">No image</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && creations.length === 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
            <p className="text-neutral-400 text-base">
              No creations found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
