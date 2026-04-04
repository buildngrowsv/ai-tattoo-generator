"use client";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const choice = localStorage.getItem("cookie_consent");
    if (!choice) setVisible(true);
    else if (choice === "granted" && typeof window.gtag === "function")
      window.gtag("consent", "update", { analytics_storage: "granted" });
  }, []);

  function handleChoice(granted: boolean) {
    const value = granted ? "granted" : "denied";
    localStorage.setItem("cookie_consent", value);
    if (typeof window.gtag === "function")
      window.gtag("consent", "update", { analytics_storage: value });
    setVisible(false);
  }

  if (!visible) return null;
  return (
    <div role="dialog" aria-label="Cookie consent" style={{ position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:"rgba(15,23,42,0.95)",backdropFilter:"blur(8px)",borderTop:"1px solid rgba(148,163,184,0.15)",padding:"1rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"1rem",flexWrap:"wrap",fontSize:"0.9rem",color:"#cbd5e1" }}>
      <span>We use cookies to improve your experience and analyze site traffic. <a href="/privacy" style={{color:"#60a5fa",textDecoration:"underline"}}>Privacy Policy</a></span>
      <button onClick={() => handleChoice(true)} style={{background:"#3b82f6",color:"#fff",border:"none",borderRadius:"6px",padding:"0.5rem 1.25rem",fontWeight:600,cursor:"pointer",fontSize:"0.85rem"}}>Accept</button>
      <button onClick={() => handleChoice(false)} style={{background:"transparent",color:"#94a3b8",border:"1px solid rgba(148,163,184,0.3)",borderRadius:"6px",padding:"0.5rem 1.25rem",fontWeight:500,cursor:"pointer",fontSize:"0.85rem"}}>Decline</button>
    </div>
  );
}
