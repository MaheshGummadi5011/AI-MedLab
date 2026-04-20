import React from "react";
import { Link } from "react-router-dom";

const EmptyView = (props) => {
  const { icon, msg, link, btnText } = props;

  return (
    <>
      <div className="dark:text-yellow-1">
        <div>{icon}</div>
        <h2>{msg}</h2>
        {link && (
          <Link
            to={link}
            className="btn dark:bg-blue-24 dark:hover:bg-blue-31 dark:disabled:bg-blue-24"
          >
            {btnText}
          </Link>
        )}
      </div>
    </>
  );
};

export default EmptyView;
