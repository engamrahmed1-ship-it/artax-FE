import React, { useMemo } from 'react';

const Opportunities = ({ opportunities = [], totalCount = 0 }) => {

  // --- TEST DATA (KEEP FOR DEV / FALLBACK) ---
  const oppData = [
    { id: 1, name: 'Cloud Migration Phase 2', value: 12000, probability: 0.75, stage: 'NEGOTIATION' },
    { id: 2, name: 'Security Audit Service', value: 4500, probability: 0.4, stage: 'DISCOVERY' },
    { id: 3, name: 'Managed Services Annual', value: 25000, probability: 0.9, stage: 'CLOSING' },
  ];

  // --- NORMALIZE API OPPORTUNITIES ---
  const normalizedApiData = useMemo(() => {
    if (!Array.isArray(opportunities)) return [];

    return opportunities.map(o => ({
      id: o.opportunityId,
      name: o.name || 'Unnamed Opportunity',
      value: o.amount || 0,
      probability: o.probability ?? 0,
      stage: o.stage || 'UNKNOWN',
      createdAt: o.createdAt,
      closeDate: o.closeDate
    }));
  }, [opportunities]);

  // --- MERGE TEST + API DATA ---
  const combinedOpportunities = useMemo(
    () => [...oppData, ...normalizedApiData],
    [normalizedApiData]
  );

  const formatCurrency = (amount) =>
    amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  const formatProbability = (p) => `${Math.round(p * 100)}%`;

  return (
    <div className="tab-panel-container">
      <div className="panel-header">
        <h3>
          Sales Opportunities
          <span className="count-badge">
            {combinedOpportunities.length}
          </span>
        </h3>

        <button className="btn-primary">
          + New Opportunity
        </button>
      </div>

      {combinedOpportunities.length === 0 ? (
        <div className="empty-state">
          No opportunities available
        </div>
      ) : (
        <div className="opportunity-grid">
          {combinedOpportunities.map(opp => {
            const probabilityPct = formatProbability(opp.probability);

            return (
              <div key={opp.id} className="opp-card">
                <div className="opp-value">
                  {formatCurrency(opp.value)}
                </div>

                <h4 className="opp-name">{opp.name}</h4>

                <div className="opp-details">
                  <span>
                    Stage: <strong>{opp.stage}</strong>
                  </span>
                  <span>
                    Probability: <strong>{probabilityPct}</strong>
                  </span>
                </div>

                <div className="probability-bar-bg">
                  <div
                    className="probability-bar-fill"
                    style={{ width: probabilityPct }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Opportunities;
