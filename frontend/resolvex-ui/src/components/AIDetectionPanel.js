import React from "react"



function AIDetectionPanel({ prediction }) {

  if (!prediction) return null



  return (

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">

      <h3 className="font-semibold text-blue-800 mb-2">
        🤖 AI Issue Detection
      </h3>

      <div className="space-y-2 text-sm">

        <div>
          <strong>Detected Category:</strong> {prediction.category}
        </div>

        <div>
          <strong>Assigned Committee:</strong> {prediction.committee}
        </div>

        <div>
          <strong>Severity Level:</strong> {prediction.severity}
        </div>

        <div>
          <strong>Confidence Score:</strong>{" "}
          {(prediction.confidence * 100).toFixed(0)}%
        </div>

      </div>

    </div>

  )

}

export default AIDetectionPanel