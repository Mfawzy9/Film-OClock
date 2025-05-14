"use client";
import { FaGear } from "react-icons/fa6";
import PageSection from "../PageSection/PageSection";
import Tabs from "../Tabs/Tabs";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import ProfileDetails from "./ProfileDetails";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

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
      icon: <FaGear />,
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
