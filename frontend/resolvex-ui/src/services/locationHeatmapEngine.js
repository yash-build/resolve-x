/*
====================================================
RESOLVEX LOCATION HEATMAP ENGINE
====================================================

Purpose:

Convert issue data into campus location
hotspot statistics.

Used for:

• campus heatmap
• problem clustering
• hotspot detection
• predictive analytics
*/

export const calculateLocationHeatmap = (issues) => {

  const locationStats = {};

  issues.forEach((issue) => {

    const location = issue.location || "Unknown";

    if (!locationStats[location]) {

      locationStats[location] = {
        totalIssues: 0,
        pending: 0,
        resolved: 0
      };

    }

    locationStats[location].totalIssues++;

    if (issue.status === "resolved") {

      locationStats[location].resolved++;

    } else {

      locationStats[location].pending++;

    }

  });

  const heatmapData = [];

  Object.keys(locationStats).forEach((location) => {

    const data = locationStats[location];

    let severityLevel = "low";

    if (data.totalIssues > 10) {

      severityLevel = "high";

    } else if (data.totalIssues > 5) {

      severityLevel = "medium";

    }

    heatmapData.push({

      location,

      totalIssues: data.totalIssues,

      pendingIssues: data.pending,

      resolvedIssues: data.resolved,

      severityLevel

    });

  });

  return heatmapData;

};