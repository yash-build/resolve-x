import { useNavigate } from "react-router-dom";

function QuickActionsPanel(){

const navigate = useNavigate();

return(

<div className="grid grid-cols-4 gap-6">

<button
onClick={()=>navigate("/report")}
className="bg-indigo-600 text-white p-6 rounded-xl"
>
Report Issue
</button>

<button
onClick={()=>navigate("/feed")}
className="bg-indigo-600 text-white p-6 rounded-xl"
>
Campus Issues
</button>

<button
onClick={()=>navigate("/my-issues")}
className="bg-indigo-600 text-white p-6 rounded-xl"
>
My Issues
</button>

<button
onClick={()=>navigate("/leaderboard")}
className="bg-indigo-600 text-white p-6 rounded-xl"
>
Leaderboard
</button>

</div>

);

}

export default QuickActionsPanel;