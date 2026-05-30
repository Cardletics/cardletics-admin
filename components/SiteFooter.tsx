"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type LanguageKey =
  | "de"
  | "en"
  | "es"
  | "fr"
  | "pt"
  | "zh"
  | "hi"
  | "ar"
  | "bn"
  | "ru"
  | "ja"
  | "tr"
  | "vi"
  | "id"
  | "ur";

type FooterText = {
  tagline: string;
  home: string;
  impressum: string;
  privacy: string;
  terms: string;
  contact: string;
  since: string;
  copyright: string;
};

const LANGUAGE_STORAGE_KEY = "cardletics_language";

const footerTranslations: Record<LanguageKey, FooterText> = {
  de: {
    tagline: "Tracken • Sammeln • Kämpfen • Handeln",
    home: "Startseite",
    impressum: "Impressum",
    privacy: "Datenschutz",
    terms: "AGB",
    contact: "Kontakt",
    since: "seit 2025",
    copyright: "© Cardletics",
  },
  en: {
    tagline: "Track • Collect • Battle • Trade",
    home: "Home",
    impressum: "Legal notice",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    since: "since 2025",
    copyright: "© Cardletics",
  },
  es: {
    tagline: "Registrar • Coleccionar • Combatir • Comerciar",
    home: "Inicio",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    terms: "Condiciones",
    contact: "Contacto",
    since: "desde 2025",
    copyright: "© Cardletics",
  },
  fr: {
    tagline: "Suivre • Collectionner • Combattre • Échanger",
    home: "Accueil",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    terms: "CGU",
    contact: "Contact",
    since: "depuis 2025",
    copyright: "© Cardletics",
  },
  pt: {
    tagline: "Acompanhar • Colecionar • Batalhar • Trocar",
    home: "Início",
    impressum: "Aviso legal",
    privacy: "Privacidade",
    terms: "Termos",
    contact: "Contato",
    since: "desde 2025",
    copyright: "© Cardletics",
  },
  zh: {
    tagline: "记录 • 收集 • 对战 • 交易",
    home: "首页",
    impressum: "法律声明",
    privacy: "隐私政策",
    terms: "条款",
    contact: "联系",
    since: "始于 2025",
    copyright: "© Cardletics",
  },
  hi: {
    tagline: "ट्रैक • संग्रह • मुकाबला • व्यापार",
    home: "होम",
    impressum: "कानूनी सूचना",
    privacy: "गोपनीयता",
    terms: "शर्तें",
    contact: "संपर्क",
    since: "2025 से",
    copyright: "© Cardletics",
  },
  ar: {
    tagline: "تتبع • اجمع • نافس • تداول",
    home: "الرئيسية",
    impressum: "إشعار قانوني",
    privacy: "الخصوصية",
    terms: "الشروط",
    contact: "اتصال",
    since: "منذ 2025",
    copyright: "© Cardletics",
  },
  bn: {
    tagline: "ট্র্যাক • সংগ্রহ • লড়াই • ট্রেড",
    home: "হোম",
    impressum: "আইনি তথ্য",
    privacy: "গোপনীয়তা",
    terms: "শর্তাবলি",
    contact: "যোগাযোগ",
    since: "২০২৫ থেকে",
    copyright: "© Cardletics",
  },
  ru: {
    tagline: "Отслеживай • Собирай • Сражайся • Торгуй",
    home: "Главная",
    impressum: "Правовая информация",
    privacy: "Конфиденциальность",
    terms: "Условия",
    contact: "Контакты",
    since: "с 2025 года",
    copyright: "© Cardletics",
  },
  ja: {
    tagline: "記録 • 収集 • バトル • 取引",
    home: "ホーム",
    impressum: "法的表示",
    privacy: "プライバシー",
    terms: "利用規約",
    contact: "お問い合わせ",
    since: "2025年から",
    copyright: "© Cardletics",
  },
  tr: {
    tagline: "Takip et • Topla • Savaş • Takas et",
    home: "Ana sayfa",
    impressum: "Yasal bilgiler",
    privacy: "Gizlilik",
    terms: "Şartlar",
    contact: "İletişim",
    since: "2025'ten beri",
    copyright: "© Cardletics",
  },
  vi: {
    tagline: "Theo dõi • Sưu tầm • Đấu • Giao dịch",
    home: "Trang chủ",
    impressum: "Thông tin pháp lý",
    privacy: "Quyền riêng tư",
    terms: "Điều khoản",
    contact: "Liên hệ",
    since: "từ năm 2025",
    copyright: "© Cardletics",
  },
  id: {
    tagline: "Lacak • Koleksi • Bertarung • Berdagang",
    home: "Beranda",
    impressum: "Informasi hukum",
    privacy: "Privasi",
    terms: "Syarat",
    contact: "Kontak",
    since: "sejak 2025",
    copyright: "© Cardletics",
  },
  ur: {
    tagline: "ٹریک • جمع • مقابلہ • تجارت",
    home: "ہوم",
    impressum: "قانونی نوٹس",
    privacy: "رازداری",
    terms: "شرائط",
    contact: "رابطہ",
    since: "2025 سے",
    copyright: "© Cardletics",
  },
};

function isLanguageKey(value: string | null): value is LanguageKey {
  return !!value && Object.prototype.hasOwnProperty.call(footerTranslations, value);
}

export default function SiteFooter() {
  const [language, setLanguage] = useState<LanguageKey>("de");

  useEffect(() => {
    function readSavedLanguage() {
      try {
        const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (isLanguageKey(savedLanguage)) {
          setLanguage(savedLanguage);
        }
      } catch {
        // localStorage can be unavailable in private modes.
      }
    }

    function handleLanguageChange(event: Event) {
      const detail = (event as CustomEvent).detail;
      if (isLanguageKey(detail)) {
        setLanguage(detail);
        return;
      }

      readSavedLanguage();
    }

    readSavedLanguage();
    window.addEventListener("storage", readSavedLanguage);
    window.addEventListener("cardletics-language-change", handleLanguageChange);

    return () => {
      window.removeEventListener("storage", readSavedLanguage);
      window.removeEventListener("cardletics-language-change", handleLanguageChange);
    };
  }, []);

  const t = footerTranslations[language];
  const dir = language === "ar" || language === "ur" ? "rtl" : "ltr";

  return (
    <footer style={{ ...footerWrapStyle, direction: dir }}>
      <div style={footerStyle}>
        <div style={topRowStyle}>
          <div style={brandBlockStyle}>
            <div style={logoStyle}>CARDLETICS</div>
            <p style={taglineStyle}>{t.tagline}</p>
          </div>

          <nav style={navStyle} aria-label="Footer Navigation">
            <Link href="/" style={linkStyle}>
              {t.home}
            </Link>
            <Link href="/impressum" style={linkStyle}>
              {t.impressum}
            </Link>
            <Link href="/datenschutz" style={linkStyle}>
              {t.privacy}
            </Link>
            <Link href="/agb" style={linkStyle}>
              {t.terms}
            </Link>
            <Link href="/kontakt" style={linkStyle}>
              {t.contact}
            </Link>
          </nav>
        </div>

        <div style={dividerStyle} />

        <div style={bottomRowStyle}>
          <span style={smallTextStyle}>{t.since}</span>
          <span style={smallTextStyle}>{t.copyright}</span>
        </div>
      </div>
    </footer>
  );
}

const footerWrapStyle: CSSProperties = {
  width: "100%",
  padding: "0 16px 20px",
  boxSizing: "border-box",
  marginTop: "32px",
};

const footerStyle: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  background:
    "linear-gradient(135deg, rgba(20,83,45,0.96) 0%, rgba(12,20,16,0.96) 100%)",
  border: "1px solid #2b3b33",
  borderRadius: "22px",
  padding: "22px 20px 18px",
  boxShadow: "0 12px 36px rgba(0,0,0,0.24)",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  flexWrap: "wrap",
};

const brandBlockStyle: CSSProperties = {
  minWidth: "220px",
};

const logoStyle: CSSProperties = {
  fontSize: "20px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  color: "#eafff0",
};

const taglineStyle: CSSProperties = {
  margin: "8px 0 0 0",
  color: "#b7d6c0",
  fontSize: "14px",
  lineHeight: 1.5,
};

const navStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const linkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "40px",
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#e7f1eb",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "14px",
};

const dividerStyle: CSSProperties = {
  height: "1px",
  margin: "18px 0 14px",
  background: "rgba(255,255,255,0.08)",
};

const bottomRowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "4px",
  flexWrap: "wrap",
};

const smallTextStyle: CSSProperties = {
  color: "#94a39b",
  fontSize: "13px",
};
