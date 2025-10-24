import React from "react";

type UserNotificationProps = {
    content: string;
    size?: "regular" | "small";
    position?: "top-right" | "top-left";
};

const UserNotification: React.FC<UserNotificationProps> = ({
       content,
       size = "regular",
       position = "top-right"
   }) => {
    return (
        <span className={`UserNotification ${size} ${position}`}>{content}</span>
    );
};

export default UserNotification;