"use client";
import PageSection from "../PageSection/PageSection";
import Tabs from "../Tabs/Tabs";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { useState } from "react";
import ProfileDetails from "./ProfileDetails";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { FaInfoCircle } from "@react-icons/all-files/fa/FaInfoCircle";
import { IoMdSettings } from "@react-icons/all-files/io/IoMdSettings";

const UpdateProfile = dynamic(() => import("./UpdateProfile"));
const TabsSkeleton = dynamic(() => import("../Tabs/TabsSkeleton"));
const ProfileDetailsSkeleton = dynamic(
  () => import("./ProfileDetailsSkeleton"),
);

const ProfileSettings = () => {
  const t = useTranslations("Account");
  const { user, userStatusLoading } = useSelector(
    (state: RootState) => state.authReducer,
  );

  const [activeTab, setActiveTab] = useState(t("DetailsTab"));
  const tabs = [
    {
      name: t("DetailsTab"),
      icon: <FaInfoCircle />,
      content: <ProfileDetails setActiveTab={setActiveTab} user={user} />,
    },
    {
      name: t("SettingsTab"),
      icon: <IoMdSettings className="text-lg" />,
      content: <UpdateProfile user={user} />,
    },
  ];

  if (userStatusLoading) {
    return (
      <PageSection className="!px-2 !py-10">
        <TabsSkeleton length={tabs.length} />
        <ProfileDetailsSkeleton />
      </PageSection>
    );
  }

  return (
    <>
      <PageSection className="!px-2 !py-10">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </PageSection>
    </>
  );
};

export default ProfileSettings;
