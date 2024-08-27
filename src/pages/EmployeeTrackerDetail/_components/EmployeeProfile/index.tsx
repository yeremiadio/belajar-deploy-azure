import { FC } from "react";

import { AvatarImage, MailIcon, PhoneIcon } from "@/assets/images";

import { TEmployeeDetail } from "@/types/api/employeeTracker";

import Card from "@/components/Card";

type IconButtonProps = {
  icon: string;
  type: "Phone" | "Mail";
  data?: TEmployeeDetail;
};

const IconButton: FC<IconButtonProps> = ({ icon, type, data }) => {
  let link = "#";
  if (type === "Mail" && data?.email) {
    link = `mailto:${data.email}`;
  } else if (type === "Phone" && data?.phoneNumber) {
    link = `https://wa.me/${data.phoneNumber}`;
  }

  return (
    <a
      href={link}
      className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full bg-rs-v2-navy-blue transition-all duration-300 ease-in-out hover:bg-rs-v2-dark-grey">
      <img
        src={icon}
        alt={type}
        className="h-[18px] w-[18px]"
      />
    </a>
  );
};

type EmployeeProfileProps = {
  data?: TEmployeeDetail;
};

const EmployeeProfile: FC<EmployeeProfileProps> = ({ data }) => {
  return (
    <Card className="flex flex-col justify-between p-5">
      <img
        src={AvatarImage}
        alt="Avatar Image"
        className="mx-auto h-auto w-full max-w-[100px] rounded-full"
      />
      <div className="flex w-full flex-col gap-2 rounded-xl bg-rs-v2-galaxy-blue p-3 px-6 text-center">
        <span className="text-lg font-bold">{data?.employeeName || "employeeName"}</span>
        <span className="text-sm">{data?.employeeId || "employeeId"}</span>
        <div className="my-2 h-[1px] w-full bg-rs-v2-gunmetal-blue"></div>
        <span className="text-sm">{data?.email || "email"}</span>
        <span className="text-sm">{data?.phoneNumber || "phoneNumber"}</span>
        <div className="mx-auto flex flex-row gap-4">
          <div className="mx-auto flex flex-row gap-4">
            <IconButton
              icon={PhoneIcon}
              type="Phone"
              data={data}
            />
            <IconButton
              icon={MailIcon}
              type="Mail"
              data={data}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmployeeProfile;
