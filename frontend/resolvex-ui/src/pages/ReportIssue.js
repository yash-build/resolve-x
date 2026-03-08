import { useState } from "react";

function ReportIssue({ addIssue }) {

  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {

    e.preventDefault();

    const newIssue = {
      id: Date.now(),
      location,
      category,
      description,
      status: "Pending",
      votes: 0,
      image
    };

    addIssue(newIssue);

    setLocation("");
    setDescription("");
    setImage(null);

    alert("Issue submitted successfully!");
  };

  return (

    <div style={{padding:"20px"}}>

      <h2>Report an Issue</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <br/><br/>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Hostel</option>
          <option>Hygiene</option>
          <option>Safety</option>
        </select>

        <br/><br/>

        <textarea
          placeholder="Describe the issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br/><br/>

        <input
          type="file"
          onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
        />

        <br/><br/>

        <button type="submit">Submit Issue</button>

      </form>

    </div>

  );
}

export default ReportIssue;