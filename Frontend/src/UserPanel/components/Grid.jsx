import React from "react";

function Grid() {
  // Create an array of 364 elements
  const blocks = Array.from({ length: 364 }, () => {
    const rand = Math.random();
    let opacityClass = "";
    if (rand > 0.85) opacityClass = "bg-secondary";
    else if (rand > 0.65) opacityClass = "bg-secondary/50";
    else if (rand > 0.4) opacityClass = "bg-secondary/20";
    else opacityClass = "bg-white/5";

    return (
      <div
        key={Math.random()} // unique key for each element
        className={`size-3.5 rounded-[2px] ${opacityClass} hover:ring-2 hover:ring-white/20 cursor-pointer transition-all`}
      />
    );
  });

  return <div className="flex flex-wrap gap-1.5 w-full">{blocks}</div>;
}

export default Grid;
