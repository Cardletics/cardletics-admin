
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type ScreenshotItem = {
  title: string;
  text: string;
  fileName: string;
};

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

type Translation = {
  languageName: string;
  affiliate: string;
  heroBadge: string;
  title: string;
  subtitle: string;
  appStore: string;
  googlePlay: string;
  affiliateProgram: string;
  heroHint: string;
  stats: { label: string; value: string }[];
  whatEyebrow: string;
  whatTitle: string;
  whatText: string;
  features: { title: string; text: string }[];
  appEyebrow: string;
  appTitle: string;
  appText: string;
  steps: { number: string; title: string; text: string }[];
  screenshotsEyebrow: string;
  screenshotsTitle: string;
  screenshots: ScreenshotItem[];
  affiliateEyebrow: string;
  affiliateTitle: string;
  affiliateText: string;
  affiliateSmall: string;
  affiliateCta: string;
  helpButton: string;
  helpTitle: string;
  helpSubtitle: string;
  quickQuestions: { text: string; answer: string }[];
  close: string;
  prev: string;
  next: string;
  swipeHint: string;
};

const screenshotFiles = [
  "/home-screen.png",
  "/battle-screen.png",
  "/card-detail.png",
  "/awards-screen.png",
  "/pack-opening.png",
  "/collection-screen.png",
  "/marketplace-screen.png",
  "/shop-screen.png",
  "/movement-detail-screen.png",
  "/nearby-screen.png",
  "/events-screen.png",
  "/friends-screen.png",
];

const baseFeaturesEn = [
  { title: "Sport is rewarded", text: "Your real activity in everyday life and training becomes the basis for your progress." },
  { title: "Cards with rarity", text: "Earn digital cards, collect them, showcase them and use their rarity." },
  { title: "Build teams", text: "Combine cards wisely and create your own team for battles." },
  { title: "Internal marketplace", text: "Cards can be traded within the system." },
  { title: "Complete collections", text: "Work toward full sets and collect special awards." },
  { title: "Awards & prestige", text: "Special achievements, series and progress become visible rewards." },
];

const baseStepsEn = [
  { number: "1", title: "Track activity", text: "Move in real life. Sports and activity become the base for your progress." },
  { number: "2", title: "Earn cards", text: "Get digital cards for activity, progress and special achievements." },
  { number: "3", title: "Collect and optimize", text: "Complete collections, collect rare cards and improve your lineup." },
  { number: "4", title: "Build teams and battle", text: "Create teams with your cards and compete against others." },
];

const baseScreensEn: ScreenshotItem[] = [
  { title: "Home", text: "Start area, main navigation and overview", fileName: screenshotFiles[0] },
  { title: "Battle Area", text: "Team battles, strategy and battle view", fileName: screenshotFiles[1] },
  { title: "Card Details", text: "Single card with values, design and rarity", fileName: screenshotFiles[2] },
  { title: "Awards", text: "Rewards, achievements and unlocked milestones", fileName: screenshotFiles[3] },
  { title: "Open Pack", text: "Open packs and receive new cards", fileName: screenshotFiles[4] },
  { title: "Collection", text: "Collection, sets and completion", fileName: screenshotFiles[5] },
  { title: "Marketplace", text: "Internal card trading", fileName: screenshotFiles[6] },
  { title: "Shop", text: "Coins, offers and optional in-app purchases", fileName: screenshotFiles[7] },
  { title: "Movement Details", text: "Progress, activity values and sport development", fileName: screenshotFiles[8] },
  { title: "Nearby", text: "Discover nearby players on the radar", fileName: screenshotFiles[9] },
  { title: "Events", text: "Actions, challenges and special in-app events", fileName: screenshotFiles[10] },
  { title: "Friends", text: "Friend list, requests, chats and groups", fileName: screenshotFiles[11] },
];

const baseQuickQuestionsEn = [
  { text: "How does Cardletics work?", answer: "You track activity, earn cards, collect sets, build teams and battle." },
  { text: "Is the app free?", answer: "Yes. The app is free to use with optional subscriptions and in-app purchases." },
  { text: "Can cards be traded?", answer: "Yes, cards can be traded on an internal marketplace." },
  { text: "How does the affiliate program work?", answer: "It is intended for partners, creators and communities. Details can later be shown directly in the system." },
];

const translations: Record<LanguageKey, Translation> = {
  de: {
    languageName: "Deutsch",
    affiliate: "Affiliate",
    heroBadge: "Tracken • Sammeln • Kämpfen • Handeln",
    title: "Sportdaten werden\nzu Karten, Teams\nund echtem Fortschritt.",
    subtitle:
      "Cardletics verbindet echte Bewegung mit digitalem Sammelkarten-Gameplay. Laufe, trainiere und bleibe aktiv, um Karten zu verdienen, Sammlungen zu vervollständigen, Teams aufzubauen, Kämpfe zu bestreiten und über die interne Börse zu handeln.",
    appStore: "App Store – bald verfügbar",
    googlePlay: "Google Play – bald verfügbar",
    affiliateProgram: "Affiliate Programm",
    heroHint:
      "Cardletics ist kostenlos nutzbar und kann optional durch Abos, Coins und weitere Inhalte erweitert werden.",
    stats: [
      { label: "Tracking", value: "Bewegung wird Fortschritt" },
      { label: "Karten", value: "Selten, sammelbar, handelbar" },
      { label: "Teams", value: "Strategie & Kämpfe" },
      { label: "Marktplatz", value: "Interne Börse" },
    ],
    whatEyebrow: "Was ist Cardletics?",
    whatTitle: "Eine App, die Aktivität spielbar macht",
    whatText:
      "Statt nur Schritte oder Läufe zu zählen, macht Cardletics aus deiner Aktivität ein System aus Karten, Belohnungen, Sammlung, Status und Strategie. So wird Bewegung langfristig motivierender und sichtbarer.",
    features: [
      { title: "Sport wird belohnt", text: "Deine echte Aktivität im Alltag und beim Training wird zur Grundlage deines Fortschritts." },
      { title: "Karten mit Seltenheit", text: "Du erhältst digitale Karten, kannst sie sammeln, präsentieren und ihre Seltenheit nutzen." },
      { title: "Teams bauen", text: "Kombiniere Karten sinnvoll und stelle dein eigenes Team für Kämpfe zusammen." },
      { title: "Interne Börse", text: "Karten können innerhalb des Systems gehandelt werden." },
      { title: "Kollektionen vervollständigen", text: "Arbeite auf vollständige Sets hin und sammle besondere Auszeichnungen." },
      { title: "Auszeichnungen & Prestige", text: "Besondere Leistungen, Serien und Fortschritte werden sichtbar belohnt." },
    ],
    appEyebrow: "App erklärt",
    appTitle: "So nutzt man Cardletics",
    appText: "Damit sofort klar ist, wie die App funktioniert, zeigt diese Seite den Ablauf einfach und verständlich.",
    steps: [
      { number: "1", title: "Aktivität tracken", text: "Du bewegst dich im echten Leben. Sport und Aktivität werden als Grundlage für deinen Fortschritt genutzt." },
      { number: "2", title: "Karten verdienen", text: "Für Aktivität, Fortschritt und besondere Leistungen erhältst du digitale Karten." },
      { number: "3", title: "Sammeln und optimieren", text: "Du vervollständigst Kollektionen, sammelst seltene Karten und verbesserst deine Auswahl." },
      { number: "4", title: "Team bauen und kämpfen", text: "Mit deinen Karten stellst du Teams zusammen und trittst in Kämpfen gegen andere an." },
    ],
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Einblicke in die App",
    screenshots: [
      { title: "Startseite", text: "Startbereich, Hauptnavigation und Überblick", fileName: screenshotFiles[0] },
      { title: "Kampfbereich", text: "Teamkampf, Strategie und Kampfansicht", fileName: screenshotFiles[1] },
      { title: "Karte im Detail", text: "Einzelne Karte mit Werten, Design und Seltenheit", fileName: screenshotFiles[2] },
      { title: "Auszeichnungen", text: "Belohnungen, Erfolge und freigeschaltete Meilensteine", fileName: screenshotFiles[3] },
      { title: "Pack öffnen", text: "Packs öffnen und neue Karten erhalten", fileName: screenshotFiles[4] },
      { title: "Sammlung", text: "Sammlung, Sets und Vervollständigung", fileName: screenshotFiles[5] },
      { title: "Börse / Marktplatz", text: "Interner Handel mit Karten", fileName: screenshotFiles[6] },
      { title: "Shop", text: "Coins, Angebote und optionale In-App-Käufe", fileName: screenshotFiles[7] },
      { title: "Bewegung im Detail", text: "Fortschritt, Aktivitätswerte und sportliche Entwicklung im Überblick", fileName: screenshotFiles[8] },
      { title: "Umgebung", text: "Spieler in deiner Nähe entdecken und auf dem Radar anzeigen", fileName: screenshotFiles[9] },
      { title: "Events", text: "Aktionen, Challenges und besondere In-App-Events entdecken", fileName: screenshotFiles[10] },
      { title: "Freunde", text: "Freundesliste, Anfragen, Chats und Gruppen verwalten", fileName: screenshotFiles[11] },
    ],
    affiliateEyebrow: "Affiliate Programm",
    affiliateTitle: "Creator, Partner und Communities einbinden",
    affiliateText:
      "Cardletics soll auch durch Partner, Creator und Communities wachsen. Deshalb gibt es ein Affiliate-Programm, über das später Empfehlungen, Performance und mögliche Einnahmen sichtbar gemacht werden können.",
    affiliateSmall: "Später kann hier zusätzlich ein direkter Link zum Affiliate-Bereich in der App oder im Web ergänzt werden.",
    affiliateCta: "Affiliate anfragen",
    helpButton: "Hilfe",
    helpTitle: "Cardletics Hilfe",
    helpSubtitle: "Schnelle Antworten auf typische Fragen",
    quickQuestions: [
      { text: "Wie funktioniert Cardletics?", answer: "Du trackst Aktivität, erhältst Karten, sammelst Kollektionen, baust Teams und kannst Kämpfe bestreiten." },
      { text: "Ist die App kostenlos?", answer: "Ja, die App ist grundsätzlich kostenlos nutzbar. Zusätzlich sind optionale Abos und In-App-Käufe möglich." },
      { text: "Kann man Karten handeln?", answer: "Ja, Karten können innerhalb einer internen Börse gehandelt werden." },
      { text: "Wie läuft das Affiliate-Programm?", answer: "Das Affiliate-Programm ist für Partner, Creator und Communities gedacht. Details und Tracking können später direkt im System sichtbar gemacht werden." },
    ],
    close: "Schließen",
    prev: "Zurück",
    next: "Weiter",
    swipeHint: "← Wischen zum Wechseln →",
  },
  en: {
    languageName: "English",
    affiliate: "Affiliate",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "Sports data becomes\ncards, teams\nand real progress.",
    subtitle: "Cardletics connects real movement with digital trading-card gameplay. Walk, train and stay active to earn cards, complete collections, build teams, battle and trade on the internal marketplace.",
    appStore: "App Store – coming soon",
    googlePlay: "Google Play – coming soon",
    affiliateProgram: "Affiliate Program",
    heroHint: "Cardletics is free to use and can optionally be expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "What is Cardletics?",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Instead of only counting steps or runs, Cardletics turns your activity into cards, rewards, collections, status and strategy.",
    features: [
      { title: "Sport is rewarded", text: "Your real activity in everyday life and training becomes the basis for your progress." },
      { title: "Cards with rarity", text: "Earn digital cards, collect them, showcase them and use their rarity." },
      { title: "Build teams", text: "Combine cards wisely and create your own team for battles." },
      { title: "Internal marketplace", text: "Cards can be traded within the system." },
      { title: "Complete collections", text: "Work toward full sets and collect special awards." },
      { title: "Awards & prestige", text: "Special achievements, series and progress become visible rewards." },
    ],
    appEyebrow: "App explained",
    appTitle: "How to use Cardletics",
    appText: "This page explains the core flow in a simple and clear way.",
    steps: [
      { number: "1", title: "Track activity", text: "Move in real life. Sports and activity become the base for your progress." },
      { number: "2", title: "Earn cards", text: "Get digital cards for activity, progress and special achievements." },
      { number: "3", title: "Collect and optimize", text: "Complete collections, collect rare cards and improve your lineup." },
      { number: "4", title: "Build teams and battle", text: "Create teams with your cards and compete against others." },
    ],
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: [
      { title: "Home", text: "Start area, main navigation and overview", fileName: screenshotFiles[0] },
      { title: "Battle Area", text: "Team battles, strategy and battle view", fileName: screenshotFiles[1] },
      { title: "Card Details", text: "Single card with values, design and rarity", fileName: screenshotFiles[2] },
      { title: "Awards", text: "Rewards, achievements and unlocked milestones", fileName: screenshotFiles[3] },
      { title: "Open Pack", text: "Open packs and receive new cards", fileName: screenshotFiles[4] },
      { title: "Collection", text: "Collection, sets and completion", fileName: screenshotFiles[5] },
      { title: "Marketplace", text: "Internal card trading", fileName: screenshotFiles[6] },
      { title: "Shop", text: "Coins, offers and optional in-app purchases", fileName: screenshotFiles[7] },
      { title: "Movement Details", text: "Progress, activity values and sport development", fileName: screenshotFiles[8] },
      { title: "Nearby", text: "Discover nearby players on the radar", fileName: screenshotFiles[9] },
      { title: "Events", text: "Actions, challenges and special in-app events", fileName: screenshotFiles[10] },
      { title: "Friends", text: "Friend list, requests, chats and groups", fileName: screenshotFiles[11] },
    ],
    affiliateEyebrow: "Affiliate Program",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities. The affiliate program is designed for recommendations, performance and potential revenue tracking.",
    affiliateSmall: "A direct link to the affiliate area can be added here later.",
    affiliateCta: "Request affiliate access",
    helpButton: "Help",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: [
      { text: "How does Cardletics work?", answer: "You track activity, earn cards, collect sets, build teams and battle." },
      { text: "Is the app free?", answer: "Yes. The app is free to use with optional subscriptions and in-app purchases." },
      { text: "Can cards be traded?", answer: "Yes, cards can be traded on an internal marketplace." },
      { text: "How does the affiliate program work?", answer: "It is intended for partners, creators and communities. Details can later be shown directly in the system." },
    ],
    close: "Close",
    prev: "Back",
    next: "Next",
    swipeHint: "← Swipe to switch →",
  },
  es: {
    languageName: "Español",
    affiliate: "Programa",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "Los datos deportivos se convierten\nen cartas, equipos\ny progreso real.",
    subtitle: "Cardletics conecta el movimiento real con un juego digital de cartas coleccionables. Camina, entrena y mantente activo para ganar cartas, completar colecciones, crear equipos, combatir y comerciar en el mercado interno.",
    appStore: "App Store – próximamente",
    googlePlay: "Google Play – próximamente",
    affiliateProgram: "Programa de afiliados",
    heroHint: "Cardletics can be used for free and optionally expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "Cardletics",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Cardletics turns activity into cards, rewards, collections, status and strategy.",
    features: baseFeaturesEn,
    appEyebrow: "App",
    appTitle: "How Cardletics works",
    appText: "The page explains the core flow clearly and simply.",
    steps: baseStepsEn,
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: baseScreensEn,
    affiliateEyebrow: "Programa de afiliados",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities through recommendations, performance tracking and potential revenue models.",
    affiliateSmall: "A direct affiliate area can be added later.",
    affiliateCta: "Programa de afiliados",
    helpButton: "Ayuda",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: baseQuickQuestionsEn,
    close: "Cerrar",
    prev: "Atrás",
    next: "Siguiente",
    swipeHint: "← Swipe to switch →",
  },
  fr: {
    languageName: "Français",
    affiliate: "Programme",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "Les données sportives deviennent\ndes cartes, des équipes\net de vrais progrès.",
    subtitle: "Cardletics relie le mouvement réel à un gameplay de cartes à collectionner numérique. Marchez, entraînez-vous et restez actif pour gagner des cartes, compléter des collections, créer des équipes, combattre et échanger sur le marché interne.",
    appStore: "App Store – bientôt disponible",
    googlePlay: "Google Play – bientôt disponible",
    affiliateProgram: "Programme d’affiliation",
    heroHint: "Cardletics can be used for free and optionally expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "Cardletics",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Cardletics turns activity into cards, rewards, collections, status and strategy.",
    features: baseFeaturesEn,
    appEyebrow: "App",
    appTitle: "How Cardletics works",
    appText: "The page explains the core flow clearly and simply.",
    steps: baseStepsEn,
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: baseScreensEn,
    affiliateEyebrow: "Programme d’affiliation",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities through recommendations, performance tracking and potential revenue models.",
    affiliateSmall: "A direct affiliate area can be added later.",
    affiliateCta: "Programme d’affiliation",
    helpButton: "Aide",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: baseQuickQuestionsEn,
    close: "Fermer",
    prev: "Retour",
    next: "Suivant",
    swipeHint: "← Swipe to switch →",
  },
  pt: {
    languageName: "Português",
    affiliate: "Programa",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "Dados esportivos viram\ncartas, equipes\ne progresso real.",
    subtitle: "Cardletics conecta movimento real com gameplay digital de cartas colecionáveis. Caminhe, treine e mantenha-se ativo para ganhar cartas, completar coleções, montar equipes, batalhar e negociar no mercado interno.",
    appStore: "App Store – em breve",
    googlePlay: "Google Play – em breve",
    affiliateProgram: "Programa de afiliados",
    heroHint: "Cardletics can be used for free and optionally expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "Cardletics",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Cardletics turns activity into cards, rewards, collections, status and strategy.",
    features: baseFeaturesEn,
    appEyebrow: "App",
    appTitle: "How Cardletics works",
    appText: "The page explains the core flow clearly and simply.",
    steps: baseStepsEn,
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: baseScreensEn,
    affiliateEyebrow: "Programa de afiliados",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities through recommendations, performance tracking and potential revenue models.",
    affiliateSmall: "A direct affiliate area can be added later.",
    affiliateCta: "Programa de afiliados",
    helpButton: "Ajuda",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: baseQuickQuestionsEn,
    close: "Fechar",
    prev: "Voltar",
    next: "Avançar",
    swipeHint: "← Swipe to switch →",
  },
  zh: {
    languageName: "中文",
    affiliate: "联盟计划",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "运动数据变成\n卡牌、队伍\n和真实进度。",
    subtitle: "Cardletics 将真实运动与数字集换式卡牌玩法结合。步行、训练并保持活跃，赢取卡牌、完成收藏、组建队伍、进行对战并在内部市场交易。",
    appStore: "App Store – 即将推出",
    googlePlay: "Google Play – 即将推出",
    affiliateProgram: "联盟计划",
    heroHint: "Cardletics can be used for free and optionally expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "Cardletics",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Cardletics turns activity into cards, rewards, collections, status and strategy.",
    features: baseFeaturesEn,
    appEyebrow: "App",
    appTitle: "How Cardletics works",
    appText: "The page explains the core flow clearly and simply.",
    steps: baseStepsEn,
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: baseScreensEn,
    affiliateEyebrow: "联盟计划",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities through recommendations, performance tracking and potential revenue models.",
    affiliateSmall: "A direct affiliate area can be added later.",
    affiliateCta: "联盟计划",
    helpButton: "帮助",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: baseQuickQuestionsEn,
    close: "关闭",
    prev: "返回",
    next: "下一步",
    swipeHint: "← Swipe to switch →",
  },
  hi: {
    languageName: "हिन्दी",
    affiliate: "एफिलिएट प्रोग्राम",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "खेल डेटा बनता है\nकार्ड, टीम\nऔर असली प्रगति।",
    subtitle: "Cardletics असली गतिविधि को डिजिटल ट्रेडिंग कार्ड गेमप्ले से जोड़ता है। चलें, ट्रेनिंग करें और सक्रिय रहें ताकि कार्ड कमाएँ, कलेक्शन पूरे करें, टीम बनाएँ, मुकाबले खेलें और अंदरूनी बाज़ार में ट्रेड करें।",
    appStore: "App Store – जल्द उपलब्ध",
    googlePlay: "Google Play – जल्द उपलब्ध",
    affiliateProgram: "एफिलिएट प्रोग्राम",
    heroHint: "Cardletics can be used for free and optionally expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "Cardletics",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Cardletics turns activity into cards, rewards, collections, status and strategy.",
    features: baseFeaturesEn,
    appEyebrow: "App",
    appTitle: "How Cardletics works",
    appText: "The page explains the core flow clearly and simply.",
    steps: baseStepsEn,
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: baseScreensEn,
    affiliateEyebrow: "एफिलिएट प्रोग्राम",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities through recommendations, performance tracking and potential revenue models.",
    affiliateSmall: "A direct affiliate area can be added later.",
    affiliateCta: "एफिलिएट प्रोग्राम",
    helpButton: "मदद",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: baseQuickQuestionsEn,
    close: "बंद करें",
    prev: "वापस",
    next: "आगे",
    swipeHint: "← Swipe to switch →",
  },
  ar: {
    languageName: "العربية",
    affiliate: "برنامج الشركاء",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "تتحول بيانات الرياضة\nإلى بطاقات وفرق\nوتقدم حقيقي.",
    subtitle: "يربط Cardletics الحركة الحقيقية بأسلوب لعب بطاقات رقمية قابلة للجمع. امشِ وتدرّب وابقَ نشيطًا لتكسب البطاقات وتكمل المجموعات وتبني الفرق وتخوض المعارك وتتداول في السوق الداخلي.",
    appStore: "App Store – قريبًا",
    googlePlay: "Google Play – قريبًا",
    affiliateProgram: "برنامج الشركاء",
    heroHint: "Cardletics can be used for free and optionally expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "Cardletics",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Cardletics turns activity into cards, rewards, collections, status and strategy.",
    features: baseFeaturesEn,
    appEyebrow: "App",
    appTitle: "How Cardletics works",
    appText: "The page explains the core flow clearly and simply.",
    steps: baseStepsEn,
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: baseScreensEn,
    affiliateEyebrow: "برنامج الشركاء",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities through recommendations, performance tracking and potential revenue models.",
    affiliateSmall: "A direct affiliate area can be added later.",
    affiliateCta: "برنامج الشركاء",
    helpButton: "مساعدة",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: baseQuickQuestionsEn,
    close: "إغلاق",
    prev: "رجوع",
    next: "التالي",
    swipeHint: "← Swipe to switch →",
  },
  bn: {
    languageName: "বাংলা",
    affiliate: "অ্যাফিলিয়েট প্রোগ্রাম",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "খেলার ডেটা হয়ে ওঠে\nকার্ড, দল\nও বাস্তব অগ্রগতি।",
    subtitle: "Cardletics বাস্তব চলাফেরাকে ডিজিটাল ট্রেডিং কার্ড গেমপ্লের সঙ্গে যুক্ত করে। হাঁটুন, অনুশীলন করুন এবং সক্রিয় থাকুন কার্ড অর্জন, সংগ্রহ সম্পূর্ণ করা, দল তৈরি, লড়াই এবং অভ্যন্তরীণ বাজারে ট্রেড করার জন্য।",
    appStore: "App Store – শীঘ্রই",
    googlePlay: "Google Play – শীঘ্রই",
    affiliateProgram: "অ্যাফিলিয়েট প্রোগ্রাম",
    heroHint: "Cardletics can be used for free and optionally expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "Cardletics",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Cardletics turns activity into cards, rewards, collections, status and strategy.",
    features: baseFeaturesEn,
    appEyebrow: "App",
    appTitle: "How Cardletics works",
    appText: "The page explains the core flow clearly and simply.",
    steps: baseStepsEn,
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: baseScreensEn,
    affiliateEyebrow: "অ্যাফিলিয়েট প্রোগ্রাম",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities through recommendations, performance tracking and potential revenue models.",
    affiliateSmall: "A direct affiliate area can be added later.",
    affiliateCta: "অ্যাফিলিয়েট প্রোগ্রাম",
    helpButton: "সাহায্য",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: baseQuickQuestionsEn,
    close: "বন্ধ",
    prev: "পিছনে",
    next: "পরবর্তী",
    swipeHint: "← Swipe to switch →",
  },
  ru: {
    languageName: "Русский",
    affiliate: "Партнёрская",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "Спортивные данные становятся\nкартами, командами\nи реальным прогрессом.",
    subtitle: "Cardletics объединяет реальную активность с цифровым геймплеем коллекционных карт. Ходите, тренируйтесь и оставайтесь активными, чтобы получать карты, завершать коллекции, создавать команды, сражаться и торговать на внутреннем рынке.",
    appStore: "App Store – скоро",
    googlePlay: "Google Play – скоро",
    affiliateProgram: "Партнёрская программа",
    heroHint: "Cardletics can be used for free and optionally expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "Cardletics",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Cardletics turns activity into cards, rewards, collections, status and strategy.",
    features: baseFeaturesEn,
    appEyebrow: "App",
    appTitle: "How Cardletics works",
    appText: "The page explains the core flow clearly and simply.",
    steps: baseStepsEn,
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: baseScreensEn,
    affiliateEyebrow: "Партнёрская программа",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities through recommendations, performance tracking and potential revenue models.",
    affiliateSmall: "A direct affiliate area can be added later.",
    affiliateCta: "Партнёрская программа",
    helpButton: "Помощь",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: baseQuickQuestionsEn,
    close: "Закрыть",
    prev: "Назад",
    next: "Далее",
    swipeHint: "← Swipe to switch →",
  },
  ja: {
    languageName: "日本語",
    affiliate: "アフィリエイトプログラム",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "スポーツデータが\nカード、チーム、\n本当の成長になる。",
    subtitle: "Cardletics は実際の運動とデジタルトレーディングカードのゲーム性をつなげます。歩き、トレーニングし、アクティブに過ごしてカードを獲得し、コレクションを完成させ、チームを作り、バトルや内部マーケットでの取引を楽しめます。",
    appStore: "App Store – 近日公開",
    googlePlay: "Google Play – 近日公開",
    affiliateProgram: "アフィリエイトプログラム",
    heroHint: "Cardletics can be used for free and optionally expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "Cardletics",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Cardletics turns activity into cards, rewards, collections, status and strategy.",
    features: baseFeaturesEn,
    appEyebrow: "App",
    appTitle: "How Cardletics works",
    appText: "The page explains the core flow clearly and simply.",
    steps: baseStepsEn,
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: baseScreensEn,
    affiliateEyebrow: "アフィリエイトプログラム",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities through recommendations, performance tracking and potential revenue models.",
    affiliateSmall: "A direct affiliate area can be added later.",
    affiliateCta: "アフィリエイトプログラム",
    helpButton: "ヘルプ",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: baseQuickQuestionsEn,
    close: "閉じる",
    prev: "戻る",
    next: "次へ",
    swipeHint: "← Swipe to switch →",
  },
  tr: {
    languageName: "Türkçe",
    affiliate: "Ortaklık",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "Spor verileri\nkartlara, takımlara\nve gerçek ilerlemeye dönüşür.",
    subtitle: "Cardletics gerçek hareketi dijital koleksiyon kartı oynanışıyla birleştirir. Yürü, antrenman yap ve aktif kal; kart kazan, koleksiyonları tamamla, takım kur, savaş ve iç pazarda takas yap.",
    appStore: "App Store – yakında",
    googlePlay: "Google Play – yakında",
    affiliateProgram: "Ortaklık Programı",
    heroHint: "Cardletics can be used for free and optionally expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "Cardletics",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Cardletics turns activity into cards, rewards, collections, status and strategy.",
    features: baseFeaturesEn,
    appEyebrow: "App",
    appTitle: "How Cardletics works",
    appText: "The page explains the core flow clearly and simply.",
    steps: baseStepsEn,
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: baseScreensEn,
    affiliateEyebrow: "Ortaklık Programı",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities through recommendations, performance tracking and potential revenue models.",
    affiliateSmall: "A direct affiliate area can be added later.",
    affiliateCta: "Ortaklık Programı",
    helpButton: "Yardım",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: baseQuickQuestionsEn,
    close: "Kapat",
    prev: "Geri",
    next: "İleri",
    swipeHint: "← Swipe to switch →",
  },
  vi: {
    languageName: "Tiếng Việt",
    affiliate: "Chương",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "Dữ liệu thể thao trở thành\nthẻ bài, đội hình\nvà tiến trình thật.",
    subtitle: "Cardletics kết nối vận động thật với lối chơi thẻ bài sưu tầm kỹ thuật số. Đi bộ, luyện tập và duy trì hoạt động để nhận thẻ, hoàn thành bộ sưu tập, xây đội, chiến đấu và giao dịch trong chợ nội bộ.",
    appStore: "App Store – sắp có",
    googlePlay: "Google Play – sắp có",
    affiliateProgram: "Chương trình liên kết",
    heroHint: "Cardletics can be used for free and optionally expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "Cardletics",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Cardletics turns activity into cards, rewards, collections, status and strategy.",
    features: baseFeaturesEn,
    appEyebrow: "App",
    appTitle: "How Cardletics works",
    appText: "The page explains the core flow clearly and simply.",
    steps: baseStepsEn,
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: baseScreensEn,
    affiliateEyebrow: "Chương trình liên kết",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities through recommendations, performance tracking and potential revenue models.",
    affiliateSmall: "A direct affiliate area can be added later.",
    affiliateCta: "Chương trình liên kết",
    helpButton: "Trợ giúp",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: baseQuickQuestionsEn,
    close: "Đóng",
    prev: "Quay lại",
    next: "Tiếp",
    swipeHint: "← Swipe to switch →",
  },
  id: {
    languageName: "Bahasa Indonesia",
    affiliate: "Program",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "Data olahraga menjadi\nkartu, tim\ndan progres nyata.",
    subtitle: "Cardletics menghubungkan gerakan nyata dengan gameplay kartu koleksi digital. Berjalan, berlatih, dan tetap aktif untuk mendapatkan kartu, melengkapi koleksi, membangun tim, bertarung, dan berdagang di marketplace internal.",
    appStore: "App Store – segera hadir",
    googlePlay: "Google Play – segera hadir",
    affiliateProgram: "Program Afiliasi",
    heroHint: "Cardletics can be used for free and optionally expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "Cardletics",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Cardletics turns activity into cards, rewards, collections, status and strategy.",
    features: baseFeaturesEn,
    appEyebrow: "App",
    appTitle: "How Cardletics works",
    appText: "The page explains the core flow clearly and simply.",
    steps: baseStepsEn,
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: baseScreensEn,
    affiliateEyebrow: "Program Afiliasi",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities through recommendations, performance tracking and potential revenue models.",
    affiliateSmall: "A direct affiliate area can be added later.",
    affiliateCta: "Program Afiliasi",
    helpButton: "Bantuan",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: baseQuickQuestionsEn,
    close: "Tutup",
    prev: "Kembali",
    next: "Lanjut",
    swipeHint: "← Swipe to switch →",
  },
  ur: {
    languageName: "اردو",
    affiliate: "افیلیٹ پروگرام",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "کھیل کا ڈیٹا بنتا ہے\nکارڈز، ٹیمیں\nاور حقیقی پیش رفت۔",
    subtitle: "Cardletics حقیقی حرکت کو ڈیجیٹل ٹریڈنگ کارڈ گیم پلے سے جوڑتا ہے۔ چلیں، ٹریننگ کریں اور فعال رہیں تاکہ کارڈز حاصل کریں، کلیکشن مکمل کریں، ٹیم بنائیں، مقابلے کریں اور اندرونی مارکیٹ میں تجارت کریں۔",
    appStore: "App Store – جلد دستیاب",
    googlePlay: "Google Play – جلد دستیاب",
    affiliateProgram: "افیلیٹ پروگرام",
    heroHint: "Cardletics can be used for free and optionally expanded with subscriptions, coins and additional content.",
    stats: [
      { label: "Tracking", value: "Movement becomes progress" },
      { label: "Cards", value: "Rare, collectible, tradable" },
      { label: "Teams", value: "Strategy & battles" },
      { label: "Marketplace", value: "Internal exchange" },
    ],
    whatEyebrow: "Cardletics",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Cardletics turns activity into cards, rewards, collections, status and strategy.",
    features: baseFeaturesEn,
    appEyebrow: "App",
    appTitle: "How Cardletics works",
    appText: "The page explains the core flow clearly and simply.",
    steps: baseStepsEn,
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: baseScreensEn,
    affiliateEyebrow: "افیلیٹ پروگرام",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities through recommendations, performance tracking and potential revenue models.",
    affiliateSmall: "A direct affiliate area can be added later.",
    affiliateCta: "افیلیٹ پروگرام",
    helpButton: "مدد",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: baseQuickQuestionsEn,
    close: "بند کریں",
    prev: "واپس",
    next: "اگلا",
    swipeHint: "← Swipe to switch →",
  },
};

const languageOptions: { key: LanguageKey; label: string; flag: string; short: string }[] = [
  { key: "de", label: "Deutsch", flag: "🇩🇪", short: "DE" },
  { key: "en", label: "English", flag: "🇬🇧", short: "EN" },
  { key: "es", label: "Español", flag: "🇪🇸", short: "ES" },
  { key: "fr", label: "Français", flag: "🇫🇷", short: "FR" },
  { key: "pt", label: "Português", flag: "🇵🇹", short: "PT" },
  { key: "zh", label: "中文", flag: "🇨🇳", short: "ZH" },
  { key: "hi", label: "हिन्दी", flag: "🇮🇳", short: "HI" },
  { key: "ar", label: "العربية", flag: "🇸🇦", short: "AR" },
  { key: "bn", label: "বাংলা", flag: "🇧🇩", short: "BN" },
  { key: "ru", label: "Русский", flag: "🇷🇺", short: "RU" },
  { key: "ja", label: "日本語", flag: "🇯🇵", short: "JA" },
  { key: "tr", label: "Türkçe", flag: "🇹🇷", short: "TR" },
  { key: "vi", label: "Tiếng Việt", flag: "🇻🇳", short: "VI" },
  { key: "id", label: "Bahasa Indonesia", flag: "🇮🇩", short: "ID" },
  { key: "ur", label: "اردو", flag: "🇵🇰", short: "UR" },
];

export default function HomePage() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedShotIndex, setSelectedShotIndex] = useState<number | null>(null);
  const [language, setLanguage] = useState<LanguageKey>("de");

  const t = translations[language];
  const screenshots = useMemo<ScreenshotItem[]>(() => t.screenshots, [t]);
  const selectedShot = selectedShotIndex !== null ? screenshots[selectedShotIndex] : null;
  const dir = language === "ar" || language === "ur" ? "rtl" : "ltr";

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (selectedShotIndex === null) return;

      if (event.key === "Escape") setSelectedShotIndex(null);
      if (event.key === "ArrowLeft") {
        setSelectedShotIndex((prev) => {
          if (prev === null) return null;
          return prev === 0 ? screenshots.length - 1 : prev - 1;
        });
      }
      if (event.key === "ArrowRight") {
        setSelectedShotIndex((prev) => {
          if (prev === null) return null;
          return prev === screenshots.length - 1 ? 0 : prev + 1;
        });
      }
    }

    if (selectedShotIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedShotIndex, screenshots.length]);

  return (
    <main style={{ ...pageStyle, direction: dir }}>
      {!isMobile && (
        <a href="mailto:Info@cardletics.com?subject=Affiliate%20Programm" style={affiliateSideButtonStyle}>
          {t.affiliate}
        </a>
      )}

      <section style={heroSectionStyle}>
        <div style={heroGlowOneStyle} />
        <div style={heroGlowTwoStyle} />

        <div style={languageBarStyle}>
          <span style={languageFlagStyle} aria-hidden="true">
            {languageOptions.find((option) => option.key === language)?.flag ?? "🌐"}
          </span>
          <label style={languageLabelStyle} htmlFor="language-select">
            Sprache
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageKey)}
            style={languageSelectStyle}
            aria-label="Sprache auswählen"
          >
            {languageOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {`${option.flag} ${option.label}`}
              </option>
            ))}
          </select>
        </div>

        <div style={{ ...heroInnerStyle, padding: isMobile ? "40px 18px 30px 18px" : "58px 24px" }}>
          <div style={{ ...logoWrapperStyle, marginBottom: isMobile ? "18px" : "22px" }}>
            <div style={{ ...logoOuterStyle, width: isMobile ? "138px" : "180px", height: isMobile ? "138px" : "180px", borderRadius: isMobile ? "32px" : "40px" }}>
              <div style={{ ...logoInnerStyle, borderRadius: isMobile ? "24px" : "32px" }}>
                <Image src="/bg_app.png" alt="Cardletics Logo" width={180} height={180} priority style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </div>
          </div>

          <div style={heroBadgeStyle}>{t.heroBadge}</div>

          <h1 style={{ ...titleStyle, fontSize: isMobile ? "36px" : "clamp(40px, 7vw, 72px)", lineHeight: isMobile ? 1.06 : 1.02, marginBottom: isMobile ? "14px" : "18px" }}>
            {t.title.split("\n").map((line) => (
              <span key={line}>{line}<br /></span>
            ))}
          </h1>

          <p style={{ ...subtitleStyle, fontSize: isMobile ? "16px" : "18px", marginBottom: isMobile ? "22px" : "28px" }}>
            {t.subtitle}
          </p>

          <div style={{ ...buttonRowStyle, flexDirection: isMobile ? "column" : "row", alignItems: "center" }}>
            <div style={{ ...buttonStyle, width: isMobile ? "100%" : "auto" }}>{t.appStore}</div>
            <div style={{ ...buttonSecondaryStyle, width: isMobile ? "100%" : "auto" }}>{t.googlePlay}</div>
            {isMobile && (
              <a href="mailto:Info@cardletics.com?subject=Affiliate%20Programm" style={{ ...affiliateInlineButtonStyle, width: "100%" }}>
                {t.affiliateProgram}
              </a>
            )}
          </div>

          <p style={{ ...heroHintStyle, fontSize: isMobile ? "13px" : "14px" }}>{t.heroHint}</p>
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={{ ...statsStripStyle, gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {t.stats.map((item) => <StatBox key={item.label} label={item.label} value={item.value} />)}
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div style={sectionEyebrowStyle}>{t.whatEyebrow}</div>
          <h2 style={{ ...sectionTitleStyle, fontSize: isMobile ? "28px" : "clamp(28px, 4vw, 42px)" }}>{t.whatTitle}</h2>
          <p style={sectionTextStyle}>{t.whatText}</p>
        </div>

        <div style={{ ...featureGridStyle, gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {t.features.map((feature) => <FeatureCard key={feature.title} title={feature.title} text={feature.text} />)}
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={{ ...howItWorksPanelStyle, padding: isMobile ? "18px" : "22px" }}>
          <div style={sectionHeaderStyle}>
            <div style={sectionEyebrowStyle}>{t.appEyebrow}</div>
            <h2 style={{ ...sectionTitleStyle, fontSize: isMobile ? "28px" : "clamp(28px, 4vw, 42px)" }}>{t.appTitle}</h2>
            <p style={sectionTextStyle}>{t.appText}</p>
          </div>

          <div style={{ ...stepsGridStyle, gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {t.steps.map((step) => <StepCard key={step.number} number={step.number} title={step.title} text={step.text} />)}
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={{ ...screensSectionStyle, padding: isMobile ? "18px" : "22px" }}>
          <div style={sectionHeaderStyle}>
            <div style={sectionEyebrowStyle}>{t.screenshotsEyebrow}</div>
            <h2 style={{ ...sectionTitleStyle, fontSize: isMobile ? "28px" : "clamp(28px, 4vw, 42px)" }}>{t.screenshotsTitle}</h2>
          </div>

          <div style={{ ...screensGridStyle, gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {screenshots.map((shot, index) => (
              <ScreenshotCard key={shot.fileName} title={shot.title} text={shot.text} fileName={shot.fileName} onOpen={() => setSelectedShotIndex(index)} />
            ))}
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={{ ...affiliatePanelStyle, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", padding: isMobile ? "18px" : "24px" }}>
          <div style={affiliateTextColStyle}>
            <div style={sectionEyebrowStyle}>{t.affiliateEyebrow}</div>
            <h2 style={{ ...sectionTitleStyle, fontSize: isMobile ? "28px" : "clamp(28px, 4vw, 42px)" }}>{t.affiliateTitle}</h2>
            <p style={sectionTextStyle}>{t.affiliateText}</p>
            <p style={affiliateSmallTextStyle}>{t.affiliateSmall}</p>
          </div>

          <div style={affiliateActionWrapStyle}>
            <a href="mailto:Info@cardletics.com?subject=Affiliate%20Programm" style={{ ...buttonStyle, width: isMobile ? "100%" : "auto" }}>{t.affiliateCta}</a>
          </div>
        </div>
      </section>

      <div style={{ ...helpWidgetWrapStyle, right: isMobile ? "14px" : "18px", bottom: isMobile ? "14px" : "18px" }}>
        {helpOpen && (
          <div style={{ ...helpPanelStyle, width: isMobile ? "calc(100vw - 28px)" : "min(360px, calc(100vw - 36px))" }}>
            <div style={helpPanelHeaderStyle}>
              <div>
                <div style={helpTitleStyle}>{t.helpTitle}</div>
                <div style={helpSubtitleStyle}>{t.helpSubtitle}</div>
              </div>
              <button type="button" onClick={() => setHelpOpen(false)} style={helpCloseButtonStyle}>✕</button>
            </div>

            <div style={helpQuestionListStyle}>
              {t.quickQuestions.map((item) => <QuickQuestion key={item.text} text={item.text} answer={item.answer} />)}
            </div>
          </div>
        )}

        <button type="button" onClick={() => setHelpOpen((prev) => !prev)} style={{ ...helpLauncherStyle, minHeight: isMobile ? "46px" : "52px", padding: isMobile ? "10px 16px" : "12px 18px" }}>
          {t.helpButton}
        </button>
      </div>

      {selectedShot && selectedShotIndex !== null && (
        <Lightbox
          item={selectedShot}
          labels={{ close: t.close, prev: t.prev, next: t.next, swipeHint: t.swipeHint }}
          onClose={() => setSelectedShotIndex(null)}
          onPrev={() => setSelectedShotIndex((prev) => {
            if (prev === null) return null;
            return prev === 0 ? screenshots.length - 1 : prev - 1;
          })}
          onNext={() => setSelectedShotIndex((prev) => {
            if (prev === null) return null;
            return prev === screenshots.length - 1 ? 0 : prev + 1;
          })}
        />
      )}
    </main>
  );
}

const languageBarStyle: React.CSSProperties = {
  position: "absolute",
  top: "14px",
  right: "14px",
  zIndex: 5,
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "5px 7px",
  borderRadius: "999px",
  background: "rgba(8, 19, 12, 0.72)",
  border: "1px solid rgba(134,239,172,0.20)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
};

const languageFlagStyle: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: 1,
};

const languageLabelStyle: React.CSSProperties = {
  color: "#86efac",
  fontSize: "10px",
  fontWeight: 900,
  letterSpacing: "0.03em",
};

const languageSelectStyle: React.CSSProperties = {
  minHeight: "26px",
  maxWidth: "126px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "#111714",
  color: "#ffffff",
  padding: "3px 8px",
  fontSize: "11px",
  fontWeight: 900,
  outline: "none",
  cursor: "pointer",
};

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div style={featureCardStyle}>
      <h3 style={featureTitleStyle}>{title}</h3>
      <p style={featureTextStyle}>{text}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div style={stepCardStyle}>
      <div style={stepNumberStyle}>{number}</div>
      <h3 style={stepTitleStyle}>{title}</h3>
      <p style={stepTextStyle}>{text}</p>
    </div>
  );
}

function ScreenshotCard({
  title,
  text,
  fileName,
  onOpen,
}: {
  title: string;
  text: string;
  fileName: string;
  onOpen: () => void;
}) {
  return (
    <div style={screenshotCardStyle}>
      <button type="button" onClick={onOpen} style={screenshotButtonStyle}>
        <div style={phoneFrameOuterStyle}>
          <div style={phoneFrameInnerStyle}>
            <div style={phoneNotchStyle} />
            <div style={screenshotRealWrapStyle}>
              <img src={fileName} alt={title} style={screenshotImageStyle} />
            </div>
          </div>
        </div>
      </button>

      <div style={screenshotTextWrapStyle}>
        <h3 style={screenshotTitleStyle}>{title}</h3>
        <p style={screenshotTextStyle}>{text}</p>
      </div>
    </div>
  );
}

function Lightbox({
  item,
  labels,
  onClose,
  onPrev,
  onNext,
}: {
  item: ScreenshotItem;
  labels: { close: string; prev: string; next: string; swipeHint: string };
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    touchEndX.current = null;
    touchStartX.current = e.changedTouches[0].clientX;
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    touchEndX.current = e.changedTouches[0].clientX;
  }

  function handleTouchEnd() {
    if (touchStartX.current === null) return;

    const endX = touchEndX.current ?? touchStartX.current;
    const deltaX = touchStartX.current - endX;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) < minSwipeDistance) return;

    if (deltaX > 0) {
      onNext();
    } else {
      onPrev();
    }
  }

  return (
    <div style={lightboxOverlayStyle} onClick={onClose}>
      <div
        style={lightboxShellStyle}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={onClose}
          style={lightboxCloseStyle}
          aria-label={labels.close}
        >
          ✕
        </button>

        <button
          type="button"
          onClick={onPrev}
          style={{ ...lightboxArrowStyle, left: "12px" }}
          aria-label={labels.prev}
        >
          ‹
        </button>

        <button
          type="button"
          onClick={onNext}
          style={{ ...lightboxArrowStyle, right: "12px" }}
          aria-label={labels.next}
        >
          ›
        </button>

        <div style={lightboxContentStyle}>
          <div style={lightboxPhoneWrapStyle}>
            <img src={item.fileName} alt={item.title} style={lightboxImageStyle} />
          </div>

          <div style={lightboxSwipeHintStyle}>{labels.swipeHint}</div>

          <div style={lightboxTextStyle}>
            <h3 style={lightboxTitleStyle}>{item.title}</h3>
            <p style={lightboxDescStyle}>{item.text}</p>

            <div style={lightboxBottomButtonsStyle}>
              <button type="button" onClick={onPrev} style={lightboxMiniButtonStyle}>
                ‹ {labels.prev}
              </button>
              <button type="button" onClick={onClose} style={lightboxBackButtonStyle}>
                {labels.close}
              </button>
              <button type="button" onClick={onNext} style={lightboxMiniButtonStyle}>
                {labels.next} ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickQuestion({
  text,
  answer,
}: {
  text: string;
  answer: string;
}) {
  return (
    <details style={quickQuestionStyle}>
      <summary style={quickQuestionSummaryStyle}>{text}</summary>
      <p style={quickQuestionAnswerStyle}>{answer}</p>
    </details>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={statBoxStyle}>
      <div style={statLabelStyle}>{label}</div>
      <div style={statValueStyle}>{value}</div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 28%), linear-gradient(180deg, #09100d 0%, #0c120f 100%)",
  color: "white",
  fontFamily: "Arial, sans-serif",
  padding: "20px",
  position: "relative",
};

const affiliateSideButtonStyle: React.CSSProperties = {
  position: "fixed",
  right: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 30,
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  padding: "16px 10px",
  borderRadius: "16px",
  background: "linear-gradient(180deg, #22c55e 0%, #14532d 100%)",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 700,
  boxShadow: "0 10px 30px rgba(34,197,94,0.25)",
};

const affiliateInlineButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "48px",
  padding: "12px 18px",
  background: "linear-gradient(135deg, #22c55e 0%, #14532d 100%)",
  borderRadius: "14px",
  color: "#ffffff",
  fontWeight: 700,
  textDecoration: "none",
  boxShadow: "0 10px 24px rgba(34,197,94,0.22)",
};

const heroSectionStyle: React.CSSProperties = {
  position: "relative",
  maxWidth: "1200px",
  margin: "0 auto",
  borderRadius: "34px",
  overflow: "hidden",
  background:
    "linear-gradient(135deg, rgba(26,128,87,0.45) 0%, rgba(18,30,58,0.92) 100%)",
  border: "1px solid #2b3b33",
  boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
};

const heroGlowOneStyle: React.CSSProperties = {
  position: "absolute",
  top: "-60px",
  left: "-30px",
  width: "220px",
  height: "220px",
  borderRadius: "999px",
  background: "rgba(34,197,94,0.22)",
  filter: "blur(55px)",
};

const heroGlowTwoStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "-80px",
  right: "-40px",
  width: "260px",
  height: "260px",
  borderRadius: "999px",
  background: "rgba(59,130,246,0.18)",
  filter: "blur(65px)",
};

const heroInnerStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  maxWidth: "880px",
  margin: "0 auto",
  textAlign: "center",
};

const logoWrapperStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const logoOuterStyle: React.CSSProperties = {
  width: "180px",
  height: "180px",
  borderRadius: "40px",
  background:
    "linear-gradient(135deg, #22c55e 0%, #4ade80 35%, #0ea5e9 100%)",
  padding: "8px",
  boxShadow:
    "0 25px 80px rgba(34,197,94,0.45), inset 0 0 40px rgba(255,255,255,0.08)",
};

const logoInnerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: "32px",
  overflow: "hidden",
  background: "#000000",
};

const heroBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#c7f9d8",
  fontSize: "12px",
  fontWeight: 700,
  marginBottom: "18px",
};

const titleStyle: React.CSSProperties = {
  color: "#ffffff",
  letterSpacing: "-0.03em",
};

const subtitleStyle: React.CSSProperties = {
  maxWidth: "760px",
  color: "#c3d1ca",
  lineHeight: 1.7,
};

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "48px",
  padding: "12px 18px",
  background: "#22c55e",
  borderRadius: "14px",
  color: "#08130c",
  fontWeight: 700,
  textDecoration: "none",
  boxShadow: "0 10px 24px rgba(34,197,94,0.22)",
};

const buttonSecondaryStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "48px",
  padding: "12px 18px",
  background: "#1a2320",
  borderRadius: "14px",
  color: "#e7f1eb",
  border: "1px solid #2d3b35",
  fontWeight: 700,
  textDecoration: "none",
};

const heroHintStyle: React.CSSProperties = {
  marginTop: "16px",
  color: "#9db0a7",
  lineHeight: 1.6,
};

const sectionStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "28px auto 0 auto",
};

const statsStripStyle: React.CSSProperties = {
  display: "grid",
  gap: "12px",
};

const statBoxStyle: React.CSSProperties = {
  background: "#141b18",
  border: "1px solid #27312d",
  borderRadius: "18px",
  padding: "16px",
};

const statLabelStyle: React.CSSProperties = {
  color: "#86efac",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "6px",
};

const statValueStyle: React.CSSProperties = {
  color: "#e7f1eb",
  fontSize: "16px",
  lineHeight: 1.5,
};

const sectionHeaderStyle: React.CSSProperties = {
  marginBottom: "16px",
};

const sectionEyebrowStyle: React.CSSProperties = {
  display: "inline-block",
  marginBottom: "10px",
  color: "#86efac",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
  color: "#ffffff",
};

const sectionTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "16px",
  color: "#94a39b",
  lineHeight: 1.7,
};

const featureGridStyle: React.CSSProperties = {
  display: "grid",
  gap: "14px",
};

const featureCardStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #171f1c 0%, #121816 100%)",
  border: "1px solid #27312d",
  padding: "20px",
  borderRadius: "18px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
};

const featureTitleStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: "20px",
  color: "#ffffff",
};

const featureTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#94a39b",
  lineHeight: 1.65,
  fontSize: "15px",
};

const howItWorksPanelStyle: React.CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(20,83,45,0.18) 0%, rgba(15,23,42,0.18) 100%)",
  border: "1px solid #27312d",
  borderRadius: "24px",
};

const stepsGridStyle: React.CSSProperties = {
  display: "grid",
  gap: "14px",
};

const stepCardStyle: React.CSSProperties = {
  background: "#141b18",
  border: "1px solid #27312d",
  borderRadius: "18px",
  padding: "18px",
};

const stepNumberStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "999px",
  background: "#22c55e",
  color: "#08130c",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  marginBottom: "12px",
};

const stepTitleStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: "18px",
  color: "#ffffff",
};

const stepTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#94a39b",
  lineHeight: 1.6,
  fontSize: "14px",
};

const screensSectionStyle: React.CSSProperties = {
  background: "#111714",
  border: "1px solid #27312d",
  borderRadius: "24px",
};

const screensGridStyle: React.CSSProperties = {
  display: "grid",
  gap: "16px",
};

const screenshotCardStyle: React.CSSProperties = {
  background: "#141b18",
  border: "1px solid #27312d",
  borderRadius: "22px",
  padding: "16px",
};

const screenshotButtonStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: 0,
  border: "none",
  background: "transparent",
  cursor: "zoom-in",
};

const phoneFrameOuterStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "350px",
  margin: "0 auto",
  padding: "8px",
  borderRadius: "36px",
  background:
    "linear-gradient(180deg, #364152 0%, #0b0f13 55%, #1f2937 100%)",
  boxShadow:
    "0 28px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
};

const phoneFrameInnerStyle: React.CSSProperties = {
  position: "relative",
  borderRadius: "30px",
  background: "#000000",
  padding: "14px 8px 8px 8px",
  overflow: "hidden",
};

const phoneNotchStyle: React.CSSProperties = {
  position: "absolute",
  top: "6px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "92px",
  height: "16px",
  borderRadius: "999px",
  background: "#0a0a0a",
  boxShadow: "inset 0 -1px 2px rgba(255,255,255,0.08)",
  zIndex: 2,
};

const screenshotRealWrapStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  aspectRatio: "1080 / 2070",
  borderRadius: "24px",
  overflow: "hidden",
  background: "#000000",
};

const screenshotImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center top",
  display: "block",
};

const screenshotTextWrapStyle: React.CSSProperties = {
  marginTop: "14px",
};

const screenshotTitleStyle: React.CSSProperties = {
  margin: "0 0 6px 0",
  fontSize: "18px",
  color: "#ffffff",
};

const screenshotTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#94a39b",
  lineHeight: 1.6,
  fontSize: "14px",
};

const affiliatePanelStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  flexWrap: "wrap",
  background: "linear-gradient(180deg, #171f1c 0%, #121816 100%)",
  border: "1px solid #27312d",
  borderRadius: "24px",
};

const affiliateTextColStyle: React.CSSProperties = {
  maxWidth: "760px",
};

const affiliateSmallTextStyle: React.CSSProperties = {
  marginTop: "12px",
  color: "#9fb1a9",
  fontSize: "14px",
  lineHeight: 1.6,
};

const affiliateActionWrapStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const helpWidgetWrapStyle: React.CSSProperties = {
  position: "fixed",
  zIndex: 40,
};

const helpLauncherStyle: React.CSSProperties = {
  borderRadius: "999px",
  border: "1px solid #2c3b34",
  background: "#171f1c",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(0,0,0,0.22)",
};

const helpPanelStyle: React.CSSProperties = {
  marginBottom: "12px",
  background: "#111714",
  border: "1px solid #27312d",
  borderRadius: "20px",
  padding: "16px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.32)",
};

const helpPanelHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "14px",
};

const helpTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#ffffff",
  marginBottom: "4px",
};

const helpSubtitleStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#94a39b",
  lineHeight: 1.5,
};

const helpCloseButtonStyle: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "12px",
  border: "1px solid #27312d",
  background: "#171f1c",
  color: "#ffffff",
  cursor: "pointer",
};

const helpQuestionListStyle: React.CSSProperties = {
  display: "grid",
  gap: "10px",
};

const quickQuestionStyle: React.CSSProperties = {
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "14px",
  padding: "12px",
};

const quickQuestionSummaryStyle: React.CSSProperties = {
  cursor: "pointer",
  fontWeight: 700,
  color: "#e7f1eb",
};

const quickQuestionAnswerStyle: React.CSSProperties = {
  margin: "10px 0 0 0",
  color: "#94a39b",
  lineHeight: 1.6,
  fontSize: "14px",
};

const lightboxOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 200,
  background: "rgba(5, 10, 8, 0.88)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  boxSizing: "border-box",
};

const lightboxShellStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: "620px",
  touchAction: "pan-y",
};

const lightboxCloseStyle: React.CSSProperties = {
  position: "absolute",
  top: "12px",
  right: "12px",
  zIndex: 5,
  width: "44px",
  height: "44px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(23,31,28,0.96)",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: 700,
  boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const lightboxArrowStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 4,
  width: "46px",
  height: "46px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(23,31,28,0.96)",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: "28px",
  fontWeight: 700,
  boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const lightboxContentStyle: React.CSSProperties = {
  background: "#101714",
  border: "1px solid #27312d",
  borderRadius: "24px",
  padding: "18px",
  boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
};

const lightboxPhoneWrapStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "380px",
  margin: "0 auto",
  borderRadius: "28px",
  overflow: "hidden",
  background: "#000000",
  boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
};

const lightboxImageStyle: React.CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
};

const lightboxSwipeHintStyle: React.CSSProperties = {
  marginTop: "10px",
  textAlign: "center",
  color: "#86efac",
  fontSize: "13px",
  fontWeight: 700,
};

const lightboxTextStyle: React.CSSProperties = {
  marginTop: "16px",
  textAlign: "center",
};

const lightboxTitleStyle: React.CSSProperties = {
  margin: "0 0 6px 0",
  fontSize: "22px",
  color: "#ffffff",
};

const lightboxDescStyle: React.CSSProperties = {
  margin: 0,
  color: "#94a39b",
  lineHeight: 1.6,
  fontSize: "15px",
};

const lightboxBottomButtonsStyle: React.CSSProperties = {
  marginTop: "16px",
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const lightboxBackButtonStyle: React.CSSProperties = {
  minHeight: "46px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #2d3b35",
  background: "#22c55e",
  color: "#08130c",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 10px 24px rgba(34,197,94,0.22)",
};

const lightboxMiniButtonStyle: React.CSSProperties = {
  minHeight: "46px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #2d3b35",
  background: "#171f1c",
  color: "#e7f1eb",
  fontWeight: 700,
  cursor: "pointer",
};