import { PopupWidget } from "react-calendly";

const CalendlyBadge = () => {
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/arioteimuri/new-meeting";
  const primaryColor = import.meta.env.VITE_BRAND_PRIMARY || "f97316";
  const textColor = import.meta.env.VITE_BRAND_TEXT || "f8fafc";
  const bgColor = import.meta.env.VITE_BRAND_BG || "0b1120";

  return (
    <PopupWidget
      url={calendlyUrl}
      rootElement={document.getElementById("root")!}
      text="Schedule time with me"
      textColor={`#${textColor}`}
      color={`#${primaryColor}`}
      branding={false}
    />
  );
};

export default CalendlyBadge;
