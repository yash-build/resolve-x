import React from "react";

/*
====================================================
RESOLVEX CAMPUS HEATMAP PANEL
====================================================

Displays campus issue hotspots.

Severity levels:

🟢 Low
🟠 Medium
🔴 High
*/

const HeatmapPanel = ({ heatmapData }) => {

  const getColor = (level) => {

    if (level === "high") return "bg-red-500";

    if (level === "medium") return "bg-orange-400";

    return "bg-green-500";

  };

  const getLabel = (level) => {

    if (level === "high") return "High Issue Density";

    if (level === "medium") return "Moderate Issues";

    return "Low Issues";

  };

  return (

    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-2xl font-bold mb-4">
        Campus Issue Heatmap
      </h2>

      <div className="grid grid-cols-3 gap-4">

        {heatmapData.map((item) => (

          <div
            key={item.location}
            className={`p-4 rounded text-white ${getColor(
              item.severityLevel
            )}`}
          >

            <h3 className="font-semibold text-lg">
              {item.location}
            </h3>

            <p>
              {item.totalIssues} issues
            </p>

            <p className="text-sm">
              {getLabel(item.severityLevel)}
            </p>

            <div className="text-xs mt-2">

              <p>Pending: {item.pendingIssues}</p>

              <p>Resolved: {item.resolvedIssues}</p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default HeatmapPanel;