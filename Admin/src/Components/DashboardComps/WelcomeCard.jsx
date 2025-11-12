import React from "react";

const WelcomeCard = ({ storeName, earnings, growthPercentage }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{storeName}</h2>
          <p className="text-slate-400 text-sm mb-4">Congratulations 🎉</p>

          <div className="text-4xl font-bold text-purple-400 mb-6">
            {earnings} INR
          </div>

          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            VIEW SALES
          </button>
        </div>

        <div className="text-6xl">🏆</div>
      </div>
    </div>
  );
};

export default WelcomeCard;
