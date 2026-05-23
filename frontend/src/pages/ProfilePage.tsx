import logo from "../assets/ajizor-logo-horizontal.svg";
import { SectionTitle } from "../components/SectionTitle";
import { useAuth } from "../contexts/AuthContext";
import { useLocale } from "../contexts/LocaleContext";

export function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLocale();
  if (!user) return null;
  const provider = user.role !== "user";

  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow={provider ? t("profile.provider") : t("profile.traveler")}
        title={provider ? user.name : user.name}
        action={user.role}
      />
      <div className="profile-card-main">
        <img src={logo} alt="AJIZOR logo" />
        <div>
          <h2>{provider ? `${user.providerType} ${t("profile.providerShort")}` : t("profile.coastalTraveler")}</h2>
          <p>
            {provider
              ? t("profile.providerText")
              : t("profile.travelerText")}
          </p>
          <div className="tag-row large">
            <span>{user.email}</span>
            <span>{t("common.verified")}</span>
            <span>{t("common.algerianCoast")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
