"use client";
import { FaGear } from "react-icons/fa6";
import PageSection from "../PageSection/PageSection";
import Tabs from "../Tabs/Tabs";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import ProfileDetails from "./ProfileDetails";
import MainLoader from "../MainLoader/MainLoader";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const UpdateProfile = dynamic(() => import("./UpdateProfile"));

const ProfileSettings = () => {
  const t = useTranslations("Account");
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state: RootState) => state.authReducer.user);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
      return;
    }
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    checkAuth();
  }, [user]);

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

  if (isLoading) {
    return <MainLoader />;
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
