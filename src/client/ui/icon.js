import React from "react";
import feather from "feather-icons";

const Icon = props => {
  const { type } = props;
  const size = props.size || 24;

  return (
    <span
      className="icon"
      style={{ cursor: props.cursorPointer ? "pointer" : "" }}
      dangerouslySetInnerHTML={{
        __html: feather.icons[type].toSvg({ width: size, height: size })
      }}
    />
  );
};

export default Icon;
