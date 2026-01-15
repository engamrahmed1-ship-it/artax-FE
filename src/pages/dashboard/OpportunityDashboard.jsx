import React, { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';

const OpportunityDashboard = ({ opportunities = [] }) => {
  const stats = useMemo(() => {
    const stages = ['PROSPECT', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'WON'];
    const groups = stages.reduce((acc, stage) => {
      acc[stage] = { count: 0, total: 0 };
      return acc;
    }, {});

    let totalPipelineValue = 0;
    let weightedValue = 0;

    opportunities.forEach(opp => {
      const stage = opp.stage?.toUpperCase();
      if (groups[stage]) {
        groups[stage].count += 1;
        groups[stage].total += opp.amount || 0;
      }
      totalPipelineValue += opp.amount || 0;
      weightedValue += (opp.amount * (opp.probability / 100)) || 0;
    });

    return { groups, totalPipelineValue, weightedValue, stages };
  }, [opportunities]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <BarChart3 className="text-blue-600" size={20} />
        <h2 className="text-lg font-bold text-gray-800">Sales Pipeline Forecast</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Total Pipeline</p>
          <p className="text-2xl font-black text-blue-900">${stats.totalPipelineValue.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Weighted Forecast</p>
          <p className="text-2xl font-black text-emerald-900">${stats.weightedValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        {stats.stages.map((stage) => {
          const group = stats.groups[stage];
          const percentage = stats.totalPipelineValue > 0 ? (group.total / stats.totalPipelineValue) * 100 : 0;
          return (
            <div key={stage}>
              <div className="flex justify-between text-xs mb-1 font-medium text-gray-600 uppercase tracking-tighter">
                <span>{stage} ({group.count})</span>
                <span>${group.total.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-700" 
                  style={{ width: `${percentage}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpportunityDashboard;