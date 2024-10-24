import React from 'react';
import Drawer from '../components/Drawer';
import Navbar from '../components/Navbar';
import profilePic from '../assets/react.svg';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Days, Months } from '../../ts/types';

const Notification: React.FC = () => {
  const pageName = "Notification";
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const notifications = [{
    profilePic: profilePic,
    title: "Notification title",
    sentDate: new Date(),
    isRead: false
  },
  {
    profilePic: profilePic,
    title: "Notification title2",
    sentDate: yesterday,
    isRead: true
  }
  ]
  return (
    <>
      <div className="flex h-screen">
        <Drawer />

        <div className="flex-grow bg-gray-100 dark:bg-gray-900 p-6">
          <Navbar pageName={pageName} />

          <div className="w-full bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex justify-between items-center rounded mt-5">
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">Notifications: ({notifications?.filter(
              (notification) => !notification.isRead
            ).length}) unread</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md">Mark all as read</button>
          </div>

          <div className="w-full bg-white dark:bg-gray-800 shadow-md px-6 py-4 justify-between items-center rounded mt-5">
            {(() => {
              const groupedNotifications = notifications.reduce((acc, notification) => {
                const now = new Date();
                const sentDate = new Date(notification.sentDate);
                const diffInDays = Math.floor((now.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24));
                
                let group = '';
                if (diffInDays === 0) {
                  group = "Today";
                } else {
                  group = `${yesterday.getDay()} ${Days[yesterday.getDay()]}  ${Months[yesterday.getMonth()]}, ${yesterday.getFullYear()}`;
                }

                if (!acc[group]) {
                  acc[group] = [];
                }
                acc[group].push(notification);
                return acc;
              }, {} as Record<string, typeof notifications>);

              return Object.entries(groupedNotifications).map(([group, notifications]) => (
                <div key={group}>
                  <div className="flex justify-between items-center mt-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{group}</h2>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500" />
                      <p className="text-gray-800 dark:text-gray-200">Select all</p>
                    </div>
                  </div>

                  {notifications.map((notification, index) => (
                    <div key={index} className={`flex items-center space-x-4 py-4 border-b border-gray-200 dark:border-gray-700 rounded px-5 ${!notification.isRead ? 'bg-blue-950' : ''}`}>
                      <img src={notification.profilePic} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                      <div className="flex-grow">
                        <p className="text-gray-800 dark:text-gray-200">{notification.title}</p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {(() => {
                            const now = new Date().getTime();
                            const sentTime = notification.sentDate.getTime();
                            const diffInMinutes = Math.floor((now - sentTime) / (1000 * 60));
                            if (diffInMinutes < 60) {
                              return `${diffInMinutes} minutes ago`;
                            } else if (diffInMinutes < 1440) {
                              const diffInHours = Math.floor(diffInMinutes / 60);
                              return `${diffInHours} hours ago`;
                            } else {
                              const diffInDays = Math.floor(diffInMinutes / 1440);
                              return `${diffInDays} days ago`;
                            }
                          })()}
                        </p>
                      </div>
                      {!notification.isRead && <div className="h-2 w-2 bg-blue-500 rounded-full"></div>}
                      <BsThreeDotsVertical className="h-6 w-6 text-gray-700 dark:text-gray-200 cursor-pointer" />
                    </div>
                  ))}
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
