import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  subscribeToNotifications,
  markNotificationAsRead
} from "../services/notificationService";

/*
============================================================
RESOLVEX NOTIFICATIONS PAGE
============================================================

Purpose
-------

Displays user notifications such as:

• Issue submitted
• Issue resolved
• Assignment updates
• Announcements

Architecture
------------

Firestore Notifications
        ↓
subscribeToNotifications()
        ↓
Realtime UI updates
*/

const Notifications = () => {

  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  /*
  ============================================================
  REALTIME SUBSCRIPTION
  ============================================================
  */

  useEffect(() => {

    if (!user) return;

    const unsubscribe = subscribeToNotifications(

      user.uid,

      (data) => {

        setNotifications(data);

        setLoading(false);

      }

    );

    return () => unsubscribe();

  }, [user]);

  /*
  ============================================================
  FORMAT TIME
  ============================================================
  */

  const formatTime = (timestamp) => {

    if (!timestamp || !timestamp.seconds) return "";

    return new Date(timestamp.seconds * 1000).toLocaleString();

  };

  /*
  ============================================================
  MARK READ
  ============================================================
  */

  const handleRead = async (id) => {

    try {

      await markNotificationAsRead(id);

    } catch (err) {

      console.error("Notification read error:", err);

    }

  };

  /*
  ============================================================
  LOADING
  ============================================================
  */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <div className="flex flex-col items-center gap-4">

          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />

          <p className="text-gray-600">

            Loading notifications...

          </p>

        </div>

      </div>

    );

  }

  /*
  ============================================================
  UI
  ============================================================
  */

  return (

    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-gray-900">

          Notifications

        </h1>

        <p className="text-gray-500">

          Updates related to your issues and campus activity

        </p>

      </div>

      {/* NOTIFICATION LIST */}

      <div className="space-y-4">

        {notifications.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">

            No notifications yet.

          </div>

        ) : (

          notifications.map((n) => (

            <div
              key={n.id}
              className={`bg-white border rounded-xl p-5 flex justify-between items-start ${
                n.read
                  ? "border-gray-200"
                  : "border-indigo-400"
              }`}
            >

              <div className="space-y-1">

                <p className="text-gray-900">

                  {n.message}

                </p>

                <p className="text-xs text-gray-500">

                  {formatTime(n.createdAt)}

                </p>

              </div>

              {!n.read && (

                <button
                  onClick={() => handleRead(n.id)}
                  className="bg-indigo-600 text-white text-sm px-3 py-1 rounded-lg hover:bg-indigo-700"
                >

                  Mark Read

                </button>

              )}

            </div>

          ))

        )}

      </div>

      {/* DEBUG */}

      <div className="text-xs text-gray-400">

        <p>Total Notifications: {notifications.length}</p>

      </div>

    </div>

  );

};

export default Notifications;

