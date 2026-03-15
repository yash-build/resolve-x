import React, { useEffect, useState } from "react";

import { fetchAnnouncements } from "../services/announcementService";

/*
====================================================
ANNOUNCEMENT FEED
====================================================

Displays announcements for users.
*/

const AnnouncementFeed = () => {

  const [announcements, setAnnouncements] =
    useState([]);

  useEffect(() => {

    const loadAnnouncements = async () => {

      const data = await fetchAnnouncements();

      setAnnouncements(data);

    };

    loadAnnouncements();

  }, []);

  return (

    <div className="space-y-4">

      <h2 className="text-xl font-bold">
        Campus Announcements
      </h2>

      {announcements.map((announcement) => (

        <div
          key={announcement.id}
          className="bg-yellow-100 p-4 rounded border"
        >

          <h3 className="font-semibold text-lg">

            {announcement.title}

          </h3>

          <p className="text-sm mt-1">

            {announcement.message}

          </p>

        </div>

      ))}

    </div>

  );

};

export default AnnouncementFeed;