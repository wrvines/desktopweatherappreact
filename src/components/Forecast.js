import React from "react";

function Forecast({ high, low, wind, conditions, image, time, index }) {
  const unixDate = new Date(time * 1000);
  let options = { weekday: "long", day: "numeric", month: "long" };
  let date = unixDate.toLocaleDateString("en-US", options);

  return (
    <div>
      <div className="py-8 flex flex-col justify-around items-center">
        <p className="font-bold text-xl pb-2">{date}</p>
        <p>High: {high}</p>
        <p>Low: {low}</p>
        <p>Wind: {wind}</p>
        <div className="flex gap-2 justify-center items-center">
          <img
            className="w-[6rem] h-[6rem] md:w-[12rem] md:h-[12rem]"
            src={`http://openweathermap.org/img/wn/${image}@2x.png`}
            alt="/"
          />
          <p className=" -rotate-[90deg] ">{conditions}</p>
        </div>
      </div>
    </div>
  );
}

export default Forecast;
