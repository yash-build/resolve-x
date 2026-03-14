import React from "react"

function AIPredictionPanel({prediction}){

if(!prediction) return null

return(

<div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">

<h3 className="font-semibold text-indigo-800 mb-3">
🤖 AI Issue Detection
</h3>

<div className="space-y-2 text-sm">

<div>
<strong>Category:</strong> {prediction.category}
</div>

<div>
<strong>Committee:</strong> {prediction.committee}
</div>

<div>
<strong>Severity:</strong> {prediction.severity}
</div>

<div>
<strong>Confidence:</strong> {(prediction.confidence*100).toFixed(0)}%
</div>

<div>
<strong>Matched Keywords:</strong>{" "}
{prediction.matchedKeywords.join(", ")}
</div>

</div>

</div>

)

}

export default AIPredictionPanel