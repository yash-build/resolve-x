import React, { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  subscribeToNotifications,
  markNotificationAsRead
} from "../services/notificationService";

const Notifications = () => {

  const { currentUser } = useAuth();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    if (!currentUser) return;

    const unsubscribe = subscribeToNotifications(

      currentUser.uid,

      (data) => {

        setNotifications(data);

      }

    );

    return () => unsubscribe();

  }, [currentUser]);

  const handleRead = async (notificationId) => {

    await markNotificationAsRead(notificationId);

  };

  return (

    <div className="max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Notifications
      </h1>

      {notifications.length === 0 && (

        <p className="text-gray-500">
          No notifications yet.
        </p>

      )}

      <div className="space-y-4">

        {notifications.map((notification) => (

          <div
            key={notification.id}
            className={`p-4 rounded shadow ${
              notification.read
                ? "bg-gray-100"
                : "bg-blue-100"
            }`}
          >

            <p>
              {notification.message}
            </p>

            {!notification.read && (

              <button
                onClick={() => handleRead(notification.id)}
                className="text-sm text-indigo-600 mt-2"
              >
                Mark as read
              </button>

            )}

          </div>

        ))}

      </div>

    </div>

  );

};

export default Notifications;