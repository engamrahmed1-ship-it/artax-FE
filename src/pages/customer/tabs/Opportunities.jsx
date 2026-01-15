
import React, { useMemo, useState } from 'react';
import { BarChart3, Plus, DollarSign, Tag, TrendingUp, ChevronRight } from 'lucide-react';
import OpportunityModel from "../model/OpportunityModel";
import "../css/customerInfo.css"
import styles from "../css/opp.module.css"


const Opportunities = ({ opportunities = [], onSave, onDelete, onRefresh }) => {

  // ... inside Opportunities component
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Handlers
  const handleOpenCreate = () => setIsCreateModalOpen(true);
  const handleOpenDetails = (opp) => setSelectedOpportunity(opp);
  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setSelectedOpportunity(null);
  };


  // --- NORMALIZE API DATA ---
  const normalizedData = useMemo(() => {
    const apiData = Array.isArray(opportunities) ? opportunities.map(o => ({
      id: o.opportunityId,
      name: o.name || 'Unnamed Opportunity',
      amount: o.amount || 0,
      currency: o.currency || 'EGP', // Default to EGP per your entity enhancement
      probability: o.probability ?? 0,
      stage: o.stage || 'UNKNOWN',
      closeDate: o.closeDate
    })) : [];




    // Merging with your Test Data for Dev
    const testData = [
      // { id: '16', name: 'Cloud Migration Phase 2', amount: 12000, currency: 'USD', probability: 75, stage: 'NEGOTIATION', closeDate: '2023-11-15' },
      // { id: '12', name: 'Security Audit Service', amount: 4500, currency: 'USD', probability: 40, stage: 'DISCOVERY' },
      // { id: '20', name: 'Managed Services Annual', amount: 25000, currency: 'USD', probability: 90, stage: 'WON' },
    ];

    return [...testData, ...apiData];
  }, [opportunities]);

  // --- DASHBOARD CALCULATIONS ---
  // --- DASHBOARD CALCULATIONS ---
  const stats = useMemo(() => {
    // 1. Define all possible stages for the grouping/charts
    const allStages = ['PROSPECT', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
    const groups = allStages.reduce((acc, s) => ({ ...acc, [s]: { count: 0, total: 0 } }), {});

    let activePipeline = 0;
    let weightedForecast = 0;
    let totalWonRevenue = 0;

    // Ensure we are iterating over the flat array from your BE
    const opportunityList = Array.isArray(opportunities) ? opportunities : [];

    opportunityList.forEach(opp => {
      const stage = opp.stage?.toUpperCase();
      const amount = Number(opp.amount) || 0;
      const probability = Number(opp.probability) || 0;

      // 2. Always update groups (for the Bar Chart/Stages view)
      if (groups[stage]) {
        groups[stage].count += 1;
        groups[stage].total += amount;
      }

      // 3. APPLY BUSINESS LOGIC (Matches your @Query)
      // Only calculate Pipeline and Weighted if NOT Won or Lost
      if (stage !== 'WON' && stage !== 'LOST') {
        activePipeline += amount;
        weightedForecast += (amount * (probability / 100));
      }

      // 4. Calculate Historical Success (Bonus for UI)
      if (stage === 'WON') {
        totalWonRevenue += amount;
      }
    });

    return {
      groups,
      totalPipeline: activePipeline, // Renamed to match BE logic
      weighted: weightedForecast,     // Renamed to match BE logic
      totalWonRevenue,
      stages: allStages
    };
  }, [opportunities]);

  /**
   * Formats values based on currency type
   * @param {number} amount - The numeric value
   * @param {string} currencyCode - 'EGP' or 'USD'
   */
  const formatCurrency = (amount, currencyCode = 'EGP') => {
    if (amount === undefined || amount === null) return '0.00';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode === 'EGP' ? 'EGP' : 'USD',
      currencyDisplay: 'symbol',
    }).format(amount);
  };

  const formatProbability = (p) => `${Math.round(p * 100)}%`;

  return (
    <div className={styles['opp-container']}>

      <div className={styles['opp-header']}>
        <h3 className={styles['section-title']}>Opportunites</h3>
        <button className={styles['btn-primary']} onClick={handleOpenCreate}>
          <Plus size={18} /> New Opportunity
        </button>

      </div>
      {/* 1. SALES PIPELINE DASHBOARD */}
      <div className={styles['pipeline-dashboard']} >
        <div className={styles['dashboard-header']} >
          <BarChart3 size={20} className="text-blue-600" />
          <h2>Sales Pipeline Forecast</h2>
        </div>

        <div className={styles['stats-grid']}  >
          <div className={`${styles['stat-card']} ${styles['blue']}`}>
            <label>Total Pipeline</label>
            {/* Note: Dashboard uses base currency (EGP) for aggregate view */}
            <p>{formatCurrency(stats.totalPipeline, 'EGP')}</p>
          </div>
          <div className={`${styles['stat-card']} ${styles['green']}`}>
            <label>Weighted Forecast</label>
            <p>{formatCurrency(stats.weighted, 'EGP')}</p>
          </div>
        </div>

        <div className={styles['funnel-section']} >
          {stats.stages.map(stage => {
            const group = stats.groups[stage];
            const percent = stats.totalPipeline > 0 ? (group.total / stats.totalPipeline) * 100 : 0;
            return (
              <div key={stage} className={styles['funnel-row']}>
                <div className={styles['funnel-label']} >
                  <span className={styles['stage-name']} >{stage} ({group.count})</span>
                  <span className={styles['stage-value']}>{formatCurrency(group.total, 'EGP')}</span>
                </div>
                <div className={styles['funnel-bar-bg']} >
                  <div className={styles['funnel-bar-fill']} style={{ width: `${Math.max(percent, 0)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ACTIVE DEALS SECTION */}
      <div className={styles['deals-section']}>
        <div className={styles['section-header']}>
          <h3>Active Deals</h3>
        </div>

        {normalizedData.length === 0 ? (
          <div className={styles['empty-state']}>No opportunities available</div>
        ) : (
          <div className={styles['opportunity-grid']}>
            {normalizedData.map(opp => {
              const probabilityLabel = formatProbability(opp.probability);

              return (
                <div key={opp.id} className={styles['opp-card']} onClick={() => handleOpenDetails(opp)}>
                  <div className={styles['opp-value']}>
                    {formatCurrency(opp.amount, opp.currency)}
                  </div>

                  <h4 className={styles['opp-name']}>{opp.name}</h4>

                  <div className={styles['opp-details']}>
                    <span>
                      <Tag size={14} /> Stage: <strong>{opp.stage}</strong>
                    </span>
                    <span>
                      <TrendingUp size={14} /> Prob: <strong>{probabilityLabel}</strong>
                    </span>
                  </div>

                  <div className={styles['probability-bar-bg']}>
                    <div
                      className={styles['probability-bar-fill']}
                      style={{ width: `${opp.probability}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <OpportunityModel
          mode="create"
          onSave={onSave} // Passed from CustomerInfo
          onClose={handleCloseModals}
        />
      )}

      {selectedOpportunity && (
        <OpportunityModel
          mode="details"
          opportunity={selectedOpportunity}
          onSave={onSave}     // Passed from CustomerInfo
          onDelete={onDelete} // Passed from CustomerInfo
          onClose={handleCloseModals}
        />
      )}
    </div>

  );
};

export default Opportunities;