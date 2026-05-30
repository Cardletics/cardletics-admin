
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
  languageLabel: string;
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

function makeScreens(items: { title: string; text: string }[]): ScreenshotItem[] {
  return items.map((item, index) => ({ ...item, fileName: screenshotFiles[index] }));
}

const translations: Record<LanguageKey, Translation> = {
  de: {
    languageName: "Deutsch",
    languageLabel: "Sprache",
    affiliate: "Affiliate",
    heroBadge: "Tracken • Sammeln • Kämpfen • Handeln",
    title: "Sportdaten werden\nzu Karten, Teams\nund echtem Fortschritt.",
    subtitle: "Cardletics verbindet echte Bewegung mit digitalem Sammelkarten-Gameplay. Laufe, trainiere und bleibe aktiv, um Karten zu verdienen, Sammlungen zu vervollständigen, Teams aufzubauen, Kämpfe zu bestreiten und über die interne Börse zu handeln.",
    appStore: "App Store – bald verfügbar",
    googlePlay: "Google Play – bald verfügbar",
    affiliateProgram: "Affiliate Programm",
    heroHint: "Cardletics ist kostenlos nutzbar und kann optional durch Abos, Coins und weitere Inhalte erweitert werden.",
    stats: [{"label": "Tracking", "value": "Bewegung wird Fortschritt"}, {"label": "Karten", "value": "Selten, sammelbar, handelbar"}, {"label": "Teams", "value": "Strategie & Kämpfe"}, {"label": "Marktplatz", "value": "Interne Börse"}],
    whatEyebrow: "Was ist Cardletics?",
    whatTitle: "Eine App, die Aktivität spielbar macht",
    whatText: "Statt nur Schritte oder Läufe zu zählen, macht Cardletics aus deiner Aktivität ein System aus Karten, Belohnungen, Sammlung, Status und Strategie. So wird Bewegung langfristig motivierender und sichtbarer.",
    features: [{"title": "Sport wird belohnt", "text": "Deine echte Aktivität im Alltag und beim Training wird zur Grundlage deines Fortschritts."}, {"title": "Karten mit Seltenheit", "text": "Du erhältst digitale Karten, kannst sie sammeln, präsentieren und ihre Seltenheit nutzen."}, {"title": "Teams bauen", "text": "Kombiniere Karten sinnvoll und stelle dein eigenes Team für Kämpfe zusammen."}, {"title": "Interne Börse", "text": "Karten können innerhalb des Systems gehandelt werden."}, {"title": "Kollektionen vervollständigen", "text": "Arbeite auf vollständige Sets hin und sammle besondere Auszeichnungen."}, {"title": "Auszeichnungen & Prestige", "text": "Besondere Leistungen, Serien und Fortschritte werden sichtbar belohnt."}],
    appEyebrow: "App erklärt",
    appTitle: "So nutzt man Cardletics",
    appText: "Damit sofort klar ist, wie die App funktioniert, zeigt diese Seite den Ablauf einfach und verständlich.",
    steps: [{"number": "1", "title": "Aktivität tracken", "text": "Du bewegst dich im echten Leben. Sport und Aktivität werden als Grundlage für deinen Fortschritt genutzt."}, {"number": "2", "title": "Karten verdienen", "text": "Für Aktivität, Fortschritt und besondere Leistungen erhältst du digitale Karten."}, {"number": "3", "title": "Sammeln und optimieren", "text": "Du vervollständigst Kollektionen, sammelst seltene Karten und verbesserst deine Auswahl."}, {"number": "4", "title": "Team bauen und kämpfen", "text": "Mit deinen Karten stellst du Teams zusammen und trittst in Kämpfen gegen andere an."}],
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Einblicke in die App",
    screenshots: makeScreens([{"title": "Startseite", "text": "Startbereich, Hauptnavigation und Überblick"}, {"title": "Kampfbereich", "text": "Teamkampf, Strategie und Kampfansicht"}, {"title": "Karte im Detail", "text": "Einzelne Karte mit Werten, Design und Seltenheit"}, {"title": "Auszeichnungen", "text": "Belohnungen, Erfolge und freigeschaltete Meilensteine"}, {"title": "Pack öffnen", "text": "Packs öffnen und neue Karten erhalten"}, {"title": "Sammlung", "text": "Sammlung, Sets und Vervollständigung"}, {"title": "Börse / Marktplatz", "text": "Interner Handel mit Karten"}, {"title": "Shop", "text": "Coins, Angebote und optionale In-App-Käufe"}, {"title": "Bewegung im Detail", "text": "Fortschritt, Aktivitätswerte und sportliche Entwicklung im Überblick"}, {"title": "Umgebung", "text": "Spieler in deiner Nähe entdecken und auf dem Radar anzeigen"}, {"title": "Events", "text": "Aktionen, Challenges und besondere In-App-Events entdecken"}, {"title": "Freunde", "text": "Freundesliste, Anfragen, Chats und Gruppen verwalten"}]),
    affiliateEyebrow: "Affiliate Programm",
    affiliateTitle: "Creator, Partner und Communities einbinden",
    affiliateText: "Cardletics soll auch durch Partner, Creator und Communities wachsen. Deshalb gibt es ein Affiliate-Programm, über das später Empfehlungen, Performance und mögliche Einnahmen sichtbar gemacht werden können.",
    affiliateSmall: "Später kann hier zusätzlich ein direkter Link zum Affiliate-Bereich in der App oder im Web ergänzt werden.",
    affiliateCta: "Affiliate anfragen",
    helpButton: "Hilfe",
    helpTitle: "Cardletics Hilfe",
    helpSubtitle: "Schnelle Antworten auf typische Fragen",
    quickQuestions: [{"text": "Wie funktioniert Cardletics?", "answer": "Du trackst Aktivität, erhältst Karten, sammelst Kollektionen, baust Teams und kannst Kämpfe bestreiten."}, {"text": "Ist die App kostenlos?", "answer": "Ja, die App ist grundsätzlich kostenlos nutzbar. Zusätzlich sind optionale Abos und In-App-Käufe möglich."}, {"text": "Kann man Karten handeln?", "answer": "Ja, Karten können innerhalb einer internen Börse gehandelt werden."}, {"text": "Wie läuft das Affiliate-Programm?", "answer": "Das Affiliate-Programm ist für Partner, Creator und Communities gedacht. Details und Tracking können später direkt im System sichtbar gemacht werden."}],
    close: "Schließen",
    prev: "Zurück",
    next: "Weiter",
    swipeHint: "← Wischen zum Wechseln →",
  },
  en: {
    languageName: "English",
    languageLabel: "Language",
    affiliate: "Affiliate",
    heroBadge: "Track • Collect • Battle • Trade",
    title: "Sports data becomes\ncards, teams\nand real progress.",
    subtitle: "Cardletics connects real movement with digital trading-card gameplay. Walk, train and stay active to earn cards, complete collections, build teams, battle and trade on the internal marketplace.",
    appStore: "App Store – coming soon",
    googlePlay: "Google Play – coming soon",
    affiliateProgram: "Affiliate Program",
    heroHint: "Cardletics is free to use and can optionally be expanded with subscriptions, coins and additional content.",
    stats: [{"label": "Tracking", "value": "Movement becomes progress"}, {"label": "Cards", "value": "Rare, collectible, tradable"}, {"label": "Teams", "value": "Strategy & battles"}, {"label": "Marketplace", "value": "Internal exchange"}],
    whatEyebrow: "What is Cardletics?",
    whatTitle: "An app that turns activity into gameplay",
    whatText: "Instead of only counting steps or runs, Cardletics turns your activity into cards, rewards, collections, status and strategy.",
    features: [{"title": "Sport is rewarded", "text": "Your real activity in everyday life and training becomes the basis for your progress."}, {"title": "Cards with rarity", "text": "Earn digital cards, collect them, showcase them and use their rarity."}, {"title": "Build teams", "text": "Combine cards wisely and create your own team for battles."}, {"title": "Internal marketplace", "text": "Cards can be traded within the system."}, {"title": "Complete collections", "text": "Work toward full sets and collect special awards."}, {"title": "Awards & prestige", "text": "Special achievements, series and progress become visible rewards."}],
    appEyebrow: "App explained",
    appTitle: "How to use Cardletics",
    appText: "This page explains the core flow in a simple and clear way.",
    steps: [{"number": "1", "title": "Track activity", "text": "Move in real life. Sports and activity become the base for your progress."}, {"number": "2", "title": "Earn cards", "text": "Get digital cards for activity, progress and special achievements."}, {"number": "3", "title": "Collect and optimize", "text": "Complete collections, collect rare cards and improve your lineup."}, {"number": "4", "title": "Build teams and battle", "text": "Create teams with your cards and compete against others."}],
    screenshotsEyebrow: "Screenshots",
    screenshotsTitle: "Inside the app",
    screenshots: makeScreens([{"title": "Home", "text": "Start area, main navigation and overview"}, {"title": "Battle Area", "text": "Team battles, strategy and battle view"}, {"title": "Card Details", "text": "Single card with values, design and rarity"}, {"title": "Awards", "text": "Rewards, achievements and unlocked milestones"}, {"title": "Open Pack", "text": "Open packs and receive new cards"}, {"title": "Collection", "text": "Collection, sets and completion"}, {"title": "Marketplace", "text": "Internal card trading"}, {"title": "Shop", "text": "Coins, offers and optional in-app purchases"}, {"title": "Movement Details", "text": "Progress, activity values and sport development"}, {"title": "Nearby", "text": "Discover nearby players on the radar"}, {"title": "Events", "text": "Actions, challenges and special in-app events"}, {"title": "Friends", "text": "Friend list, requests, chats and groups"}]),
    affiliateEyebrow: "Affiliate Program",
    affiliateTitle: "Connect creators, partners and communities",
    affiliateText: "Cardletics can grow with partners, creators and communities. The affiliate program is designed for recommendations, performance and potential revenue tracking.",
    affiliateSmall: "A direct link to the affiliate area can be added here later.",
    affiliateCta: "Request affiliate access",
    helpButton: "Help",
    helpTitle: "Cardletics Help",
    helpSubtitle: "Quick answers to common questions",
    quickQuestions: [{"text": "How does Cardletics work?", "answer": "You track activity, earn cards, collect sets, build teams and battle."}, {"text": "Is the app free?", "answer": "Yes. The app is free to use with optional subscriptions and in-app purchases."}, {"text": "Can cards be traded?", "answer": "Yes, cards can be traded on an internal marketplace."}, {"text": "How does the affiliate program work?", "answer": "It is intended for partners, creators and communities. Details can later be shown directly in the system."}],
    close: "Close",
    prev: "Back",
    next: "Next",
    swipeHint: "← Swipe to switch →",
  },
  es: {
    languageName: "Español",
    languageLabel: "Idioma",
    affiliate: "Afiliados",
    heroBadge: "Registrar • Coleccionar • Combatir • Comerciar",
    title: "Los datos deportivos se convierten\nen cartas, equipos\ny progreso real.",
    subtitle: "Cardletics conecta el movimiento real con un juego digital de cartas coleccionables. Camina, entrena y mantente activo para ganar cartas, completar colecciones, crear equipos, combatir y comerciar en el mercado interno.",
    appStore: "App Store – próximamente",
    googlePlay: "Google Play – próximamente",
    affiliateProgram: "Programa de afiliados",
    heroHint: "Cardletics se puede usar gratis y se puede ampliar de forma opcional con suscripciones, monedas y contenido adicional.",
    stats: [{"label": "Seguimiento", "value": "El movimiento se convierte en progreso"}, {"label": "Cartas", "value": "Raras, coleccionables, comerciables"}, {"label": "Equipos", "value": "Estrategia y combates"}, {"label": "Mercado", "value": "Intercambio interno"}],
    whatEyebrow: "¿Qué es Cardletics?",
    whatTitle: "Una app que convierte la actividad en juego",
    whatText: "En lugar de contar solo pasos o carreras, Cardletics convierte tu actividad en cartas, recompensas, colecciones, estado y estrategia.",
    features: [{"title": "El deporte se recompensa", "text": "Tu actividad real en el día a día y en el entrenamiento se convierte en la base de tu progreso."}, {"title": "Cartas con rareza", "text": "Obtienes cartas digitales, puedes coleccionarlas, mostrarlas y aprovechar su rareza."}, {"title": "Crear equipos", "text": "Combina cartas de forma inteligente y crea tu propio equipo para los combates."}, {"title": "Mercado interno", "text": "Las cartas se pueden comerciar dentro del sistema."}, {"title": "Completar colecciones", "text": "Avanza hacia sets completos y consigue premios especiales."}, {"title": "Premios y prestigio", "text": "Los logros especiales, series y progresos se convierten en recompensas visibles."}],
    appEyebrow: "App explicada",
    appTitle: "Cómo usar Cardletics",
    appText: "Esta página explica el flujo principal de forma sencilla y clara.",
    steps: [{"number": "1", "title": "Registrar actividad", "text": "Te mueves en la vida real. El deporte y la actividad son la base de tu progreso."}, {"number": "2", "title": "Ganar cartas", "text": "Recibes cartas digitales por actividad, progreso y logros especiales."}, {"number": "3", "title": "Coleccionar y optimizar", "text": "Completas colecciones, reúnes cartas raras y mejoras tu selección."}, {"number": "4", "title": "Crear equipos y combatir", "text": "Formas equipos con tus cartas y compites contra otros."}],
    screenshotsEyebrow: "Capturas",
    screenshotsTitle: "Vistas de la app",
    screenshots: makeScreens([{"title": "Inicio", "text": "Zona inicial, navegación principal y resumen"}, {"title": "Combate", "text": "Combates de equipo, estrategia y vista de batalla"}, {"title": "Detalle de carta", "text": "Carta individual con valores, diseño y rareza"}, {"title": "Premios", "text": "Recompensas, logros e hitos desbloqueados"}, {"title": "Abrir pack", "text": "Abrir packs y recibir cartas nuevas"}, {"title": "Colección", "text": "Colección, sets y finalización"}, {"title": "Mercado", "text": "Comercio interno de cartas"}, {"title": "Tienda", "text": "Monedas, ofertas y compras opcionales"}, {"title": "Movimiento en detalle", "text": "Progreso, valores de actividad y evolución deportiva"}, {"title": "Cerca de ti", "text": "Descubrir jugadores cercanos en el radar"}, {"title": "Eventos", "text": "Acciones, desafíos y eventos especiales"}, {"title": "Amigos", "text": "Lista de amigos, solicitudes, chats y grupos"}]),
    affiliateEyebrow: "Programa de afiliados",
    affiliateTitle: "Conectar creadores, socios y comunidades",
    affiliateText: "Cardletics puede crecer con socios, creadores y comunidades mediante recomendaciones, rendimiento y posibles ingresos.",
    affiliateSmall: "Más adelante se puede añadir un enlace directo al área de afiliados.",
    affiliateCta: "Solicitar afiliación",
    helpButton: "Ayuda",
    helpTitle: "Ayuda de Cardletics",
    helpSubtitle: "Respuestas rápidas a preguntas frecuentes",
    quickQuestions: [{"text": "¿Cómo funciona Cardletics?", "answer": "Registras actividad, ganas cartas, coleccionas sets, formas equipos y combates."}, {"text": "¿La app es gratis?", "answer": "Sí. La app se puede usar gratis con suscripciones y compras opcionales."}, {"text": "¿Se pueden comerciar cartas?", "answer": "Sí, las cartas se pueden comerciar en un mercado interno."}, {"text": "¿Cómo funciona el programa de afiliados?", "answer": "Está pensado para socios, creadores y comunidades. Los detalles podrán verse más adelante en el sistema."}],
    close: "Cerrar",
    prev: "Atrás",
    next: "Siguiente",
    swipeHint: "← Desliza para cambiar →",
  },
  fr: {
    languageName: "Français",
    languageLabel: "Langue",
    affiliate: "Affiliation",
    heroBadge: "Suivre • Collectionner • Combattre • Échanger",
    title: "Les données sportives deviennent\ndes cartes, des équipes\net de vrais progrès.",
    subtitle: "Cardletics relie le mouvement réel à un gameplay numérique de cartes à collectionner. Marchez, entraînez-vous et restez actif pour gagner des cartes, compléter des collections, créer des équipes, combattre et échanger sur le marché interne.",
    appStore: "App Store – bientôt disponible",
    googlePlay: "Google Play – bientôt disponible",
    affiliateProgram: "Programme d’affiliation",
    heroHint: "Cardletics est gratuit et peut être complété en option par des abonnements, des pièces et du contenu supplémentaire.",
    stats: [{"label": "Suivi", "value": "Le mouvement devient du progrès"}, {"label": "Cartes", "value": "Rares, collectionnables, échangeables"}, {"label": "Équipes", "value": "Stratégie et combats"}, {"label": "Marché", "value": "Échange interne"}],
    whatEyebrow: "Qu’est-ce que Cardletics ?",
    whatTitle: "Une app qui rend l’activité ludique",
    whatText: "Au lieu de seulement compter les pas ou les courses, Cardletics transforme votre activité en cartes, récompenses, collections, statut et stratégie.",
    features: [{"title": "Le sport est récompensé", "text": "Votre activité réelle au quotidien et à l’entraînement devient la base de votre progression."}, {"title": "Cartes avec rareté", "text": "Vous obtenez des cartes numériques, pouvez les collectionner, les présenter et utiliser leur rareté."}, {"title": "Créer des équipes", "text": "Combinez les cartes intelligemment et créez votre équipe pour les combats."}, {"title": "Marché interne", "text": "Les cartes peuvent être échangées dans le système."}, {"title": "Compléter les collections", "text": "Progressez vers des sets complets et gagnez des récompenses spéciales."}, {"title": "Récompenses & prestige", "text": "Les succès, séries et progrès deviennent des récompenses visibles."}],
    appEyebrow: "App expliquée",
    appTitle: "Comment utiliser Cardletics",
    appText: "Cette page explique le déroulement principal de manière simple et claire.",
    steps: [{"number": "1", "title": "Suivre l’activité", "text": "Vous bougez dans la vraie vie. Le sport et l’activité servent de base à votre progression."}, {"number": "2", "title": "Gagner des cartes", "text": "Recevez des cartes numériques grâce à l’activité, au progrès et aux succès spéciaux."}, {"number": "3", "title": "Collectionner et optimiser", "text": "Complétez des collections, collectionnez des cartes rares et améliorez votre sélection."}, {"number": "4", "title": "Créer des équipes et combattre", "text": "Formez des équipes avec vos cartes et affrontez d’autres joueurs."}],
    screenshotsEyebrow: "Captures d’écran",
    screenshotsTitle: "Aperçus de l’app",
    screenshots: makeScreens([{"title": "Accueil", "text": "Zone de départ, navigation principale et aperçu"}, {"title": "Combat", "text": "Combats d’équipe, stratégie et vue de bataille"}, {"title": "Détail de carte", "text": "Carte individuelle avec valeurs, design et rareté"}, {"title": "Récompenses", "text": "Récompenses, succès et jalons débloqués"}, {"title": "Ouvrir un pack", "text": "Ouvrir des packs et recevoir de nouvelles cartes"}, {"title": "Collection", "text": "Collection, sets et complétion"}, {"title": "Marché", "text": "Échange interne de cartes"}, {"title": "Boutique", "text": "Pièces, offres et achats optionnels"}, {"title": "Mouvement en détail", "text": "Progrès, valeurs d’activité et évolution sportive"}, {"title": "À proximité", "text": "Découvrir des joueurs proches sur le radar"}, {"title": "Événements", "text": "Actions, défis et événements spéciaux"}, {"title": "Amis", "text": "Liste d’amis, demandes, chats et groupes"}]),
    affiliateEyebrow: "Programme d’affiliation",
    affiliateTitle: "Connecter créateurs, partenaires et communautés",
    affiliateText: "Cardletics peut grandir avec des partenaires, créateurs et communautés grâce aux recommandations, au suivi et à de possibles revenus.",
    affiliateSmall: "Un lien direct vers l’espace d’affiliation pourra être ajouté plus tard.",
    affiliateCta: "Demander l’affiliation",
    helpButton: "Aide",
    helpTitle: "Aide Cardletics",
    helpSubtitle: "Réponses rapides aux questions fréquentes",
    quickQuestions: [{"text": "Comment fonctionne Cardletics ?", "answer": "Vous suivez votre activité, gagnez des cartes, collectionnez des sets, créez des équipes et combattez."}, {"text": "L’app est-elle gratuite ?", "answer": "Oui. L’app est gratuite avec des abonnements et achats optionnels."}, {"text": "Peut-on échanger des cartes ?", "answer": "Oui, les cartes peuvent être échangées sur un marché interne."}, {"text": "Comment fonctionne le programme d’affiliation ?", "answer": "Il est destiné aux partenaires, créateurs et communautés. Les détails pourront être affichés dans le système."}],
    close: "Fermer",
    prev: "Retour",
    next: "Suivant",
    swipeHint: "← Balayez pour changer →",
  },
  pt: {
    languageName: "Português",
    languageLabel: "Idioma",
    affiliate: "Afiliados",
    heroBadge: "Rastrear • Colecionar • Batalhar • Negociar",
    title: "Dados esportivos viram\ncartas, equipes\ne progresso real.",
    subtitle: "Cardletics conecta movimento real com gameplay digital de cartas colecionáveis. Caminhe, treine e mantenha-se ativo para ganhar cartas, completar coleções, montar equipes, batalhar e negociar no mercado interno.",
    appStore: "App Store – em breve",
    googlePlay: "Google Play – em breve",
    affiliateProgram: "Programa de afiliados",
    heroHint: "Cardletics é gratuito e pode ser ampliado opcionalmente com assinaturas, moedas e conteúdo adicional.",
    stats: [{"label": "Rastreamento", "value": "Movimento vira progresso"}, {"label": "Cartas", "value": "Raras, colecionáveis, negociáveis"}, {"label": "Equipes", "value": "Estratégia e batalhas"}, {"label": "Mercado", "value": "Troca interna"}],
    whatEyebrow: "O que é Cardletics?",
    whatTitle: "Um app que transforma atividade em jogo",
    whatText: "Em vez de apenas contar passos ou corridas, Cardletics transforma sua atividade em cartas, recompensas, coleções, status e estratégia.",
    features: [{"title": "Esporte é recompensado", "text": "Sua atividade real no dia a dia e no treino vira a base do seu progresso."}, {"title": "Cartas com raridade", "text": "Ganhe cartas digitais, colecione, exiba e use sua raridade."}, {"title": "Monte equipes", "text": "Combine cartas com inteligência e crie seu time para batalhas."}, {"title": "Mercado interno", "text": "As cartas podem ser negociadas dentro do sistema."}, {"title": "Complete coleções", "text": "Avance em direção a conjuntos completos e conquiste prêmios especiais."}, {"title": "Prêmios e prestígio", "text": "Conquistas, séries e progresso viram recompensas visíveis."}],
    appEyebrow: "App explicada",
    appTitle: "Como usar Cardletics",
    appText: "Esta página explica o fluxo principal de forma simples e clara.",
    steps: [{"number": "1", "title": "Rastrear atividade", "text": "Você se move na vida real. Esporte e atividade são a base do progresso."}, {"number": "2", "title": "Ganhar cartas", "text": "Receba cartas digitais por atividade, progresso e conquistas especiais."}, {"number": "3", "title": "Colecionar e otimizar", "text": "Complete coleções, junte cartas raras e melhore sua seleção."}, {"number": "4", "title": "Montar equipes e batalhar", "text": "Crie equipes com suas cartas e compita contra outros."}],
    screenshotsEyebrow: "Capturas",
    screenshotsTitle: "Visões do app",
    screenshots: makeScreens([{"title": "Início", "text": "Área inicial, navegação e visão geral"}, {"title": "Batalha", "text": "Batalhas de equipe, estratégia e tela de batalha"}, {"title": "Detalhes da carta", "text": "Carta individual com valores, design e raridade"}, {"title": "Prêmios", "text": "Recompensas, conquistas e marcos desbloqueados"}, {"title": "Abrir pack", "text": "Abra packs e receba novas cartas"}, {"title": "Coleção", "text": "Coleção, conjuntos e conclusão"}, {"title": "Mercado", "text": "Comércio interno de cartas"}, {"title": "Loja", "text": "Moedas, ofertas e compras opcionais"}, {"title": "Movimento em detalhe", "text": "Progresso, atividade e evolução esportiva"}, {"title": "Perto", "text": "Descubra jogadores próximos no radar"}, {"title": "Eventos", "text": "Ações, desafios e eventos especiais"}, {"title": "Amigos", "text": "Lista de amigos, pedidos, chats e grupos"}]),
    affiliateEyebrow: "Programa de afiliados",
    affiliateTitle: "Conectar criadores, parceiros e comunidades",
    affiliateText: "Cardletics pode crescer com parceiros, criadores e comunidades por recomendações, desempenho e possíveis receitas.",
    affiliateSmall: "Um link direto para a área de afiliados pode ser adicionado depois.",
    affiliateCta: "Solicitar afiliação",
    helpButton: "Ajuda",
    helpTitle: "Ajuda Cardletics",
    helpSubtitle: "Respostas rápidas para perguntas comuns",
    quickQuestions: [{"text": "Como funciona o Cardletics?", "answer": "Você rastreia atividade, ganha cartas, coleciona conjuntos, monta equipes e batalha."}, {"text": "O app é gratuito?", "answer": "Sim. O app é gratuito com assinaturas e compras opcionais."}, {"text": "É possível negociar cartas?", "answer": "Sim, cartas podem ser negociadas em um mercado interno."}, {"text": "Como funciona o programa de afiliados?", "answer": "Ele é pensado para parceiros, criadores e comunidades. Detalhes podem aparecer depois no sistema."}],
    close: "Fechar",
    prev: "Voltar",
    next: "Próximo",
    swipeHint: "← Deslize para mudar →",
  },
  zh: {
    languageName: "中文",
    languageLabel: "语言",
    affiliate: "联盟",
    heroBadge: "追踪 • 收集 • 对战 • 交易",
    title: "运动数据变成\n卡牌、队伍\n和真实进度。",
    subtitle: "Cardletics 将真实运动与数字集换式卡牌玩法结合。步行、训练并保持活跃，即可获得卡牌、完成收藏、组建队伍、参与对战并在内部市场交易。",
    appStore: "App Store – 即将推出",
    googlePlay: "Google Play – 即将推出",
    affiliateProgram: "联盟计划",
    heroHint: "Cardletics 可免费使用，也可通过订阅、金币和额外内容进行扩展。",
    stats: [{"label": "追踪", "value": "运动变成进度"}, {"label": "卡牌", "value": "稀有、可收集、可交易"}, {"label": "队伍", "value": "策略与对战"}, {"label": "市场", "value": "内部交易"}],
    whatEyebrow: "什么是 Cardletics？",
    whatTitle: "把活动变成玩法的应用",
    whatText: "Cardletics 不只是记录步数或跑步，而是把你的活动转化为卡牌、奖励、收藏、状态和策略。",
    features: [{"title": "运动会被奖励", "text": "你在日常和训练中的真实活动会成为进度的基础。"}, {"title": "带稀有度的卡牌", "text": "获得数字卡牌，收藏、展示并利用它们的稀有度。"}, {"title": "组建队伍", "text": "合理组合卡牌，为对战打造自己的队伍。"}, {"title": "内部市场", "text": "卡牌可以在系统内交易。"}, {"title": "完成收藏", "text": "向完整套装前进，并获得特殊奖励。"}, {"title": "奖励与声望", "text": "特殊成就、系列和进度都会成为可见奖励。"}],
    appEyebrow: "应用说明",
    appTitle: "如何使用 Cardletics",
    appText: "本页用简单清楚的方式说明核心流程。",
    steps: [{"number": "1", "title": "追踪活动", "text": "在现实生活中运动。运动和活动会成为你的进度基础。"}, {"number": "2", "title": "获得卡牌", "text": "通过活动、进度和特殊成就获得数字卡牌。"}, {"number": "3", "title": "收藏并优化", "text": "完成收藏、收集稀有卡牌并提升阵容。"}, {"number": "4", "title": "组队并对战", "text": "用你的卡牌组建队伍，与其他玩家竞争。"}],
    screenshotsEyebrow: "截图",
    screenshotsTitle: "应用预览",
    screenshots: makeScreens([{"title": "首页", "text": "起始区域、主导航和概览"}, {"title": "对战区", "text": "团队对战、策略和战斗视图"}, {"title": "卡牌详情", "text": "包含数值、设计和稀有度的单张卡牌"}, {"title": "奖励", "text": "奖励、成就和已解锁里程碑"}, {"title": "打开卡包", "text": "打开卡包并获得新卡牌"}, {"title": "收藏", "text": "收藏、套装和完成度"}, {"title": "市场", "text": "内部卡牌交易"}, {"title": "商店", "text": "金币、优惠和可选内购"}, {"title": "运动详情", "text": "进度、活动数值和运动发展"}, {"title": "附近", "text": "在雷达上发现附近玩家"}, {"title": "活动", "text": "行动、挑战和特殊应用内活动"}, {"title": "好友", "text": "好友列表、请求、聊天和群组"}]),
    affiliateEyebrow: "联盟计划",
    affiliateTitle: "连接创作者、合作伙伴和社区",
    affiliateText: "Cardletics 可以通过合作伙伴、创作者和社区成长，并展示推荐、表现和潜在收益。",
    affiliateSmall: "以后可以在这里添加联盟区域的直接链接。",
    affiliateCta: "申请联盟",
    helpButton: "帮助",
    helpTitle: "Cardletics 帮助",
    helpSubtitle: "常见问题快速回答",
    quickQuestions: [{"text": "Cardletics 如何运作？", "answer": "追踪活动、获得卡牌、收集套装、组建队伍并对战。"}, {"text": "应用免费吗？", "answer": "是的，应用可免费使用，也有可选订阅和内购。"}, {"text": "卡牌可以交易吗？", "answer": "可以，卡牌可在内部市场交易。"}, {"text": "联盟计划如何运作？", "answer": "它面向合作伙伴、创作者和社区。更多细节之后会在系统中显示。"}],
    close: "关闭",
    prev: "返回",
    next: "下一步",
    swipeHint: "← 滑动切换 →",
  },
  hi: {
    languageName: "हिन्दी",
    languageLabel: "भाषा",
    affiliate: "एफ़िलिएट",
    heroBadge: "ट्रैक • कलेक्ट • बैटल • ट्रेड",
    title: "खेल डेटा बनता है\nकार्ड, टीमें\nऔर असली प्रगति।",
    subtitle: "Cardletics वास्तविक गतिविधि को डिजिटल ट्रेडिंग-कार्ड गेमप्ले से जोड़ता है। चलें, ट्रेनिंग करें और सक्रिय रहें ताकि कार्ड मिलें, कलेक्शन पूरे हों, टीमें बनें, मुकाबले हों और अंदरूनी मार्केट में ट्रेड हो।",
    appStore: "App Store – जल्द उपलब्ध",
    googlePlay: "Google Play – जल्द उपलब्ध",
    affiliateProgram: "एफ़िलिएट प्रोग्राम",
    heroHint: "Cardletics मुफ्त में उपयोग किया जा सकता है और वैकल्पिक रूप से सब्सक्रिप्शन, कॉइन और अतिरिक्त सामग्री से बढ़ाया जा सकता है।",
    stats: [{"label": "ट्रैकिंग", "value": "गतिविधि प्रगति बनती है"}, {"label": "कार्ड", "value": "दुर्लभ, संग्रह योग्य, ट्रेड योग्य"}, {"label": "टीम", "value": "रणनीति और मुकाबले"}, {"label": "मार्केट", "value": "आंतरिक एक्सचेंज"}],
    whatEyebrow: "Cardletics क्या है?",
    whatTitle: "एक ऐप जो गतिविधि को गेमप्ले बनाता है",
    whatText: "Cardletics सिर्फ कदम या रन नहीं गिनता; यह आपकी गतिविधि को कार्ड, पुरस्कार, कलेक्शन, स्टेटस और रणनीति में बदलता है।",
    features: [{"title": "खेल का पुरस्कार मिलता है", "text": "आपकी वास्तविक दैनिक और ट्रेनिंग गतिविधि आपकी प्रगति का आधार बनती है।"}, {"title": "दुर्लभता वाले कार्ड", "text": "डिजिटल कार्ड पाएं, संग्रह करें, दिखाएं और उनकी दुर्लभता का उपयोग करें।"}, {"title": "टीम बनाएं", "text": "कार्डों को समझदारी से मिलाकर मुकाबलों के लिए अपनी टीम बनाएं।"}, {"title": "आंतरिक मार्केट", "text": "कार्ड सिस्टम के भीतर ट्रेड किए जा सकते हैं।"}, {"title": "कलेक्शन पूरा करें", "text": "पूरे सेट की ओर बढ़ें और विशेष पुरस्कार पाएं।"}, {"title": "अवार्ड और प्रतिष्ठा", "text": "विशेष उपलब्धियां, सीरीज़ और प्रगति दिखने वाले पुरस्कार बनते हैं।"}],
    appEyebrow: "ऐप समझाया गया",
    appTitle: "Cardletics कैसे उपयोग करें",
    appText: "यह पेज मुख्य प्रक्रिया को सरल और साफ तरीके से समझाता है।",
    steps: [{"number": "1", "title": "गतिविधि ट्रैक करें", "text": "आप वास्तविक जीवन में चलते हैं। खेल और गतिविधि प्रगति का आधार बनते हैं।"}, {"number": "2", "title": "कार्ड कमाएं", "text": "गतिविधि, प्रगति और विशेष उपलब्धियों के लिए डिजिटल कार्ड पाएं।"}, {"number": "3", "title": "संग्रह और सुधार", "text": "कलेक्शन पूरा करें, दुर्लभ कार्ड जमा करें और अपनी चयन सूची सुधारें।"}, {"number": "4", "title": "टीम बनाएं और मुकाबला करें", "text": "अपने कार्डों से टीम बनाकर दूसरों से मुकाबला करें।"}],
    screenshotsEyebrow: "स्क्रीनशॉट",
    screenshotsTitle: "ऐप की झलक",
    screenshots: makeScreens([{"title": "होम", "text": "शुरुआत, मुख्य नेविगेशन और अवलोकन"}, {"title": "बैटल क्षेत्र", "text": "टीम मुकाबले, रणनीति और बैटल दृश्य"}, {"title": "कार्ड विवरण", "text": "मान, डिज़ाइन और दुर्लभता वाला कार्ड"}, {"title": "अवार्ड", "text": "पुरस्कार, उपलब्धियां और खुले माइलस्टोन"}, {"title": "पैक खोलें", "text": "पैक खोलें और नए कार्ड पाएं"}, {"title": "कलेक्शन", "text": "संग्रह, सेट और पूर्णता"}, {"title": "मार्केट", "text": "आंतरिक कार्ड ट्रेडिंग"}, {"title": "शॉप", "text": "कॉइन, ऑफ़र और वैकल्पिक खरीदारी"}, {"title": "गतिविधि विवरण", "text": "प्रगति, गतिविधि मान और खेल विकास"}, {"title": "आस-पास", "text": "रडार पर नज़दीकी खिलाड़ी खोजें"}, {"title": "इवेंट", "text": "एक्शन, चैलेंज और विशेष इवेंट"}, {"title": "दोस्त", "text": "दोस्त सूची, अनुरोध, चैट और समूह"}]),
    affiliateEyebrow: "एफ़िलिएट प्रोग्राम",
    affiliateTitle: "क्रिएटर, पार्टनर और कम्युनिटी जोड़ें",
    affiliateText: "Cardletics पार्टनर, क्रिएटर और कम्युनिटी के साथ बढ़ सकता है और रेफरल, प्रदर्शन तथा संभावित आय दिखा सकता है।",
    affiliateSmall: "बाद में यहां एफ़िलिएट क्षेत्र का सीधा लिंक जोड़ा जा सकता है।",
    affiliateCta: "एफ़िलिएट अनुरोध",
    helpButton: "मदद",
    helpTitle: "Cardletics मदद",
    helpSubtitle: "सामान्य प्रश्नों के तेज उत्तर",
    quickQuestions: [{"text": "Cardletics कैसे काम करता है?", "answer": "आप गतिविधि ट्रैक करते हैं, कार्ड कमाते हैं, सेट संग्रह करते हैं, टीम बनाते हैं और मुकाबला करते हैं।"}, {"text": "क्या ऐप मुफ्त है?", "answer": "हाँ। ऐप मुफ्त है, वैकल्पिक सब्सक्रिप्शन और खरीदारी उपलब्ध हैं।"}, {"text": "क्या कार्ड ट्रेड किए जा सकते हैं?", "answer": "हाँ, कार्ड आंतरिक मार्केट में ट्रेड किए जा सकते हैं।"}, {"text": "एफ़िलिएट प्रोग्राम कैसे काम करता है?", "answer": "यह पार्टनर, क्रिएटर और कम्युनिटी के लिए है। विवरण बाद में सिस्टम में दिखेंगे।"}],
    close: "बंद करें",
    prev: "पीछे",
    next: "आगे",
    swipeHint: "← बदलने के लिए स्वाइप करें →",
  },
  ar: {
    languageName: "العربية",
    languageLabel: "اللغة",
    affiliate: "التسويق بالعمولة",
    heroBadge: "تتبّع • اجمع • قاتل • تداول",
    title: "تتحول بيانات الرياضة\nإلى بطاقات وفرق\nوتقدم حقيقي.",
    subtitle: "يربط Cardletics الحركة الحقيقية بأسلوب لعب بطاقات رقمية قابلة للجمع. امشِ وتدرّب وابقَ نشيطًا لتحصل على بطاقات وتكمل المجموعات وتبني فرقًا وتخوض المعارك وتتداول في السوق الداخلي.",
    appStore: "App Store – قريبًا",
    googlePlay: "Google Play – قريبًا",
    affiliateProgram: "برنامج الشراكة",
    heroHint: "يمكن استخدام Cardletics مجانًا، مع إمكانية إضافة اشتراكات وعملات ومحتوى إضافي اختياريًا.",
    stats: [{"label": "التتبع", "value": "الحركة تصبح تقدماً"}, {"label": "البطاقات", "value": "نادرة، قابلة للجمع والتداول"}, {"label": "الفرق", "value": "استراتيجية ومعارك"}, {"label": "السوق", "value": "تبادل داخلي"}],
    whatEyebrow: "ما هو Cardletics؟",
    whatTitle: "تطبيق يجعل النشاط قابلاً للعب",
    whatText: "بدلاً من عدّ الخطوات أو الجري فقط، يحول Cardletics نشاطك إلى بطاقات ومكافآت ومجموعات وحالة واستراتيجية.",
    features: [{"title": "تتم مكافأة الرياضة", "text": "نشاطك الحقيقي في الحياة اليومية والتدريب يصبح أساس تقدمك."}, {"title": "بطاقات بندرة مختلفة", "text": "احصل على بطاقات رقمية واجمعها واعرضها واستخدم ندرتها."}, {"title": "ابنِ الفرق", "text": "ادمج البطاقات بذكاء وأنشئ فريقك للمعارك."}, {"title": "سوق داخلي", "text": "يمكن تداول البطاقات داخل النظام."}, {"title": "أكمل المجموعات", "text": "اعمل على إكمال المجموعات واجمع جوائز خاصة."}, {"title": "جوائز ومكانة", "text": "الإنجازات والسلاسل والتقدم تصبح مكافآت مرئية."}],
    appEyebrow: "شرح التطبيق",
    appTitle: "طريقة استخدام Cardletics",
    appText: "تشرح هذه الصفحة المسار الأساسي بطريقة بسيطة وواضحة.",
    steps: [{"number": "1", "title": "تتبّع النشاط", "text": "تتحرك في الحياة الحقيقية. الرياضة والنشاط هما أساس التقدم."}, {"number": "2", "title": "اكسب البطاقات", "text": "احصل على بطاقات رقمية مقابل النشاط والتقدم والإنجازات الخاصة."}, {"number": "3", "title": "اجمع وحسّن", "text": "أكمل المجموعات واجمع البطاقات النادرة وحسّن تشكيلتك."}, {"number": "4", "title": "ابنِ فرقاً وقاتل", "text": "أنشئ فرقاً ببطاقاتك وتنافس ضد الآخرين."}],
    screenshotsEyebrow: "لقطات الشاشة",
    screenshotsTitle: "نظرة داخل التطبيق",
    screenshots: makeScreens([{"title": "الرئيسية", "text": "منطقة البداية والتنقل الرئيسي والنظرة العامة"}, {"title": "منطقة القتال", "text": "معارك الفرق والاستراتيجية وعرض القتال"}, {"title": "تفاصيل البطاقة", "text": "بطاقة واحدة مع القيم والتصميم والندرة"}, {"title": "الجوائز", "text": "المكافآت والإنجازات والمعالم المفتوحة"}, {"title": "فتح الحزمة", "text": "افتح الحزم واحصل على بطاقات جديدة"}, {"title": "المجموعة", "text": "المجموعة والمجموعات المكتملة"}, {"title": "السوق", "text": "تداول البطاقات الداخلي"}, {"title": "المتجر", "text": "عملات وعروض ومشتريات اختيارية"}, {"title": "تفاصيل الحركة", "text": "التقدم وقيم النشاط والتطور الرياضي"}, {"title": "القريبون", "text": "اكتشف لاعبين قريبين على الرادار"}, {"title": "الأحداث", "text": "أنشطة وتحديات وأحداث خاصة"}, {"title": "الأصدقاء", "text": "قائمة الأصدقاء والطلبات والدردشات والمجموعات"}]),
    affiliateEyebrow: "برنامج الشراكة",
    affiliateTitle: "ربط المبدعين والشركاء والمجتمعات",
    affiliateText: "يمكن أن ينمو Cardletics مع الشركاء والمبدعين والمجتمعات عبر التوصيات وتتبع الأداء والإيرادات المحتملة.",
    affiliateSmall: "يمكن إضافة رابط مباشر لمنطقة الشراكة لاحقاً.",
    affiliateCta: "طلب الشراكة",
    helpButton: "مساعدة",
    helpTitle: "مساعدة Cardletics",
    helpSubtitle: "إجابات سريعة للأسئلة الشائعة",
    quickQuestions: [{"text": "كيف يعمل Cardletics؟", "answer": "تتبع النشاط، تكسب بطاقات، تجمع المجموعات، تبني فرقاً وتقاتل."}, {"text": "هل التطبيق مجاني؟", "answer": "نعم. التطبيق مجاني مع اشتراكات ومشتريات اختيارية."}, {"text": "هل يمكن تداول البطاقات؟", "answer": "نعم، يمكن تداول البطاقات في سوق داخلي."}, {"text": "كيف يعمل برنامج الشراكة؟", "answer": "مخصص للشركاء والمبدعين والمجتمعات. يمكن عرض التفاصيل لاحقاً داخل النظام."}],
    close: "إغلاق",
    prev: "رجوع",
    next: "التالي",
    swipeHint: "← اسحب للتبديل →",
  },
  bn: {
    languageName: "বাংলা",
    languageLabel: "ভাষা",
    affiliate: "অ্যাফিলিয়েট",
    heroBadge: "ট্র্যাক • সংগ্রহ • যুদ্ধ • ট্রেড",
    title: "খেলার ডেটা হয়ে ওঠে\nকার্ড, দল\nও বাস্তব অগ্রগতি।",
    subtitle: "Cardletics বাস্তব চলাফেরাকে ডিজিটাল ট্রেডিং-কার্ড গেমপ্লের সঙ্গে যুক্ত করে। হাঁটুন, অনুশীলন করুন এবং সক্রিয় থাকুন—কার্ড অর্জন, সংগ্রহ সম্পূর্ণ, দল তৈরি, যুদ্ধ ও অভ্যন্তরীণ বাজারে ট্রেড করার জন্য।",
    appStore: "App Store – শীঘ্রই",
    googlePlay: "Google Play – শীঘ্রই",
    affiliateProgram: "অ্যাফিলিয়েট প্রোগ্রাম",
    heroHint: "Cardletics বিনামূল্যে ব্যবহারযোগ্য এবং চাইলে সাবস্ক্রিপশন, কয়েন ও অতিরিক্ত কনটেন্ট দিয়ে বাড়ানো যায়।",
    stats: [{"label": "ট্র্যাকিং", "value": "চলাফেরা অগ্রগতি হয়"}, {"label": "কার্ড", "value": "দুর্লভ, সংগ্রহযোগ্য, ট্রেডযোগ্য"}, {"label": "দল", "value": "কৌশল ও যুদ্ধ"}, {"label": "বাজার", "value": "অভ্যন্তরীণ এক্সচেঞ্জ"}],
    whatEyebrow: "Cardletics কী?",
    whatTitle: "একটি অ্যাপ যা কার্যকলাপকে খেলায় বদলায়",
    whatText: "Cardletics আপনার কার্যকলাপকে কার্ড, পুরস্কার, সংগ্রহ, স্ট্যাটাস ও কৌশলে বদলায়।",
    features: [{"title": "কার্ড", "text": "বাস্তব কার্যকলাপ আপনার অগ্রগতির ভিত্তি।"}, {"title": "কার্ড", "text": "ডিজিটাল কার্ড সংগ্রহ, প্রদর্শন ও ব্যবহার করুন।"}, {"title": "দল", "text": "কার্ড মিলিয়ে যুদ্ধের জন্য দল তৈরি করুন।"}, {"title": "বাজার", "text": "কার্ড সিস্টেমের ভিতরে ট্রেড করা যায়।"}, {"title": "সংগ্রহ সম্পূর্ণ করুন", "text": "সম্পূর্ণ সেটের দিকে এগিয়ে বিশেষ পুরস্কার নিন।"}, {"title": "পুরস্কার ও মর্যাদা", "text": "বিশেষ অর্জন ও অগ্রগতি দৃশ্যমান পুরস্কার হয়।"}],
    appEyebrow: "অ্যাপ ব্যাখ্যা",
    appTitle: "Cardletics কীভাবে ব্যবহার করবেন",
    appText: "এই পেজটি মূল প্রবাহ সহজভাবে ব্যাখ্যা করে।",
    steps: [{"number": "1", "title": "কার্যকলাপ ট্র্যাক করুন", "text": "বাস্তব জীবনের চলাফেরা অগ্রগতির ভিত্তি।"}, {"number": "2", "title": "কার্ড অর্জন", "text": "কার্যকলাপ ও অর্জনের জন্য কার্ড পান।"}, {"number": "3", "title": "সংগ্রহ ও উন্নতি", "text": "সেট সম্পূর্ণ করে নির্বাচন উন্নত করুন।"}, {"number": "4", "title": "দল ও যুদ্ধ", "text": "কার্ড দিয়ে দল তৈরি করে অন্যদের সাথে খেলুন।"}],
    screenshotsEyebrow: "স্ক্রিনশট",
    screenshotsTitle: "অ্যাপের ঝলক",
    screenshots: makeScreens([{"title": "হোম", "text": "শুরু, নেভিগেশন ও সারাংশ"}, {"title": "যুদ্ধ", "text": "দল যুদ্ধ ও কৌশল"}, {"title": "কার্ড বিস্তারিত", "text": "মান, ডিজাইন ও বিরলতা"}, {"title": "পুরস্কার", "text": "পুরস্কার ও মাইলস্টোন"}, {"title": "প্যাক খুলুন", "text": "নতুন কার্ড পান"}, {"title": "সংগ্রহ", "text": "সেট ও পূর্ণতা"}, {"title": "বাজার", "text": "কার্ড ট্রেডিং"}, {"title": "শপ", "text": "কয়েন, অফার ও ঐচ্ছিক কেনাকাটা"}, {"title": "চলাফেরা বিস্তারিত", "text": "অগ্রগতি ও কার্যকলাপ"}, {"title": "কাছাকাছি", "text": "রাডারে খেলোয়াড়"}, {"title": "ইভেন্ট", "text": "চ্যালেঞ্জ ও বিশেষ ইভেন্ট"}, {"title": "বন্ধু", "text": "অনুরোধ, চ্যাট ও গ্রুপ"}]),
    affiliateEyebrow: "অ্যাফিলিয়েট প্রোগ্রাম",
    affiliateTitle: "ক্রিয়েটর, পার্টনার ও কমিউনিটি যুক্ত করুন",
    affiliateText: "Cardletics পার্টনার ও কমিউনিটির মাধ্যমে বাড়তে পারে।",
    affiliateSmall: "পরে সরাসরি অ্যাফিলিয়েট লিংক যোগ করা যাবে।",
    affiliateCta: "অ্যাফিলিয়েট অনুরোধ",
    helpButton: "সাহায্য",
    helpTitle: "Cardletics সাহায্য",
    helpSubtitle: "সাধারণ প্রশ্নের দ্রুত উত্তর",
    quickQuestions: [{"text": "Cardletics কীভাবে কাজ করে?", "answer": "আপনি কার্যকলাপ ট্র্যাক করেন, কার্ড পান, সেট সংগ্রহ করেন, দল বানান ও যুদ্ধ করেন।"}, {"text": "অ্যাপটি কি বিনামূল্যে?", "answer": "হ্যাঁ, অ্যাপটি বিনামূল্যে; ঐচ্ছিক সাবস্ক্রিপশন ও কেনাকাটা আছে।"}, {"text": "কার্ড কি ট্রেড করা যায়?", "answer": "হ্যাঁ, কার্ড অভ্যন্তরীণ বাজারে ট্রেড করা যায়।"}, {"text": "অ্যাফিলিয়েট কীভাবে কাজ করে?", "answer": "এটি পার্টনার, ক্রিয়েটর ও কমিউনিটির জন্য। বিস্তারিত পরে সিস্টেমে দেখানো যাবে।"}],
    close: "বন্ধ করুন",
    prev: "ফিরে যান",
    next: "পরবর্তী",
    swipeHint: "← বদলাতে সোয়াইপ করুন →",
  },
  ru: {
    languageName: "Русский",
    languageLabel: "Язык",
    affiliate: "Партнёрка",
    heroBadge: "Трекинг • Коллекция • Битвы • Обмен",
    title: "Спортивные данные становятся\nкартами, командами\nи реальным прогрессом.",
    subtitle: "Cardletics соединяет реальное движение с цифровым геймплеем коллекционных карточек. Ходите, тренируйтесь и оставайтесь активными, чтобы получать карты, закрывать коллекции, собирать команды, сражаться и торговать на внутреннем рынке.",
    appStore: "App Store – скоро",
    googlePlay: "Google Play – скоро",
    affiliateProgram: "Партнёрская программа",
    heroHint: "Cardletics можно использовать бесплатно и при желании расширять подписками, монетами и дополнительным контентом.",
    stats: [{"label": "Трекинг", "value": "Движение становится прогрессом"}, {"label": "Карты", "value": "Редкие, коллекционные, торговые"}, {"label": "Команды", "value": "Стратегия и битвы"}, {"label": "Рынок", "value": "Внутренний обмен"}],
    whatEyebrow: "Что такое Cardletics?",
    whatTitle: "Приложение, превращающее активность в игру",
    whatText: "Cardletics превращает активность в карты, награды, коллекции, статус и стратегию.",
    features: [{"title": "Карты", "text": "Реальная активность становится основой прогресса."}, {"title": "Карты", "text": "Получайте, собирайте и показывайте цифровые карты."}, {"title": "Команды", "text": "Комбинируйте карты и создавайте команды для битв."}, {"title": "Рынок", "text": "Карты можно обменивать внутри системы."}, {"title": "Завершайте коллекции", "text": "Собирайте полные наборы и особые награды."}, {"title": "Награды и престиж", "text": "Достижения и прогресс становятся видимыми наградами."}],
    appEyebrow: "Приложение объяснено",
    appTitle: "Как использовать Cardletics",
    appText: "Эта страница просто объясняет основной процесс.",
    steps: [{"number": "1", "title": "Отслеживайте активность", "text": "Реальное движение становится основой прогресса."}, {"number": "2", "title": "Получайте карты", "text": "Получайте карты за активность и достижения."}, {"number": "3", "title": "Собирайте и улучшайте", "text": "Закрывайте наборы и улучшайте состав."}, {"number": "4", "title": "Команды и битвы", "text": "Создавайте команды и соревнуйтесь с другими."}],
    screenshotsEyebrow: "Скриншоты",
    screenshotsTitle: "Внутри приложения",
    screenshots: makeScreens([{"title": "Главная", "text": "Старт, навигация и обзор"}, {"title": "Битвы", "text": "Командные битвы и стратегия"}, {"title": "Детали карты", "text": "Значения, дизайн и редкость"}, {"title": "Награды", "text": "Награды и достижения"}, {"title": "Открыть набор", "text": "Получайте новые карты"}, {"title": "Коллекция", "text": "Наборы и завершение"}, {"title": "Рынок", "text": "Торговля картами"}, {"title": "Магазин", "text": "Монеты, предложения и покупки"}, {"title": "Движение подробно", "text": "Прогресс и активность"}, {"title": "Рядом", "text": "Игроки на радаре"}, {"title": "События", "text": "Испытания и события"}, {"title": "Друзья", "text": "Запросы, чаты и группы"}]),
    affiliateEyebrow: "Партнёрская программа",
    affiliateTitle: "Подключайте авторов, партнёров и сообщества",
    affiliateText: "Cardletics может расти вместе с партнёрами, авторами и сообществами.",
    affiliateSmall: "Позже можно добавить прямую ссылку на партнёрский раздел.",
    affiliateCta: "Запросить участие",
    helpButton: "Помощь",
    helpTitle: "Помощь Cardletics",
    helpSubtitle: "Быстрые ответы на частые вопросы",
    quickQuestions: [{"text": "Как работает Cardletics?", "answer": "Вы отслеживаете активность, получаете карты, собираете наборы, создаёте команды и сражаетесь."}, {"text": "Приложение бесплатное?", "answer": "Да, приложение бесплатное с опциональными подписками и покупками."}, {"text": "Можно ли обменивать карты?", "answer": "Да, карты можно обменивать на внутреннем рынке."}, {"text": "Как работает партнёрская программа?", "answer": "Она предназначена для партнёров, авторов и сообществ. Детали позже появятся в системе."}],
    close: "Закрыть",
    prev: "Назад",
    next: "Далее",
    swipeHint: "← Свайп для смены →",
  },
  ja: {
    languageName: "日本語",
    languageLabel: "言語",
    affiliate: "アフィリエイト",
    heroBadge: "記録 • 収集 • バトル • 取引",
    title: "スポーツデータが\nカード、チーム、\n本当の進歩になる。",
    subtitle: "Cardletics は現実の運動とデジタルトレーディングカードのゲーム性をつなげます。歩き、トレーニングし、アクティブに過ごしてカードを獲得し、コレクションを完成させ、チームを作り、バトルし、内部マーケットで取引できます。",
    appStore: "App Store – 近日公開",
    googlePlay: "Google Play – 近日公開",
    affiliateProgram: "アフィリエイトプログラム",
    heroHint: "Cardletics は無料で利用でき、必要に応じてサブスクリプション、コイン、追加コンテンツで拡張できます。",
    stats: [{"label": "記録", "value": "運動が進歩になる"}, {"label": "カード", "value": "レア・収集・取引可能"}, {"label": "チーム", "value": "戦略とバトル"}, {"label": "マーケット", "value": "内部取引"}],
    whatEyebrow: "Cardletics とは？",
    whatTitle: "活動をゲームに変えるアプリ",
    whatText: "Cardletics は活動をカード、報酬、コレクション、ステータス、戦略に変えます。",
    features: [{"title": "カード", "text": "実際の活動が進歩の基盤になります。"}, {"title": "カード", "text": "デジタルカードを獲得、収集、表示できます。"}, {"title": "チーム", "text": "カードを組み合わせてバトル用チームを作ります。"}, {"title": "マーケット", "text": "カードはシステム内で取引できます。"}, {"title": "コレクションを完成", "text": "完全なセットを目指し特別報酬を集めます。"}, {"title": "報酬と名声", "text": "成果と進歩が見える報酬になります。"}],
    appEyebrow: "アプリ説明",
    appTitle: "Cardletics の使い方",
    appText: "このページは基本の流れを分かりやすく説明します。",
    steps: [{"number": "1", "title": "活動を記録", "text": "現実の運動が進歩の基盤です。"}, {"number": "2", "title": "カードを獲得", "text": "活動や成果でカードを獲得します。"}, {"number": "3", "title": "収集と改善", "text": "セットを完成し編成を改善します。"}, {"number": "4", "title": "チームとバトル", "text": "カードでチームを作り他の人と競います。"}],
    screenshotsEyebrow: "スクリーンショット",
    screenshotsTitle: "アプリの中身",
    screenshots: makeScreens([{"title": "ホーム", "text": "開始画面、ナビゲーション、概要"}, {"title": "バトル", "text": "チームバトルと戦略"}, {"title": "カード詳細", "text": "数値、デザイン、レア度"}, {"title": "報酬", "text": "報酬とマイルストーン"}, {"title": "パックを開く", "text": "新しいカードを獲得"}, {"title": "コレクション", "text": "セットと完成度"}, {"title": "マーケット", "text": "カード取引"}, {"title": "ショップ", "text": "コイン、オファー、任意の購入"}, {"title": "運動詳細", "text": "進歩と活動値"}, {"title": "周辺", "text": "レーダー上のプレイヤー"}, {"title": "イベント", "text": "チャレンジと特別イベント"}, {"title": "友達", "text": "申請、チャット、グループ"}]),
    affiliateEyebrow: "アフィリエイトプログラム",
    affiliateTitle: "クリエイター、パートナー、コミュニティを接続",
    affiliateText: "Cardletics はパートナーやコミュニティと成長できます。",
    affiliateSmall: "後でアフィリエイトエリアへのリンクを追加できます。",
    affiliateCta: "申請する",
    helpButton: "ヘルプ",
    helpTitle: "Cardletics ヘルプ",
    helpSubtitle: "よくある質問への簡単な回答",
    quickQuestions: [{"text": "Cardletics はどう動きますか？", "answer": "活動を記録し、カードを得て、セットを集め、チームを作りバトルします。"}, {"text": "アプリは無料ですか？", "answer": "はい。無料で使え、任意のサブスクや購入があります。"}, {"text": "カードは取引できますか？", "answer": "はい、内部マーケットで取引できます。"}, {"text": "アフィリエイトは？", "answer": "パートナー、クリエイター、コミュニティ向けです。詳細は後で表示できます。"}],
    close: "閉じる",
    prev: "戻る",
    next: "次へ",
    swipeHint: "← スワイプで切替 →",
  },
  tr: {
    languageName: "Türkçe",
    languageLabel: "Dil",
    affiliate: "Ortaklık",
    heroBadge: "Takip • Topla • Savaş • Takas",
    title: "Spor verileri\nkartlara, takımlara\nve gerçek ilerlemeye dönüşür.",
    subtitle: "Cardletics gerçek hareketi dijital koleksiyon kartı oynanışıyla birleştirir. Yürü, antrenman yap ve aktif kal; kart kazan, koleksiyonları tamamla, takım kur, savaş ve iç pazarda takas yap.",
    appStore: "App Store – yakında",
    googlePlay: "Google Play – yakında",
    affiliateProgram: "Ortaklık Programı",
    heroHint: "Cardletics ücretsiz kullanılabilir ve isteğe bağlı olarak abonelikler, coinler ve ek içeriklerle genişletilebilir.",
    stats: [{"label": "Takip", "value": "Hareket ilerlemeye dönüşür"}, {"label": "Kartlar", "value": "Nadir, toplanabilir, takas edilebilir"}, {"label": "Takımlar", "value": "Strateji ve savaşlar"}, {"label": "Pazar", "value": "İç takas"}],
    whatEyebrow: "Cardletics nedir?",
    whatTitle: "Aktiviteyi oyuna dönüştüren uygulama",
    whatText: "Cardletics aktiviteyi kartlara, ödüllere, koleksiyonlara, statüye ve stratejiye dönüştürür.",
    features: [{"title": "Kartlar", "text": "Gerçek aktiviten ilerlemenin temelidir."}, {"title": "Kartlar", "text": "Dijital kartlar kazan, topla ve göster."}, {"title": "Takımlar", "text": "Kartları birleştir ve savaş için takım kur."}, {"title": "Pazar", "text": "Kartlar sistem içinde takas edilebilir."}, {"title": "Koleksiyonları tamamla", "text": "Tam setlere ilerle ve özel ödüller kazan."}, {"title": "Ödüller ve prestij", "text": "Başarılar ve ilerleme görünür ödüllere dönüşür."}],
    appEyebrow: "Uygulama açıklandı",
    appTitle: "Cardletics nasıl kullanılır",
    appText: "Bu sayfa temel akışı sade biçimde açıklar.",
    steps: [{"number": "1", "title": "Aktiviteyi takip et", "text": "Gerçek hareket ilerlemenin temelidir."}, {"number": "2", "title": "Kart kazan", "text": "Aktivite ve başarılar için kart kazan."}, {"number": "3", "title": "Topla ve geliştir", "text": "Setleri tamamla ve dizilimini geliştir."}, {"number": "4", "title": "Takım kur ve savaş", "text": "Kartlarınla takım kur ve başkalarıyla yarış."}],
    screenshotsEyebrow: "Ekran görüntüleri",
    screenshotsTitle: "Uygulama içinden görüntüler",
    screenshots: makeScreens([{"title": "Ana ekran", "text": "Başlangıç, navigasyon ve genel bakış"}, {"title": "Savaş", "text": "Takım savaşı ve strateji"}, {"title": "Kart detayı", "text": "Değerler, tasarım ve nadirlik"}, {"title": "Ödüller", "text": "Ödüller ve kilometre taşları"}, {"title": "Paket aç", "text": "Yeni kartlar al"}, {"title": "Koleksiyon", "text": "Setler ve tamamlama"}, {"title": "Pazar", "text": "Kart takası"}, {"title": "Mağaza", "text": "Coinler, teklifler ve satın almalar"}, {"title": "Hareket detayı", "text": "İlerleme ve aktivite"}, {"title": "Yakın çevre", "text": "Radardaki oyuncular"}, {"title": "Etkinlikler", "text": "Mücadeleler ve özel etkinlikler"}, {"title": "Arkadaşlar", "text": "İstekler, sohbetler ve gruplar"}]),
    affiliateEyebrow: "Ortaklık Programı",
    affiliateTitle: "İçerik üreticileri, ortaklar ve toplulukları bağla",
    affiliateText: "Cardletics ortaklar ve topluluklarla büyüyebilir.",
    affiliateSmall: "Daha sonra ortaklık alanına doğrudan bağlantı eklenebilir.",
    affiliateCta: "Ortaklık iste",
    helpButton: "Yardım",
    helpTitle: "Cardletics Yardım",
    helpSubtitle: "Sık sorulara hızlı cevaplar",
    quickQuestions: [{"text": "Cardletics nasıl çalışır?", "answer": "Aktivite takip eder, kart kazanır, set toplar, takım kurar ve savaşırsın."}, {"text": "Uygulama ücretsiz mi?", "answer": "Evet. Uygulama ücretsizdir; isteğe bağlı abonelik ve satın almalar vardır."}, {"text": "Kartlar takas edilebilir mi?", "answer": "Evet, kartlar iç pazarda takas edilebilir."}, {"text": "Ortaklık programı nasıl çalışır?", "answer": "Ortaklar, üreticiler ve topluluklar içindir. Detaylar daha sonra sistemde gösterilebilir."}],
    close: "Kapat",
    prev: "Geri",
    next: "İleri",
    swipeHint: "← Değiştirmek için kaydır →",
  },
  vi: {
    languageName: "Tiếng Việt",
    languageLabel: "Ngôn ngữ",
    affiliate: "Liên kết",
    heroBadge: "Theo dõi • Sưu tầm • Đấu • Giao dịch",
    title: "Dữ liệu thể thao trở thành\nthẻ bài, đội hình\nvà tiến trình thật.",
    subtitle: "Cardletics kết nối vận động thật với lối chơi thẻ bài sưu tầm kỹ thuật số. Đi bộ, luyện tập và duy trì hoạt động để nhận thẻ, hoàn thành bộ sưu tập, xây đội, chiến đấu và giao dịch trong chợ nội bộ.",
    appStore: "App Store – sắp có",
    googlePlay: "Google Play – sắp có",
    affiliateProgram: "Chương trình liên kết",
    heroHint: "Cardletics có thể dùng miễn phí và có thể mở rộng tùy chọn bằng gói đăng ký, xu và nội dung bổ sung.",
    stats: [{"label": "Theo dõi", "value": "Vận động thành tiến trình"}, {"label": "Thẻ", "value": "Hiếm, sưu tầm, giao dịch"}, {"label": "Đội", "value": "Chiến lược và trận đấu"}, {"label": "Chợ", "value": "Giao dịch nội bộ"}],
    whatEyebrow: "Cardletics là gì?",
    whatTitle: "Ứng dụng biến hoạt động thành trò chơi",
    whatText: "Cardletics biến hoạt động thành thẻ, phần thưởng, bộ sưu tập, trạng thái và chiến lược.",
    features: [{"title": "Thẻ được thưởng", "text": "Hoạt động thật là nền tảng tiến trình của bạn."}, {"title": "Thẻ", "text": "Nhận, sưu tầm và trưng bày thẻ kỹ thuật số."}, {"title": "Đội", "text": "Kết hợp thẻ để xây đội cho trận đấu."}, {"title": "Chợ", "text": "Thẻ có thể giao dịch trong hệ thống."}, {"title": "Hoàn thành bộ sưu tập", "text": "Hoàn thành bộ và nhận phần thưởng đặc biệt."}, {"title": "Phần thưởng & danh tiếng", "text": "Thành tích và tiến trình thành phần thưởng hiển thị."}],
    appEyebrow: "Giải thích ứng dụng",
    appTitle: "Cách dùng Cardletics",
    appText: "Trang này giải thích luồng chính rõ ràng.",
    steps: [{"number": "1", "title": "Theo dõi hoạt động", "text": "Vận động thật là nền tảng tiến trình."}, {"number": "2", "title": "Nhận thẻ", "text": "Nhận thẻ nhờ hoạt động và thành tích."}, {"number": "3", "title": "Sưu tầm và tối ưu", "text": "Hoàn thành bộ và cải thiện đội hình."}, {"number": "4", "title": "Xây đội và đấu", "text": "Dùng thẻ xây đội và thi đấu với người khác."}],
    screenshotsEyebrow: "Ảnh màn hình",
    screenshotsTitle: "Bên trong ứng dụng",
    screenshots: makeScreens([{"title": "Trang chủ", "text": "Khu bắt đầu, điều hướng và tổng quan"}, {"title": "Khu đấu", "text": "Đấu đội và chiến lược"}, {"title": "Chi tiết thẻ", "text": "Chỉ số, thiết kế và độ hiếm"}, {"title": "Phần thưởng", "text": "Phần thưởng và mốc mở khóa"}, {"title": "Mở gói", "text": "Nhận thẻ mới"}, {"title": "Bộ sưu tập", "text": "Bộ và hoàn thành"}, {"title": "Chợ", "text": "Giao dịch thẻ"}, {"title": "Cửa hàng", "text": "Xu, ưu đãi và mua tùy chọn"}, {"title": "Vận động chi tiết", "text": "Tiến trình và hoạt động"}, {"title": "Lân cận", "text": "Người chơi trên radar"}, {"title": "Sự kiện", "text": "Thử thách và sự kiện"}, {"title": "Bạn bè", "text": "Yêu cầu, chat và nhóm"}]),
    affiliateEyebrow: "Chương trình liên kết",
    affiliateTitle: "Kết nối nhà sáng tạo, đối tác và cộng đồng",
    affiliateText: "Cardletics có thể phát triển cùng đối tác và cộng đồng.",
    affiliateSmall: "Sau này có thể thêm liên kết trực tiếp đến khu liên kết.",
    affiliateCta: "Yêu cầu liên kết",
    helpButton: "Trợ giúp",
    helpTitle: "Trợ giúp Cardletics",
    helpSubtitle: "Câu trả lời nhanh cho câu hỏi thường gặp",
    quickQuestions: [{"text": "Cardletics hoạt động thế nào?", "answer": "Bạn theo dõi hoạt động, nhận thẻ, sưu tầm bộ, xây đội và thi đấu."}, {"text": "Ứng dụng miễn phí không?", "answer": "Có. Ứng dụng miễn phí với gói đăng ký và mua tùy chọn."}, {"text": "Có thể giao dịch thẻ không?", "answer": "Có, thẻ có thể giao dịch trong chợ nội bộ."}, {"text": "Chương trình liên kết hoạt động thế nào?", "answer": "Dành cho đối tác, nhà sáng tạo và cộng đồng. Chi tiết có thể hiển thị sau."}],
    close: "Đóng",
    prev: "Quay lại",
    next: "Tiếp",
    swipeHint: "← Vuốt để đổi →",
  },
  id: {
    languageName: "Bahasa Indonesia",
    languageLabel: "Bahasa",
    affiliate: "Afiliasi",
    heroBadge: "Lacak • Koleksi • Bertarung • Berdagang",
    title: "Data olahraga menjadi\nkartu, tim\ndan progres nyata.",
    subtitle: "Cardletics menghubungkan gerakan nyata dengan gameplay kartu koleksi digital. Berjalan, berlatih, dan tetap aktif untuk mendapatkan kartu, melengkapi koleksi, membangun tim, bertarung, dan berdagang di marketplace internal.",
    appStore: "App Store – segera hadir",
    googlePlay: "Google Play – segera hadir",
    affiliateProgram: "Program Afiliasi",
    heroHint: "Cardletics gratis digunakan dan dapat diperluas secara opsional dengan langganan, koin, dan konten tambahan.",
    stats: [{"label": "Pelacakan", "value": "Gerakan menjadi progres"}, {"label": "Kartu", "value": "Langka, koleksi, bisa diperdagangkan"}, {"label": "Tim", "value": "Strategi & pertarungan"}, {"label": "Marketplace", "value": "Bursa internal"}],
    whatEyebrow: "Apa itu Cardletics?",
    whatTitle: "Aplikasi yang membuat aktivitas jadi permainan",
    whatText: "Cardletics mengubah aktivitas menjadi kartu, hadiah, koleksi, status, dan strategi.",
    features: [{"title": "Kartu", "text": "Aktivitas nyata menjadi dasar progresmu."}, {"title": "Kartu", "text": "Dapatkan, kumpulkan, dan tampilkan kartu digital."}, {"title": "Tim", "text": "Gabungkan kartu untuk membangun tim bertarung."}, {"title": "Marketplace", "text": "Kartu bisa diperdagangkan di dalam sistem."}, {"title": "Lengkapi koleksi", "text": "Kejar set lengkap dan hadiah spesial."}, {"title": "Hadiah & prestise", "text": "Pencapaian dan progres menjadi hadiah yang terlihat."}],
    appEyebrow: "Aplikasi dijelaskan",
    appTitle: "Cara memakai Cardletics",
    appText: "Halaman ini menjelaskan alur utama dengan sederhana.",
    steps: [{"number": "1", "title": "Lacak aktivitas", "text": "Gerakan nyata menjadi dasar progres."}, {"number": "2", "title": "Dapatkan kartu", "text": "Dapatkan kartu dari aktivitas dan pencapaian."}, {"number": "3", "title": "Koleksi dan optimalkan", "text": "Lengkapi set dan perbaiki pilihanmu."}, {"number": "4", "title": "Bangun tim dan bertarung", "text": "Buat tim dengan kartu dan lawan pemain lain."}],
    screenshotsEyebrow: "Screenshot",
    screenshotsTitle: "Isi aplikasi",
    screenshots: makeScreens([{"title": "Beranda", "text": "Awal, navigasi, dan ringkasan"}, {"title": "Pertarungan", "text": "Pertarungan tim dan strategi"}, {"title": "Detail kartu", "text": "Nilai, desain, dan kelangkaan"}, {"title": "Penghargaan", "text": "Hadiah dan milestone"}, {"title": "Buka pack", "text": "Terima kartu baru"}, {"title": "Koleksi", "text": "Set dan penyelesaian"}, {"title": "Marketplace", "text": "Perdagangan kartu"}, {"title": "Toko", "text": "Koin, penawaran, dan pembelian"}, {"title": "Detail gerakan", "text": "Progres dan aktivitas"}, {"title": "Sekitar", "text": "Pemain di radar"}, {"title": "Event", "text": "Tantangan dan event spesial"}, {"title": "Teman", "text": "Permintaan, chat, dan grup"}]),
    affiliateEyebrow: "Program Afiliasi",
    affiliateTitle: "Hubungkan kreator, mitra, dan komunitas",
    affiliateText: "Cardletics dapat tumbuh bersama mitra dan komunitas.",
    affiliateSmall: "Nanti bisa ditambahkan tautan langsung ke area afiliasi.",
    affiliateCta: "Ajukan afiliasi",
    helpButton: "Bantuan",
    helpTitle: "Bantuan Cardletics",
    helpSubtitle: "Jawaban cepat untuk pertanyaan umum",
    quickQuestions: [{"text": "Bagaimana Cardletics bekerja?", "answer": "Kamu melacak aktivitas, mendapat kartu, mengumpulkan set, membuat tim, dan bertarung."}, {"text": "Apakah aplikasinya gratis?", "answer": "Ya. Aplikasi gratis dengan langganan dan pembelian opsional."}, {"text": "Bisakah kartu diperdagangkan?", "answer": "Ya, kartu dapat diperdagangkan di marketplace internal."}, {"text": "Bagaimana program afiliasi bekerja?", "answer": "Ditujukan untuk mitra, kreator, dan komunitas. Detail dapat ditampilkan nanti."}],
    close: "Tutup",
    prev: "Kembali",
    next: "Lanjut",
    swipeHint: "← Geser untuk berpindah →",
  },
  ur: {
    languageName: "اردو",
    languageLabel: "زبان",
    affiliate: "افیلیٹ",
    heroBadge: "ٹریک • جمع کریں • مقابلہ • تجارت",
    title: "کھیل کا ڈیٹا بنتا ہے\nکارڈز، ٹیمیں\nاور حقیقی پیش رفت۔",
    subtitle: "Cardletics حقیقی حرکت کو ڈیجیٹل ٹریڈنگ کارڈ گیم پلے سے جوڑتا ہے۔ چلیں، ٹریننگ کریں اور فعال رہیں تاکہ کارڈز حاصل کریں، کلیکشن مکمل کریں، ٹیم بنائیں، مقابلے کریں اور اندرونی مارکیٹ میں تجارت کریں۔",
    appStore: "App Store – جلد دستیاب",
    googlePlay: "Google Play – جلد دستیاب",
    affiliateProgram: "افیلیٹ پروگرام",
    heroHint: "Cardletics مفت استعمال کیا جا سکتا ہے اور اختیاری طور پر سبسکرپشنز، کوائنز اور اضافی مواد سے بڑھایا جا سکتا ہے۔",
    stats: [{"label": "ٹریکنگ", "value": "حرکت پیش رفت بنتی ہے"}, {"label": "کارڈز", "value": "نایاب، جمع کرنے اور تجارت کے قابل"}, {"label": "ٹیمیں", "value": "حکمت عملی اور مقابلے"}, {"label": "مارکیٹ", "value": "اندرونی ایکسچینج"}],
    whatEyebrow: "Cardletics کیا ہے؟",
    whatTitle: "ایک ایپ جو سرگرمی کو گیم بناتی ہے",
    whatText: "Cardletics تبدیل/turns activity into cards, rewards, collections, status and strategy.",
    features: [{"title": "کارڈز", "text": "حقیقی سرگرمی آپ کی پیش رفت کی بنیاد ہے۔"}, {"title": "کارڈز", "text": "ڈیجیٹل کارڈز حاصل کریں، جمع کریں اور دکھائیں۔"}, {"title": "ٹیمیں", "text": "کارڈز ملا کر مقابلوں کے لیے ٹیم بنائیں۔"}, {"title": "مارکیٹ", "text": "کارڈز سسٹم کے اندر تجارت ہو سکتے ہیں۔"}, {"title": "کلیکشن مکمل کریں", "text": "مکمل سیٹس کی طرف بڑھیں اور خاص انعامات حاصل کریں۔"}, {"title": "ایوارڈز اور وقار", "text": "کامیابیاں اور پیش رفت نظر آنے والے انعامات بنتے ہیں۔"}],
    appEyebrow: "ایپ کی وضاحت",
    appTitle: "Cardletics کیسے استعمال کریں",
    appText: "یہ صفحہ بنیادی عمل کو آسانی سے سمجھاتا ہے۔",
    steps: [{"number": "1", "title": "سرگرمی ٹریک کریں", "text": "حقیقی حرکت پیش رفت کی بنیاد ہے۔"}, {"number": "2", "title": "کارڈز حاصل کریں", "text": "سرگرمی اور کامیابی پر کارڈز حاصل کریں۔"}, {"number": "3", "title": "جمع اور بہتر کریں", "text": "سیٹس مکمل کریں اور انتخاب بہتر بنائیں۔"}, {"number": "4", "title": "ٹیم بنائیں اور مقابلہ کریں", "text": "کارڈز سے ٹیم بنا کر دوسروں سے مقابلہ کریں۔"}],
    screenshotsEyebrow: "اسکرین شاٹس",
    screenshotsTitle: "ایپ کے اندر",
    screenshots: makeScreens([{"title": "ہوم", "text": "آغاز، نیویگیشن اور جائزہ"}, {"title": "مقابلہ", "text": "ٹیم مقابلہ اور حکمت عملی"}, {"title": "کارڈ تفصیل", "text": "قیمتیں، ڈیزائن اور نایابی"}, {"title": "ایوارڈز", "text": "انعامات اور سنگ میل"}, {"title": "پیک کھولیں", "text": "نئے کارڈز حاصل کریں"}, {"title": "کلیکشن", "text": "سیٹس اور تکمیل"}, {"title": "مارکیٹ", "text": "کارڈ تجارت"}, {"title": "شاپ", "text": "کوائنز، آفرز اور خریداری"}, {"title": "حرکت تفصیل", "text": "پیش رفت اور سرگرمی"}, {"title": "قریب", "text": "رڈار پر کھلاڑی"}, {"title": "ایونٹس", "text": "چیلنجز اور خاص ایونٹس"}, {"title": "دوست", "text": "درخواستیں، چیٹ اور گروپس"}]),
    affiliateEyebrow: "افیلیٹ پروگرام",
    affiliateTitle: "کریئیٹرز، پارٹنرز اور کمیونٹیز کو جوڑیں",
    affiliateText: "Cardletics پارٹنرز اور کمیونٹیز کے ساتھ بڑھ سکتا ہے۔",
    affiliateSmall: "بعد میں افیلیٹ علاقے کا براہ راست لنک شامل ہو سکتا ہے۔",
    affiliateCta: "افیلیٹ درخواست",
    helpButton: "مدد",
    helpTitle: "Cardletics مدد",
    helpSubtitle: "عام سوالات کے فوری جواب",
    quickQuestions: [{"text": "Cardletics کیسے کام کرتا ہے؟", "answer": "آپ سرگرمی ٹریک کرتے ہیں، کارڈز حاصل کرتے ہیں، سیٹس جمع کرتے ہیں، ٹیم بناتے ہیں اور مقابلہ کرتے ہیں۔"}, {"text": "کیا ایپ مفت ہے؟", "answer": "جی ہاں، ایپ مفت ہے؛ اختیاری سبسکرپشنز اور خریداری موجود ہیں۔"}, {"text": "کیا کارڈز کی تجارت ہو سکتی ہے؟", "answer": "جی ہاں، کارڈز اندرونی مارکیٹ میں تجارت ہو سکتے ہیں۔"}, {"text": "افیلیٹ پروگرام کیسے کام کرتا ہے؟", "answer": "یہ پارٹنرز، کریئیٹرز اور کمیونٹیز کے لیے ہے۔ تفصیلات بعد میں سسٹم میں دکھائی جا سکتی ہیں۔"}],
    close: "بند کریں",
    prev: "واپس",
    next: "اگلا",
    swipeHint: "← بدلنے کے لیے سوائپ کریں →",
  },
};

const languageOptions: { key: LanguageKey; label: string; countryCode: string }[] = [
  { key: "de", label: "Deutsch", countryCode: "de" },
  { key: "en", label: "English", countryCode: "gb" },
  { key: "es", label: "Español", countryCode: "es" },
  { key: "fr", label: "Français", countryCode: "fr" },
  { key: "pt", label: "Português", countryCode: "pt" },
  { key: "zh", label: "中文", countryCode: "cn" },
  { key: "hi", label: "हिन्दी", countryCode: "in" },
  { key: "ar", label: "العربية", countryCode: "sa" },
  { key: "bn", label: "বাংলা", countryCode: "bd" },
  { key: "ru", label: "Русский", countryCode: "ru" },
  { key: "ja", label: "日本語", countryCode: "jp" },
  { key: "tr", label: "Türkçe", countryCode: "tr" },
  { key: "vi", label: "Tiếng Việt", countryCode: "vn" },
  { key: "id", label: "Bahasa Indonesia", countryCode: "id" },
  { key: "ur", label: "اردو", countryCode: "pk" },
];

const LANGUAGE_STORAGE_KEY = "cardletics_language";

function isLanguageKey(value: string | null): value is LanguageKey {
  return !!value && languageOptions.some((option) => option.key === value);
}

function FlagIcon({ countryCode, alt }: { countryCode: string; alt: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${countryCode}.png`}
      alt={alt}
      width={18}
      height={13}
      style={flagImageStyle}
      loading="lazy"
    />
  );
}

export default function HomePage() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedShotIndex, setSelectedShotIndex] = useState<number | null>(null);
  const [language, setLanguage] = useState<LanguageKey>("de");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageDidMountRef = useRef(false);

  const t = translations[language];
  const screenshots = useMemo<ScreenshotItem[]>(() => t.screenshots, [t]);
  const selectedShot = selectedShotIndex !== null ? screenshots[selectedShotIndex] : null;
  const dir = language === "ar" || language === "ur" ? "rtl" : "ltr";
  const selectedLanguage = languageOptions.find((option) => option.key === language) ?? languageOptions[0];


  useEffect(() => {
    try {
      const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (isLanguageKey(savedLanguage)) {
        setLanguage(savedLanguage);
      }
    } catch {
      // localStorage can be unavailable in private modes.
    }
  }, []);

  useEffect(() => {
    if (!languageDidMountRef.current) {
      languageDidMountRef.current = true;
      return;
    }

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      window.dispatchEvent(new CustomEvent("cardletics-language-change", { detail: language }));
    } catch {
      // Ignore storage errors.
    }
  }, [language]);

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

        <div
          style={{
            ...languageBarStyle,
            top: isMobile ? "12px" : "14px",
            right: isMobile ? "12px" : "14px",
            left: isMobile ? "auto" : undefined,
          }}
        >
          <button
            type="button"
            style={languageButtonStyle}
            onClick={() => setLanguageMenuOpen((open) => !open)}
            aria-label={t.languageLabel}
          >
            <FlagIcon countryCode={selectedLanguage.countryCode} alt={selectedLanguage.label} />
            <span>{selectedLanguage.label}</span>
            <span aria-hidden="true" style={languageChevronStyle}>▾</span>
          </button>

          {languageMenuOpen && (
            <div style={languageMenuStyle}>
              {languageOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  style={{
                    ...languageOptionStyle,
                    ...(option.key === language ? languageOptionActiveStyle : null),
                  }}
                  onClick={() => {
                    setLanguage(option.key);
                    setLanguageMenuOpen(false);
                  }}
                >
                  <FlagIcon countryCode={option.countryCode} alt={option.label} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ ...heroInnerStyle, padding: isMobile ? "76px 18px 30px 18px" : "58px 24px" }}>
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
  zIndex: 8,
};

const languageButtonStyle: React.CSSProperties = {
  minHeight: "32px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "5px 9px",
  borderRadius: "999px",
  background: "rgba(8, 19, 12, 0.78)",
  border: "1px solid rgba(134,239,172,0.22)",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: 900,
  cursor: "pointer",
  backdropFilter: "blur(10px)",
  boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
};

const languageChevronStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.58)",
  fontSize: "11px",
  lineHeight: 1,
};

const languageMenuStyle: React.CSSProperties = {
  position: "absolute",
  top: "40px",
  right: 0,
  width: "185px",
  maxHeight: "280px",
  overflowY: "auto",
  padding: "6px",
  borderRadius: "16px",
  background: "rgba(12, 23, 18, 0.98)",
  border: "1px solid rgba(134,239,172,0.18)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.38)",
};

const languageOptionStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "34px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "7px 9px",
  border: "none",
  borderRadius: "12px",
  background: "transparent",
  color: "#e7f1eb",
  fontSize: "12px",
  fontWeight: 800,
  textAlign: "left",
  cursor: "pointer",
};

const languageOptionActiveStyle: React.CSSProperties = {
  background: "rgba(34,197,94,0.16)",
  color: "#bbf7d0",
};

const flagImageStyle: React.CSSProperties = {
  width: "18px",
  height: "13px",
  objectFit: "cover",
  borderRadius: "3px",
  boxShadow: "0 0 0 1px rgba(255,255,255,0.16)",
  flex: "0 0 auto",
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

