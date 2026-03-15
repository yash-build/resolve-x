/*
====================================================
RESOLVEX ANALYTICS ENGINE
====================================================

This module calculates operational analytics for
the admin dashboard.

Metrics supported:

• Issues per committee
• Average resolution time
• Committee efficiency score
• Category distribution
*/

export const calculateCommitteeAnalytics = (issues) => {

  const committeeStats = {};

  issues.forEach((issue) => {

    const committee = issue.assignedCommittee || "Unassigned";

    if (!committeeStats[committee]) {

      committeeStats[committee] = {
        totalIssues: 0,
        resolvedIssues: 0,
        totalResolutionTime: 0
      };

    }

    committeeStats[committee].totalIssues++;

    if (issue.status === "resolved") {

      committeeStats[committee].resolvedIssues++;

      if (issue.createdAt && issue.resolvedAt) {

        const created =
          issue.createdAt.seconds * 1000;

        const resolved =
          issue.resolvedAt.seconds * 1000;

        const resolutionTime =
          (resolved - created) / (1000 * 60 * 60 * 24);

        committeeStats[committee].totalResolutionTime +=
          resolutionTime;

      }

    }

  });

  const analytics = [];

  Object.keys(committeeStats).forEach((committee) => {

    const data = committeeStats[committee];

    const avgResolutionTime =
      data.resolvedIssues === 0
        ? 0
        : data.totalResolutionTime / data.resolvedIssues;

    const efficiency =
      data.totalIssues === 0
        ? 0
        : (data.resolvedIssues / data.totalIssues) * 100;

    analytics.push({
      committee,
      totalIssues: data.totalIssues,
      resolvedIssues: data.resolvedIssues,
      avgResolutionTime: avgResolutionTime.toFixed(2),
      efficiencyScore: efficiency.toFixed(1)
    });

  });

  return analytics;

};



export const calculateCategoryDistribution = (issues) => {

  const categoryCounts = {};

  issues.forEach((issue) => {

    const category = issue.category || "Other";

    if (!categoryCounts[category]) {

      categoryCounts[category] = 0;

    }

    categoryCounts[category]++;

  });

  return categoryCounts;

};