import React from "react";
import PageHeader from "../../hooks/PageHeader/PageHeader";
import "./Dashboard.css";

const stats = [
  {
    title: "Total Admins",
    value: 265,
    change: "+ 11.01%",
    arrow: "↑",
  },
  {
    title: "Total Active Users",
    value: "1,024",
    change: "+ 8.32%",
    arrow: "↑",
  },
  {
    title: "New Signups",
    value: 89,
    change: "+ 3.15%",
    arrow: "↑",
  },
  {
    title: "Active Sessions",
    value: 412,
    change: "+ 5.04%",
    arrow: " ↑",
  },
];

const Dashboard = () => {
  return (
    <div className="ml-[240px] mt-[50px] mr-[250px] w-[calc(100%-240px)]">
      
      <header className="px-[12px] mx-[6px] py-[6px]">
        <div className="flex flex-wrap justify-between p-[8px] gap-6 font-Inter rounded-[20px]">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex-1 max-w-xs rounded-xl shadow p-4 ${
                index === 1 || index === 3 ? "bg-[#2D4CCA2B]" : "bg-[#FFF1CF]"
              }`}
            >
              <p className="font-normal not-italic text-[14px] leading-[20px] tracking-[0px]">
                {stat.title}
              </p>
              <div className="flex justify-between items-center mt-2">
                <h2 className="text-2xl font-medium text-white">
                  {stat.value}
                </h2>
                <p className="text-[12px] leading-[16px] font-normal">
                  {stat.change} {stat.arrow}
                </p>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Stats and graph Area */}
      <main className="flex mx-6 p-4 border-[0.5px] border-[#F5EFFC] rounded-2xl">
        
        <img  src="/statistic.png" alt="" className="h-60 w-120" />

        <section className="grid gap-5">
          <div className="pl-[60px]">
            <h1 className=" font-medium text-base">Weekly</h1>
            <div className="flex gap-7 font-cario text-lg font-normal text-[#A098AE]" >
              <header>
              <h2>This Week</h2>
              <span className="font-bold size-2xl text-[#2D4CCA]" >+ 20%</span>
              </header>
              <header>
              <h2>Last Week</h2>
              <span className="font-bold size-2xl text-[#F8C140]" >+ 13%</span>
              </header>
            </div>

          </div>
          <div className="pl-[60px]">
          <img src="/impression.png" alt="" className="h-[150px]" />

          </div>
        </section>
      </main>

        <footer className="flex gap-4 justify-around my-[10px] px-5 mb-[5px]">
          <div className="flex gap-[10px] w-1/2 bg-[#FCFCFC] p-[10px] rounded-[40px]">
            <img src="/fabicon.png" alt="" />
            <div className="flex flex-col gap-[16px]">
              <h1 className="text-[#363B64] font-Poppins text-lg font-bold ">Upgrade Your Storage</h1>
              <p className="text-[#A098AE] text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, a?</p>
              <button className="w-[140px] h-[48px] bg-[#DBE1F6] font-Poppins font-semibold text-sm text-[#FCFCFC]">Upgarde</button>
            </div>
          </div>
          <div className="flex flex-col bg-[#FCFCFC] w-1/2 gap-[10px] p-[16px] rounded-[40px]">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">7,899</h1>
              <button className="bg-[#DBE1F6] text-[#FCFCFC] w-[186px] h-[48px]">+ Compose Email</button>
            </div>
            <h3 className="font-Poppins font-semibold text-lg">Total emails Subcriber</h3>
            <p className="font-Poppins text-[#A098AE] font-normal text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat odio ipsam animi illo eius vitae?</p>
          </div>
        </footer>

    </div>
  );
};

export default Dashboard;
