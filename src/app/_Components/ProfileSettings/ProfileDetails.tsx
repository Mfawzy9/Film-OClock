import { User } from "@/lib/Redux/localSlices/authSlice";
import Title from "../Title/Title";
import { useTranslations } from "next-intl";

interface ProfileDetailsProps {
  user: User | null;
  setActiveTab: (tabName: string) => void;
}

const ProfileDetails = ({ user, setActiveTab }: ProfileDetailsProps) => {
  const t = useTranslations("Account");
  return (
    <main>
      <div className="bg-black shadow-blueGlow shadow-gray-500/60 mt-4 overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <Title title={t("DetailsPart.ProfileDetails")} />

          <p className="mt-1 max-w-2xl text-sm">
            {t("DetailsPart.UserInformations")}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            {/* user name */}
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium">
                {t("DetailsPart.UserName")}
              </dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                {user?.displayName}
              </dd>
            </div>
            {/* email address */}
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium">
                {t("DetailsPart.EmailAddress")}
              </dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                {user?.email}
              </dd>
            </div>
            {/* email status */}
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium">
                {t("DetailsPart.EmailStatus")}
              </dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                {user?.emailVerified ? (
                  <span
                    className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full
                      bg-green-100 text-green-800"
                  >
                    {t("DetailsPart.Verified")}
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="px-2 py-0.5 items-center gap-2 text-xs leading-5 font-semibold rounded-full
                        bg-red-100 text-red-800"
                    >
                      {t("DetailsPart.NotVerified")}
                    </span>
                    <button
                      onClick={() => setActiveTab(t("SettingsTab"))}
                      className="text-blue-400 hover:underline"
                    >
                      {t("DetailsPart.Verify")}
                    </button>
                  </div>
                )}
              </dd>
            </div>
            {/* created at */}
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium">
                {t("DetailsPart.CreatedAt")}
              </dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                {user?.creationTime}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
};

export default ProfileDetails;
