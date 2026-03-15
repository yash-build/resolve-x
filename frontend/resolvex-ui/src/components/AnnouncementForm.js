import React, { useState } from "react";

import { createAnnouncement } from "../services/announcementService";

/*
====================================================
ANNOUNCEMENT FORM
====================================================

Used by admins to post announcements.
*/

const AnnouncementForm = () => {

  const [title, setTitle] = useState("");

  const [message, setMessage] = useState("");

  const [targetAudience, setTargetAudience] = useState("all");

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setSubmitting(true);

      await createAnnouncement(
        title,
        message,
        targetAudience
      );

      alert("Announcement posted!");

      setTitle("");

      setMessage("");

    } catch (error) {

      alert("Failed to create announcement");

    } finally {

      setSubmitting(false);

    }

  };

  return (

    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-xl font-bold mb-4">
        Post Announcement
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Announcement title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Announcement message"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          rows="4"
          className="w-full border p-2 rounded"
        />

        <select
          value={targetAudience}
          onChange={(e) =>
            setTargetAudience(e.target.value)
          }
          className="w-full border p-2 rounded"
        >

          <option value="all">All Users</option>
          <option value="students">Students</option>
          <option value="committee">Committee</option>

        </select>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >

          {submitting
            ? "Posting..."
            : "Post Announcement"}

        </button>

      </form>

    </div>

  );

};

export default AnnouncementForm;