"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type JsonMap = Record<string, unknown>;
type CatalogCard = JsonMap;
type CatalogRarity = "all" | "basic" | "common" | "rare" | "epic" | "legendary" | "ultra";
type ConditionMode = "random" | "custom" | "mint";

type UserDetail = {
  profile?: JsonMap | null;
  subscription?: JsonMap | null;
  inventory_count?: number | string | null;
  coin_purchase_count?: number | string | null;
  boost_purchase_count?: number | string | null;
  daily_pack_claim_count?: number | string | null;
  pack_rewards_count?: number | string | null;
  pending_pack_rewards?: number | string | null;
};

type CoinMode = "set" | "add" | "subtract";
type SubscriptionVariant = "free" | "basic" | "pro" | "elite" | "master";
type SubscriptionStatus = "active" | "trialing" | "cancelled" | "expired";

type TabKey = "overview" | "packs" | "cards" | "raw";

const variantOptions: { value: SubscriptionVariant; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
  { value: "elite", label: "Elite" },
  { value: "master", label: "Master" },
];

const statusOptions: { value: SubscriptionStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "trialing", label: "Trialing" },
  { value: "cancelled", label: "Cancelled" },
  { value: "expired", label: "Expired" },
];


export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = String(params?.id || "");

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [inventory, setInventory] = useState<JsonMap[]>([]);
  const [boostPurchases, setBoostPurchases] = useState<JsonMap[]>([]);
  const [packRewards, setPackRewards] = useState<JsonMap[]>([]);
  const [dailyClaims, setDailyClaims] = useState<JsonMap[]>([]);

  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [packLoading, setPackLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [coinMode, setCoinMode] = useState<CoinMode>("add");
  const [coinAmount, setCoinAmount] = useState("0");
  const [savingCoins, setSavingCoins] = useState(false);

  const [subscriptionVariant, setSubscriptionVariant] =
    useState<SubscriptionVariant>("free");
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus>("active");
  const [subscriptionMonths, setSubscriptionMonths] = useState("1");
  const [subscriptionProvider, setSubscriptionProvider] = useState("admin");
  const [savingSubscription, setSavingSubscription] = useState(false);

  const [grantQuantity, setGrantQuantity] = useState("1");
  const [grantNote, setGrantNote] = useState("Admin Grant");
  const [grantingPack, setGrantingPack] = useState(false);
  const [boostQuantity, setBoostQuantity] = useState("1");
  const [boostNote, setBoostNote] = useState("Admin Boost");
  const [grantingBoost, setGrantingBoost] = useState(false);

  const [cardSearch, setCardSearch] = useState("");
  const [packSearch, setPackSearch] = useState("");

  const [catalogCards, setCatalogCards] = useState<CatalogCard[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogRarity, setCatalogRarity] = useState<CatalogRarity>("all");
  const [includeSetCompletion, setIncludeSetCompletion] = useState(true);
  const [selectedCatalogCard, setSelectedCatalogCard] = useState<CatalogCard | null>(null);
  const [catalogCollapsed, setCatalogCollapsed] = useState(false);

  const [conditionMode, setConditionMode] = useState<ConditionMode>("random");
  const [customCondition, setCustomCondition] = useState("100");
  const [conditionTier, setConditionTier] = useState<SubscriptionVariant>("free");
  const [conditionMovement, setConditionMovement] = useState("0");
  const [conditionStreak, setConditionStreak] = useState("0");
  const [grantingCatalogCard, setGrantingCatalogCard] = useState(false);

  const [randomQuantity, setRandomQuantity] = useState("1");
  const [randomTier, setRandomTier] = useState<SubscriptionVariant>("free");
  const [randomMovement, setRandomMovement] = useState("0");
  const [randomStreak, setRandomStreak] = useState("0");
  const [randomBoosted, setRandomBoosted] = useState(false);
  const [grantingRandomCards, setGrantingRandomCards] = useState(false);

  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [repairingMarketCardId, setRepairingMarketCardId] = useState<string | null>(null);

  async function loadDetail() {
    if (!userId) return;

    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase.rpc("admin_get_user_detail", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Fehler beim Laden der User Details:", error);
      setDetail(null);
      setErrorMessage(error.message || "User Details konnten nicht geladen werden.");
      setLoading(false);
      return;
    }

    const loadedDetail = (data || {}) as UserDetail;
    setDetail(loadedDetail);

    const subscription = loadedDetail.subscription || null;

    if (subscription) {
      setSubscriptionVariant(normalizeVariant(readString(subscription, "variant")));
      setSubscriptionStatus(normalizeStatus(readString(subscription, "status")));
      setSubscriptionProvider(readString(subscription, "provider") || "admin");

      const effectiveTier = normalizeVariant(readString(subscription, "variant"));
      setConditionTier(effectiveTier);
      setRandomTier(effectiveTier);
    }

    setLoading(false);
  }

  async function loadInventory() {
    if (!userId) return;

    setInventoryLoading(true);

    const { data, error } = await supabase.rpc("admin_get_user_inventory", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Fehler beim Laden des Inventars:", error);
      setInventory([]);
      setErrorMessage(error.message || "Inventar konnte nicht geladen werden.");
      setInventoryLoading(false);
      return;
    }

    setInventory(Array.isArray(data) ? (data as JsonMap[]) : []);
    setInventoryLoading(false);
  }

  async function loadPacks() {
    if (!userId) return;

    setPackLoading(true);

    const [boostResult, rewardResult, claimResult] = await Promise.all([
      supabase.rpc("admin_get_user_boost_purchases", { p_user_id: userId }),
      supabase.rpc("admin_get_user_pack_rewards", { p_user_id: userId }),
      supabase.rpc("admin_get_user_daily_pack_claims", { p_user_id: userId }),
    ]);

    if (boostResult.error) {
      console.error("Boost-Packs konnten nicht geladen werden:", boostResult.error);
      setErrorMessage(boostResult.error.message || "Boost-Packs konnten nicht geladen werden.");
      setBoostPurchases([]);
    } else {
      setBoostPurchases(Array.isArray(boostResult.data) ? (boostResult.data as JsonMap[]) : []);
    }

    if (rewardResult.error) {
      console.error("Pack Tokens konnten nicht geladen werden:", rewardResult.error);
      setErrorMessage(rewardResult.error.message || "Pack Tokens konnten nicht geladen werden.");
      setPackRewards([]);
    } else {
      setPackRewards(Array.isArray(rewardResult.data) ? (rewardResult.data as JsonMap[]) : []);
    }

    if (claimResult.error) {
      console.error("Daily Claims konnten nicht geladen werden:", claimResult.error);
      setDailyClaims([]);
    } else {
      setDailyClaims(Array.isArray(claimResult.data) ? (claimResult.data as JsonMap[]) : []);
    }

    setPackLoading(false);
  }

  async function loadCatalog() {
    setCatalogLoading(true);

    const { data, error } = await supabase.rpc("admin_list_catalog_cards", {
      p_search: catalogSearch,
      p_rarity: catalogRarity,
      p_include_set_completion: includeSetCompletion,
      p_limit: 80,
    });

    if (error) {
      console.error("Kartenkatalog konnte nicht geladen werden:", error);
      setCatalogCards([]);
      setErrorMessage(error.message || "Kartenkatalog konnte nicht geladen werden.");
      setCatalogLoading(false);
      return;
    }

    setCatalogCards(Array.isArray(data) ? (data as CatalogCard[]) : []);
    setCatalogLoading(false);
  }

  async function handleCatalogSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadCatalog();
  }

  async function handleManualCardGrant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCatalogCard) {
      setErrorMessage("Bitte zuerst eine Karte aus dem Katalog auswählen.");
      return;
    }

    const movement = Number.parseInt(conditionMovement, 10);
    const streak = Number.parseInt(conditionStreak, 10);
    const custom = Number.parseInt(customCondition, 10);

    if (Number.isNaN(movement) || movement < 0 || Number.isNaN(streak) || streak < 0) {
      setErrorMessage("Bewegungsscore und Streak müssen gültige Zahlen ab 0 sein.");
      return;
    }

    if (conditionMode === "custom" && (Number.isNaN(custom) || custom < 1 || custom > 100)) {
      setErrorMessage("Der eigene Zustand muss zwischen 1 und 100 liegen.");
      return;
    }

    setGrantingCatalogCard(true);
    setMessage(null);
    setErrorMessage(null);

    const { data, error } = await supabase.rpc("admin_grant_catalog_card", {
      p_user_id: userId,
      p_card_id: readString(selectedCatalogCard, "id"),
      p_condition_mode: conditionMode,
      p_condition_percent: conditionMode === "custom" ? custom : null,
      p_tier: conditionTier,
      p_movement_score: movement,
      p_streak_days: streak,
      p_tradable: true,
    });

    if (error) {
      setErrorMessage(error.message || "Karte konnte nicht hinzugefügt werden.");
      setGrantingCatalogCard(false);
      return;
    }

    const grantedCondition = readNumber(data as JsonMap, "condition_percent");
    setMessage(
      `${cardDisplayName(selectedCatalogCard)} wurde mit ${grantedCondition}% Zustand hinzugefügt.`
    );
    setGrantingCatalogCard(false);
    await Promise.all([loadInventory(), loadDetail()]);
  }

  async function handleRandomCardGrant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const quantity = Number.parseInt(randomQuantity, 10);
    const movement = Number.parseInt(randomMovement, 10);
    const streak = Number.parseInt(randomStreak, 10);

    if (Number.isNaN(quantity) || quantity < 1 || quantity > 50) {
      setErrorMessage("Bitte 1 bis 50 Karten auswählen.");
      return;
    }

    if (Number.isNaN(movement) || movement < 0 || Number.isNaN(streak) || streak < 0) {
      setErrorMessage("Bewegungsscore und Streak müssen gültige Zahlen ab 0 sein.");
      return;
    }

    setGrantingRandomCards(true);
    setMessage(null);
    setErrorMessage(null);

    const { data, error } = await supabase.rpc("admin_grant_random_catalog_cards", {
      p_user_id: userId,
      p_quantity: quantity,
      p_tier: randomTier,
      p_movement_score: movement,
      p_streak_days: streak,
      p_boosted_pack: randomBoosted,
      p_tradable: true,
    });

    if (error) {
      setErrorMessage(error.message || "Zufallskarten konnten nicht vergeben werden.");
      setGrantingRandomCards(false);
      return;
    }

    const cards = Array.isArray(data) ? (data as JsonMap[]) : [];
    const summary = summarizeRarities(cards);
    setMessage(`${cards.length} Zufallskarte(n) hinzugefügt: ${summary}.`);
    setGrantingRandomCards(false);
    await Promise.all([loadInventory(), loadDetail()]);
  }

  async function handleRepairMarketCard(card: JsonMap) {
    const inventoryId = readString(card, "id");
    if (!inventoryId) return;

    const state = getMarketState(card);
    const label = cardDisplayName(card);
    const actionText = state === "active"
      ? "Das aktive Börsenangebot wird abgebrochen und die Karte kehrt ins Inventar zurück."
      : "Der Börsenstatus wird repariert und die Karte wird wieder sichtbar gemacht.";

    if (!window.confirm(`${label}\n\n${actionText}`)) return;

    setRepairingMarketCardId(inventoryId);
    setMessage(null);
    setErrorMessage(null);

    const { data, error } = await supabase.rpc("admin_repair_market_card", {
      p_inventory_id: inventoryId,
    });

    if (error) {
      setErrorMessage(error.message || "Börsenstatus konnte nicht repariert werden.");
      setRepairingMarketCardId(null);
      return;
    }

    const action = readString(data as JsonMap, "action");
    setMessage(
      action === "active_listing_canceled"
        ? `${label}: Börsenangebot abgebrochen, Karte ist wieder im Inventar.`
        : `${label}: Börsenstatus repariert, Karte ist wieder sichtbar.`
    );
    setRepairingMarketCardId(null);
    await Promise.all([loadInventory(), loadDetail()]);
  }

  async function handleDeleteInventoryCard(card: JsonMap) {
    const inventoryId = readString(card, "id");
    if (!inventoryId) return;

    const state = getMarketState(card);
    const label = cardDisplayName(card);

    if (state === "active" || isMarketProblem(card)) {
      setErrorMessage("Diese Karte ist mit der Börse verknüpft. Bitte zuerst den Börsenstatus reparieren bzw. das Angebot abbrechen.");
      return;
    }

    const accepted = window.confirm(
      `${label}\n\nKarte dauerhaft löschen?\n\nNicht verkaufte alte Listings und Gebote dieser Karte werden ebenfalls entfernt. Bereits verkaufte Karten können bewusst nicht gelöscht werden, damit die Verkaufs-Historie erhalten bleibt.`
    );

    if (!accepted) return;

    setDeletingCardId(inventoryId);
    setMessage(null);
    setErrorMessage(null);

    const { data, error } = await supabase.rpc("admin_delete_inventory_card", {
      p_inventory_id: inventoryId,
    });

    if (error) {
      const raw = error.message || "Karte konnte nicht gelöscht werden.";
      const friendly = raw.includes("card_has_marketplace_sale_history")
        ? "Diese Karte wurde bereits über die Börse verkauft. Sie bleibt als Transaktions-Historie erhalten und kann nicht gelöscht werden."
        : raw.includes("card_is_in_exhibition")
        ? "Die Karte ist aktuell in der Ausstellung. Entferne sie dort zuerst, dann kannst du sie löschen."
        : raw.includes("card_is_on_market")
        ? "Die Karte ist noch auf der Börse. Bitte zuerst den Börsenstatus reparieren bzw. das Angebot abbrechen."
        : raw;
      setErrorMessage(friendly);
      setDeletingCardId(null);
      return;
    }

    setMessage(`${readString(data as JsonMap, "deleted_name") || label} wurde dauerhaft gelöscht.`);
    setDeletingCardId(null);
    await Promise.all([loadInventory(), loadDetail()]);
  }

  async function reloadAll() {
    await Promise.all([loadDetail(), loadInventory(), loadPacks()]);
    if (activeTab === "cards") {
      await loadCatalog();
    }
  }

  useEffect(() => {
    reloadAll();
  }, [userId]);

  useEffect(() => {
    if (activeTab === "cards" && catalogCards.length === 0 && !catalogLoading) {
      loadCatalog();
    }
  }, [activeTab]);

  const profile = detail?.profile || {};
  const subscription = detail?.subscription || null;

  const filteredInventory = useMemo(() => {
    const search = cardSearch.trim().toLowerCase();

    if (!search) return inventory;

    return inventory.filter((item) => JSON.stringify(item).toLowerCase().includes(search));
  }, [inventory, cardSearch]);

  const marketActiveCards = inventory.filter((card) => getMarketState(card) === "active").length;
  const marketProblemCards = inventory.filter((card) => isMarketProblem(card)).length;

  const filteredPackRewards = useMemo(() => {
    const search = packSearch.trim().toLowerCase();

    if (!search) return packRewards;

    return packRewards.filter((item) => JSON.stringify(item).toLowerCase().includes(search));
  }, [packRewards, packSearch]);

  const boostCoinsSpent = boostPurchases.reduce((sum, item) => {
    return sum + readNumber(item, "total_coin_cost");
  }, 0);

  // Die Übersicht zählt echte Inventar-Token aus event_pack_rewards.
  // Dadurch werden normale Shop-/Historien-Einträge nicht mit den Tokens verwechselt.
  const pendingPackTokenQuantity = packRewards
    .filter((item) =>
      readString(item, "status").toLowerCase() === "pending" &&
      normalizeInventoryTokenKey(readString(item, "pack_key")) === "extra_pack"
    )
    .reduce((sum, item) => sum + Math.max(0, readNumber(item, "quantity")), 0);

  const pendingBoostTokenQuantity = packRewards
    .filter((item) =>
      readString(item, "status").toLowerCase() === "pending" &&
      normalizeInventoryTokenKey(readString(item, "pack_key")) === "boost_pack"
    )
    .reduce((sum, item) => sum + Math.max(0, readNumber(item, "quantity")), 0);

  const activeBoostTokenQuantity = packRewards
    .filter((item) =>
      readString(item, "status").toLowerCase() === "active" &&
      normalizeInventoryTokenKey(readString(item, "pack_key")) === "boost_pack"
    )
    .reduce((sum, item) => sum + Math.max(0, readNumber(item, "quantity") || 1), 0);

  const totalPendingTokenQuantity = pendingPackTokenQuantity + pendingBoostTokenQuantity;

  async function handleCoinSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amount = Number.parseInt(coinAmount, 10);

    if (Number.isNaN(amount) || amount < 0) {
      setErrorMessage("Bitte eine gültige Coin-Zahl eingeben.");
      return;
    }

    setSavingCoins(true);
    setMessage(null);
    setErrorMessage(null);

    const { data, error } = await supabase.rpc("admin_adjust_user_coins", {
      p_user_id: userId,
      p_mode: coinMode,
      p_amount: amount,
    });

    if (error) {
      setErrorMessage(error.message || "Coins konnten nicht geändert werden.");
      setSavingCoins(false);
      return;
    }

    const oldCoins = readNumber(data as JsonMap, "old_coins");
    const newCoins = readNumber(data as JsonMap, "new_coins");

    setMessage(`Coins geändert: ${oldCoins} → ${newCoins}`);
    setSavingCoins(false);
    await loadDetail();
  }

  async function handleSubscriptionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const months = Number.parseInt(subscriptionMonths, 10);

    if (Number.isNaN(months) || months < 0) {
      setErrorMessage("Bitte eine gültige Monatszahl eingeben.");
      return;
    }

    setSavingSubscription(true);
    setMessage(null);
    setErrorMessage(null);

    const { error } = await supabase.rpc("admin_update_user_subscription", {
      p_user_id: userId,
      p_variant: subscriptionVariant,
      p_status: subscriptionStatus,
      p_months: months,
      p_provider: subscriptionProvider || "admin",
    });

    if (error) {
      setErrorMessage(error.message || "Abo konnte nicht geändert werden.");
      setSavingSubscription(false);
      return;
    }

    setMessage("Abo wurde aktualisiert.");
    setSavingSubscription(false);
    await loadDetail();
  }

  async function handleGrantPackSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const quantity = Number.parseInt(grantQuantity, 10);
    if (Number.isNaN(quantity) || quantity < 1 || quantity > 100) {
      setErrorMessage("Bitte 1 bis 100 Pack Tokens auswählen.");
      return;
    }

    setGrantingPack(true);
    setMessage(null);
    setErrorMessage(null);

    const { data, error } = await supabase.rpc("admin_grant_inventory_pack_token", {
      p_user_id: userId,
      p_quantity: quantity,
      p_note: grantNote || "Admin Grant",
    });

    if (error) {
      setErrorMessage(error.message || "Pack Token konnte nicht verteilt werden.");
      setGrantingPack(false);
      return;
    }

    const inserted = readNumber(data as JsonMap, "inserted") || quantity;
    setMessage(`${inserted} Pack Token(s) mit je 5 Karten verteilt.`);
    setGrantingPack(false);
    await Promise.all([loadDetail(), loadPacks()]);
  }

  async function handleGrantBoostSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const quantity = Number.parseInt(boostQuantity, 10);
    if (Number.isNaN(quantity) || quantity < 1 || quantity > 100) {
      setErrorMessage("Bitte 1 bis 100 Boost Tokens auswählen.");
      return;
    }

    setGrantingBoost(true);
    setMessage(null);
    setErrorMessage(null);

    const { data, error } = await supabase.rpc("admin_grant_inventory_boost_token", {
      p_user_id: userId,
      p_quantity: quantity,
      p_note: boostNote || "Admin Boost",
    });

    if (error) {
      setErrorMessage(error.message || "Boost Token konnte nicht verteilt werden.");
      setGrantingBoost(false);
      return;
    }

    const inserted = readNumber(data as JsonMap, "inserted") || quantity;
    setMessage(`${inserted} Boost Token(s) verteilt · +10 % für 7 Tage ab Aktivierung.`);
    setGrantingBoost(false);
    await Promise.all([loadDetail(), loadPacks()]);
  }

  return (
    <div style={pageStyle}>
      <div style={pageHeaderStyle}>
        <div>
          <Link href="/admin/users" style={backLinkStyle}>← Zurück zu Users</Link>
          <h1 style={pageTitleStyle}>User Details</h1>
          <p style={pageSubtitleStyle}>Coins, Abo, getrennte Inventar-Tokens und Karten verwalten.</p>
        </div>

        <button type="button" onClick={reloadAll} style={refreshButtonStyle}>Neu laden</button>
      </div>

      {errorMessage && <div style={errorBoxStyle}>{errorMessage}</div>}
      {message && <div style={successBoxStyle}>{message}</div>}

      <div style={kpiGridStyle}>
        <KpiCard title="Username" value={loading ? "..." : readString(profile, "username") || "—"} />
        <KpiCard title="E-Mail" value={loading ? "..." : readString(profile, "email") || "—"} />
        <KpiCard title="Coins" value={loading ? "..." : formatNumber(readNumber(profile, "coins"))} accent="green" />
        <KpiCard title="Card Points" value={loading ? "..." : formatNumber(readNumber(profile, "card_points"))} />
        <KpiCard title="Karten" value={loading ? "..." : formatNumber(detail?.inventory_count)} />
        <KpiCard title="Pack Tokens" value={packLoading ? "..." : String(pendingPackTokenQuantity)} accent="blue" />
        <KpiCard title="Boost Tokens" value={packLoading ? "..." : String(pendingBoostTokenQuantity)} accent="orange" />
        <KpiCard title="Aktiver Boost" value={packLoading ? "..." : activeBoostTokenQuantity > 0 ? "Ja" : "Nein"} accent={activeBoostTokenQuantity > 0 ? "green" : "default"} />
      </div>

      <div style={tabsStyle}>
        <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>Übersicht</TabButton>
        <TabButton active={activeTab === "packs"} onClick={() => setActiveTab("packs")}>Boosts & Tokens</TabButton>
        <TabButton active={activeTab === "cards"} onClick={() => setActiveTab("cards")}>Karten</TabButton>
        <TabButton active={activeTab === "raw"} onClick={() => setActiveTab("raw")}>Rohdaten</TabButton>
      </div>

      {activeTab === "overview" && (
        <>
          <div style={gridTwoStyle}>
            <section style={cardStyle}>
              <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Profil</h2></div>
              <InfoGrid
                items={[
                  ["User ID", userId],
                  ["Username", readString(profile, "username") || "—"],
                  ["E-Mail", readString(profile, "email") || "—"],
                  ["Coins", formatNumber(readNumber(profile, "coins"))],
                  ["Card Points", formatNumber(readNumber(profile, "card_points"))],
                  ["Admin", readBoolean(profile, "is_admin") ? "Ja" : "Nein"],
                  ["Erstellt", formatDate(readString(profile, "created_at"))],
                  ["Last Seen", formatDate(readString(profile, "last_seen_at"))],
                  ["Background", readString(profile, "selected_background_id") || "—"],
                ]}
              />
            </section>

            <section style={cardStyle}>
              <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Coins bearbeiten</h2></div>
              <form onSubmit={handleCoinSubmit} style={formStyle}>
                <div>
                  <label style={labelStyle}>Aktion</label>
                  <select value={coinMode} onChange={(event) => setCoinMode(event.target.value as CoinMode)} style={inputStyle}>
                    <option value="add">Coins hinzufügen</option>
                    <option value="subtract">Coins abziehen</option>
                    <option value="set">Coins exakt setzen</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Betrag</label>
                  <input type="number" min="0" step="1" value={coinAmount} onChange={(event) => setCoinAmount(event.target.value)} style={inputStyle} />
                </div>
                <button type="submit" disabled={savingCoins} style={primaryButtonStyle}>{savingCoins ? "Speichere..." : "Coins speichern"}</button>
              </form>
              <p style={hintStyle}>Abziehen geht nie unter 0. Setzen ersetzt den aktuellen Coin-Wert.</p>
            </section>
          </div>

          <div style={gridTwoStyle}>
            <section style={cardStyle}>
              <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Aktuelles Abo</h2></div>
              {subscription ? (
                <InfoGrid
                  items={[
                    ["Variante", labelVariant(readString(subscription, "variant"))],
                    ["Status", readString(subscription, "status") || "—"],
                    ["Preis", formatMoney(readNumber(subscription, "price_eur"))],
                    ["Provider", readString(subscription, "provider") || "—"],
                    ["Affiliate", readBoolean(subscription, "is_affiliate") ? "Ja" : "Nein"],
                    ["Started", formatDate(readString(subscription, "started_at"))],
                    ["Expires", formatDate(readString(subscription, "expires_at"))],
                    ["Created", formatDate(readString(subscription, "created_at"))],
                  ]}
                />
              ) : <p style={emptyTextStyle}>Noch kein Abo vorhanden.</p>}
            </section>

            <section style={cardStyle}>
              <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Abo hoch-/runtersetzen</h2></div>
              <form onSubmit={handleSubscriptionSubmit} style={formStyle}>
                <div>
                  <label style={labelStyle}>Variante</label>
                  <select value={subscriptionVariant} onChange={(event) => setSubscriptionVariant(event.target.value as SubscriptionVariant)} style={inputStyle}>
                    {variantOptions.map((variant) => <option key={variant.value} value={variant.value}>{variant.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={subscriptionStatus} onChange={(event) => setSubscriptionStatus(event.target.value as SubscriptionStatus)} style={inputStyle}>
                    {statusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Laufzeit in Monaten</label>
                  <input type="number" min="0" step="1" value={subscriptionMonths} onChange={(event) => setSubscriptionMonths(event.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Provider</label>
                  <input type="text" value={subscriptionProvider} onChange={(event) => setSubscriptionProvider(event.target.value)} style={inputStyle} />
                </div>
                <button type="submit" disabled={savingSubscription} style={primaryButtonStyle}>{savingSubscription ? "Speichere..." : "Abo speichern"}</button>
              </form>
              <p style={hintStyle}>Free setzt Preis auf 0. Paid Tiers nutzen Basic 1,99 €, Pro 2,99 €, Elite 4,99 €, Master 7,99 €.</p>
            </section>
          </div>
        </>
      )}

      {activeTab === "packs" && (
        <>
          <div style={gridTwoStyle}>
            <section style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>Inventar-Tokens vergeben</h2>
                  <p style={sectionTextStyle}>Die Tokens erscheinen im Inventar des Users. Ein Pack Token öffnet immer genau 5 Karten. Ein Boost Token wird vom User selbst aktiviert und gilt dann 7 Tage.</p>
                </div>
              </div>

              <div style={gridTwoStyle}>
                <form onSubmit={handleGrantPackSubmit} style={formStyle}>
                  <div>
                    <label style={labelStyle}>Pack Token</label>
                    <div style={selectedCardBoxStyle}><strong>5 Karten pro Token</strong><span style={sectionTextStyle}>Der User öffnet den Token selbst im Inventar.</span></div>
                  </div>
                  <div>
                    <label style={labelStyle}>Anzahl Tokens</label>
                    <input type="number" min="1" max="100" step="1" value={grantQuantity} onChange={(event) => setGrantQuantity(event.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Notiz</label>
                    <input type="text" value={grantNote} onChange={(event) => setGrantNote(event.target.value)} style={inputStyle} />
                  </div>
                  <button type="submit" disabled={grantingPack} style={primaryButtonStyle}>{grantingPack ? "Verteile..." : "5-Karten-Packtoken vergeben"}</button>
                </form>

                <form onSubmit={handleGrantBoostSubmit} style={formStyle}>
                  <div>
                    <label style={labelStyle}>Boost Token</label>
                    <div style={selectedCardBoxStyle}><strong>+10 % bessere Drop-Chancen</strong><span style={sectionTextStyle}>Gilt 7 Tage ab Aktivierung. Kein Stacking während ein Boost aktiv ist.</span></div>
                  </div>
                  <div>
                    <label style={labelStyle}>Anzahl Tokens</label>
                    <input type="number" min="1" max="100" step="1" value={boostQuantity} onChange={(event) => setBoostQuantity(event.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Notiz</label>
                    <input type="text" value={boostNote} onChange={(event) => setBoostNote(event.target.value)} style={inputStyle} />
                  </div>
                  <button type="submit" disabled={grantingBoost} style={primaryButtonStyle}>{grantingBoost ? "Verteile..." : "+10 %-Boosttoken vergeben"}</button>
                </form>
              </div>
            </section>

            <section style={cardStyle}>
              <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Token-Übersicht</h2></div>
              <InfoGrid
                items={[
                  ["Verfügbare Pack Tokens", `${pendingPackTokenQuantity} · je 5 Karten`],
                  ["Verfügbare Boost Tokens", `${pendingBoostTokenQuantity} · je 7 Tage`],
                  ["Aktiver Boost", activeBoostTokenQuantity > 0 ? "Ja · +10 % Drop-Chancen" : "Nein"],
                  ["Tokens verfügbar gesamt", String(totalPendingTokenQuantity)],
                  ["Tokens / Historie", String(packRewards.length)],
                ]}
              />
              <p style={hintStyle}>Pack Token und Boost Token sind bewusst getrennte Inventar-Gegenstände. Ein Boost Token kann nicht zu einem Karten-Pack werden.</p>
            </section>
          </div>

          <section style={cardStyle}>
            <div style={sectionHeaderStyle}>
              <div>
                <h2 style={sectionTitleStyle}>Inventar-Tokens & Historie</h2>
                <p style={sectionTextStyle}>Pack Token: immer 5 Karten. Boost Token: +10 % bessere Drop-Chancen für 7 Tage ab Aktivierung.</p>
              </div>
              <span style={sectionCountStyle}>{packLoading ? "Lade..." : `${filteredPackRewards.length} Einträge`}</span>
            </div>
            <input type="text" placeholder="Token suchen: Pack, Boost, Status, Notiz oder ID..." value={packSearch} onChange={(event) => setPackSearch(event.target.value)} style={{ ...inputStyle, marginBottom: "16px" }} />
            <PackRewardGrid items={filteredPackRewards} />
          </section>

          <section style={cardStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>Frühere Boost-Pack-Käufe</h2>
              <span style={sectionCountStyle}>{boostPurchases.length} Einträge</span>
            </div>
            <p style={sectionTextStyle}>Diese Historie ist getrennt von den Inventar-Tokens oben und dient nur der Nachvollziehbarkeit älterer Shop-Käufe.</p>
            <JsonCardGrid items={boostPurchases} emptyText="Keine früheren Boost-Pack-Käufe gefunden." />
          </section>

          <section style={cardStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>Daily Pack Claims</h2>
              <span style={sectionCountStyle}>{dailyClaims.length} Einträge</span>
            </div>
            <JsonCardGrid items={dailyClaims} emptyText="Keine Daily Claims gefunden." />
          </section>
        </>
      )}

      {activeTab === "cards" && (
        <>
          <div style={gridTwoStyle}>
            <section style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>Bestimmte Karte hinzufügen</h2>
                  <p style={sectionTextStyle}>
                    Wähle eine aktive Karte aus dem echten Frontend-Katalog. Auch Set-Completion-Karten können hier bewusst vergeben werden.
                  </p>
                </div>
              </div>

              <form onSubmit={handleManualCardGrant} style={formStyle}>
                <div>
                  <label style={labelStyle}>Ausgewählte Karte</label>
                  <div style={selectedCardBoxStyle}>
                    {selectedCatalogCard ? (
                      <div style={selectedCardRowStyle}>
                        <span style={rarityBadgeStyleFor(getCardRarity(selectedCatalogCard))}>
                          {getCardRarity(selectedCatalogCard).toUpperCase()}
                        </span>
                        <span style={selectedCardNameStyle}>{cardDisplayName(selectedCatalogCard)}</span>
                      </div>
                    ) : (
                      <span style={emptyTextStyle}>Noch keine Karte ausgewählt.</span>
                    )}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Zustand</label>
                  <select
                    value={conditionMode}
                    onChange={(event) => setConditionMode(event.target.value as ConditionMode)}
                    style={inputStyle}
                  >
                    <option value="random">Automatisch würfeln</option>
                    <option value="custom">Zustand selbst festlegen</option>
                    <option value="mint">Neuwertig · 100 %</option>
                  </select>
                </div>

                {conditionMode === "custom" && (
                  <div>
                    <label style={labelStyle}>Eigener Zustand in %</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={customCondition}
                      onChange={(event) => setCustomCondition(event.target.value)}
                      style={inputStyle}
                    />
                  </div>
                )}

                {conditionMode === "random" && (
                  <>
                    <div>
                      <label style={labelStyle}>Abo-Profil für die Abnutzung</label>
                      <select
                        value={conditionTier}
                        onChange={(event) => setConditionTier(event.target.value as SubscriptionVariant)}
                        style={inputStyle}
                      >
                        {variantOptions.map((variant) => (
                          <option key={variant.value} value={variant.value}>
                            {variant.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={twoInputGridStyle}>
                      <div>
                        <label style={labelStyle}>Bewegungsscore</label>
                        <input
                          type="number"
                          min="0"
                          value={conditionMovement}
                          onChange={(event) => setConditionMovement(event.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Streak-Tage</label>
                        <input
                          type="number"
                          min="0"
                          value={conditionStreak}
                          onChange={(event) => setConditionStreak(event.target.value)}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={!selectedCatalogCard || grantingCatalogCard}
                  style={primaryButtonStyle}
                >
                  {grantingCatalogCard ? "Füge hinzu..." : "Ausgewählte Karte hinzufügen"}
                </button>
              </form>
            </section>

            <section style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>Zufällige Karten würfeln</h2>
                  <p style={sectionTextStyle}>
                    Nutzt die gleichen Rarity-Boni, Deckel und die gleiche Abnutzungslogik wie deine Pack-Drops. Set-Completion-Karten sind dabei ausgeschlossen.
                  </p>
                </div>
              </div>

              <form onSubmit={handleRandomCardGrant} style={formStyle}>
                <div style={twoInputGridStyle}>
                  <div>
                    <label style={labelStyle}>Anzahl Karten</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={randomQuantity}
                      onChange={(event) => setRandomQuantity(event.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Abo-Profil</label>
                    <select
                      value={randomTier}
                      onChange={(event) => setRandomTier(event.target.value as SubscriptionVariant)}
                      style={inputStyle}
                    >
                      {variantOptions.map((variant) => (
                        <option key={variant.value} value={variant.value}>
                          {variant.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={twoInputGridStyle}>
                  <div>
                    <label style={labelStyle}>Bewegungsscore</label>
                    <input
                      type="number"
                      min="0"
                      value={randomMovement}
                      onChange={(event) => setRandomMovement(event.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Streak-Tage</label>
                    <input
                      type="number"
                      min="0"
                      value={randomStreak}
                      onChange={(event) => setRandomStreak(event.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <label style={checkRowStyle}>
                  <input
                    type="checkbox"
                    checked={randomBoosted}
                    onChange={(event) => setRandomBoosted(event.target.checked)}
                  />
                  <span>Boost-Pack aktiv</span>
                </label>

                <button type="submit" disabled={grantingRandomCards} style={primaryButtonStyle}>
                  {grantingRandomCards ? "Würfle..." : "Karten würfeln & hinzufügen"}
                </button>
              </form>
            </section>
          </div>

          <section style={cardStyle}>
            <div style={sectionHeaderStyle}>
              <div>
                <h2 style={sectionTitleStyle}>Kartenkatalog</h2>
                <p style={sectionTextStyle}>
                  Aktive Karten aus dem echten Frontend-Katalog. Nach der Auswahl kannst du den Katalog einklappen und direkt oben die Karte vergeben.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={sectionCountStyle}>{catalogLoading ? "Lade..." : `${catalogCards.length} Karten`}</span>
                <button type="button" onClick={() => setCatalogCollapsed((value) => !value)} style={secondaryButtonStyle}>
                  {catalogCollapsed ? "▸ Katalog anzeigen" : "▾ Katalog einklappen"}
                </button>
              </div>
            </div>

            {catalogCollapsed ? (
              <div style={selectedCardBoxStyle}>
                {selectedCatalogCard ? (
                  <div style={selectedCardRowStyle}>
                    <span style={rarityBadgeStyleFor(getCardRarity(selectedCatalogCard))}>{getCardRarity(selectedCatalogCard).toUpperCase()}</span>
                    <span style={selectedCardNameStyle}>Ausgewählt: {cardDisplayName(selectedCatalogCard)}</span>
                  </div>
                ) : (
                  <span style={emptyTextStyle}>Der Katalog ist eingeklappt. Öffne ihn, um eine Karte auszuwählen.</span>
                )}
              </div>
            ) : (
              <>
                <form onSubmit={handleCatalogSearch} style={catalogFilterStyle}>
                  <input
                    type="text"
                    placeholder="Name, Sport, Serie oder Karten-ID suchen"
                    value={catalogSearch}
                    onChange={(event) => setCatalogSearch(event.target.value)}
                    style={inputStyle}
                  />
                  <select
                    value={catalogRarity}
                    onChange={(event) => setCatalogRarity(event.target.value as CatalogRarity)}
                    style={inputStyle}
                  >
                    <option value="all">Alle Seltenheiten</option>
                    <option value="basic">Basic</option>
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                    <option value="ultra">Ultra</option>
                  </select>
                  <label style={checkRowStyle}>
                    <input type="checkbox" checked={includeSetCompletion} onChange={(event) => setIncludeSetCompletion(event.target.checked)} />
                    <span>Set-Completion anzeigen</span>
                  </label>
                  <button type="submit" disabled={catalogLoading} style={secondaryButtonStyle}>{catalogLoading ? "Suche..." : "Katalog suchen"}</button>
                </form>

                {catalogLoading ? (
                  <p style={emptyTextStyle}>Katalog wird geladen...</p>
                ) : (
                  <CatalogCardGrid
                    cards={catalogCards}
                    selectedId={selectedCatalogCard ? readString(selectedCatalogCard, "id") : ""}
                    onSelect={(card) => {
                      setSelectedCatalogCard(card);
                      setCatalogCollapsed(true);
                    }}
                  />
                )}
              </>
            )}
          </section>

          <section style={cardStyle}>
            <div style={sectionHeaderStyle}>
              <div>
                <h2 style={sectionTitleStyle}>Karten im Inventar</h2>
                <p style={sectionTextStyle}>
                  Rahmen und Zustandsanzeige folgen der Seltenheit: Basic grau, Common grün, Rare blau, Epic lila, Legendary gold, Ultra rot.
                </p>
              </div>
              <span style={sectionCountStyle}>
                {inventoryLoading
                  ? "Lade..."
                  : `${filteredInventory.length} Karten · ${marketActiveCards} auf Börse${marketProblemCards > 0 ? ` · ${marketProblemCards} Börsenfehler` : ""}`}
              </span>
            </div>

            <input
              type="text"
              placeholder="Inventar durchsuchen: Name, Sport, Seltenheit, Serie..."
              value={cardSearch}
              onChange={(event) => setCardSearch(event.target.value)}
              style={{ ...inputStyle, marginBottom: "16px" }}
            />

            {inventoryLoading ? (
              <p style={emptyTextStyle}>Inventar wird geladen...</p>
            ) : (
              <InventoryVisualGrid
                items={filteredInventory}
                deletingCardId={deletingCardId}
                repairingMarketCardId={repairingMarketCardId}
                onDelete={handleDeleteInventoryCard}
                onRepairMarket={handleRepairMarketCard}
              />
            )}
          </section>
        </>
      )}

      {activeTab === "raw" && (
        <section style={cardStyle}>
          <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Rohdaten</h2></div>
          <pre style={rawBoxStyle}>{JSON.stringify({ detail, inventory, packRewards, boostPurchases, dailyClaims }, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} style={active ? activeTabButtonStyle : tabButtonStyle}>{children}</button>;
}

function KpiCard({ title, value, accent = "default" }: { title: string; value: string; accent?: "default" | "green" | "orange" | "blue" }) {
  const valueStyle = accent === "green" ? greenValueStyle : accent === "orange" ? orangeValueStyle : accent === "blue" ? blueValueStyle : kpiValueStyle;
  return <div style={kpiCardStyle}><p style={kpiTitleStyle}>{title}</p><h3 style={valueStyle}>{value}</h3></div>;
}

function InfoGrid({ items, compact = false }: { items: [string, string][]; compact?: boolean }) {
  return <div style={compact ? infoGridCompactStyle : infoGridStyle}>{items.map(([label, value]) => <div key={`${label}-${value}`} style={infoItemStyle}><div style={infoLabelStyle}>{label}</div><div style={infoValueStyle}>{value}</div></div>)}</div>;
}

function CatalogCardGrid({
  cards,
  selectedId,
  onSelect,
}: {
  cards: CatalogCard[];
  selectedId: string;
  onSelect: (card: CatalogCard) => void;
}) {
  if (cards.length === 0) {
    return <p style={emptyTextStyle}>Keine aktiven Karten gefunden.</p>;
  }

  return (
    <div style={visualCardGridStyle}>
      {cards.map((card, index) => {
        const id = readString(card, "id");
        const selected = id === selectedId;

        return (
          <button
            type="button"
            key={id || `${index}`}
            onClick={() => onSelect(card)}
            style={{
              ...catalogCardButtonStyle,
              ...rarityCardStyle(getCardRarity(card)),
              outline: selected ? "3px solid #ffffff" : "none",
              transform: selected ? "translateY(-2px)" : "none",
            }}
          >
            <CardVisual card={card} compact />
            {isSetCompletionCard(card) && (
              <span style={specialBadgeStyle}>Set Completion</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function InventoryVisualGrid({
  items,
  deletingCardId,
  repairingMarketCardId,
  onDelete,
  onRepairMarket,
}: {
  items: JsonMap[];
  deletingCardId: string | null;
  repairingMarketCardId: string | null;
  onDelete: (card: JsonMap) => void;
  onRepairMarket: (card: JsonMap) => void;
}) {
  if (items.length === 0) {
    return <p style={emptyTextStyle}>Keine Karten gefunden.</p>;
  }

  return (
    <div style={visualCardGridStyle}>
      {items.map((card, index) => {
        const inventoryId = readString(card, "id");
        const marketState = getMarketState(card);
        const blockedByMarket = marketState === "active" || isMarketProblem(card);
        const isDeleting = deletingCardId === inventoryId;
        const isRepairing = repairingMarketCardId === inventoryId;

        return (
          <div
            key={inventoryId || `${index}`}
            style={{
              ...visualCardStyle,
              ...rarityCardStyle(getCardRarity(card)),
            }}
          >
            <CardVisual card={card} />
            <MarketStatusPanel card={card} />

            <div style={inventoryActionRowStyle}>
              {blockedByMarket ? (
                <button
                  type="button"
                  onClick={() => onRepairMarket(card)}
                  disabled={isRepairing}
                  style={marketRepairButtonStyle}
                >
                  {isRepairing
                    ? "Börse wird repariert..."
                    : marketState === "active"
                    ? "Angebot abbrechen"
                    : "Börsenstatus reparieren"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onDelete(card)}
                  disabled={isDeleting}
                  style={deleteCardButtonStyle}
                >
                  {isDeleting ? "Lösche..." : "Karte löschen"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MarketStatusPanel({ card }: { card: JsonMap }) {
  const state = getMarketState(card);

  if (state === "not_listed") {
    return <div style={marketNeutralBoxStyle}>Nicht auf der Börse</div>;
  }

  if (state === "active") {
    const price = readNumber(card, "market_price");
    const buyNow = readNumber(card, "market_buy_now_price");
    const bids = readNumber(card, "market_bid_count");
    const highestBid = readNumber(card, "market_highest_bid");

    return (
      <div style={marketActiveBoxStyle}>
        <strong style={marketTitleStyle}>Auf der Börse</strong>
        <span style={marketTextStyle}>Aktueller Preis: {formatNumber(price)} Coins</span>
        {buyNow > 0 && <span style={marketTextStyle}>Sofortkauf: {formatNumber(buyNow)} Coins</span>}
        <span style={marketTextStyle}>
          Gebote: {formatNumber(bids)}{highestBid > 0 ? ` · Höchstes: ${formatNumber(highestBid)}` : ""}
        </span>
        <span style={marketTextStyle}>Endet: {formatDate(readString(card, "market_expires_at"))}</span>
      </div>
    );
  }

  return (
    <div style={marketErrorBoxStyle}>
      <strong style={marketTitleStyle}>Börsenfehler erkannt</strong>
      <span style={marketTextStyle}>{marketProblemText(state)}</span>
      <span style={marketTextStyle}>Die Karte kann in der App verschwinden, solange dieser Status besteht.</span>
    </div>
  );
}

function getMarketState(card: JsonMap) {
  const fromServer = readString(card, "market_state").toLowerCase();

  if (fromServer) return fromServer;

  return readBoolean(card, "on_market") ? "stuck_missing_listing" : "not_listed";
}

function isMarketProblem(card: JsonMap) {
  const state = getMarketState(card);
  return state !== "not_listed" && state !== "active";
}

function marketProblemText(state: string) {
  if (state === "stuck_missing_listing") {
    return "on_market ist aktiv, aber es wurde kein passendes Listing gefunden.";
  }
  if (state === "stuck_expired_listing") {
    return "Das Listing ist abgelaufen, aber die Karte ist weiterhin für die Börse blockiert.";
  }
  if (state === "stuck_active_listing") {
    return "Ein aktives Listing existiert, aber die Karte ist im Inventar nicht als Börsenkarte markiert.";
  }
  if (state === "stuck_inactive_listing") {
    return "Die Karte ist für die Börse blockiert, obwohl das Listing nicht mehr aktiv ist.";
  }
  return "Börsenstatus ist inkonsistent.";
}

function CardVisual({ card, compact = false }: { card: JsonMap; compact?: boolean }) {
  const rarity = getCardRarity(card);
  const condition = getCardCondition(card);
  const imageUrl = resolveCardImage(card);
  const name = cardDisplayName(card);
  const sport = readString(card, "sport") || "—";
  const series = readString(card, "series") || "—";

  return (
    <>
      <div style={cardImageWrapStyle}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            style={cardImageStyle}
          />
        ) : (
          <div style={cardImagePlaceholderStyle}>CARDLE TICS</div>
        )}
        <span style={rarityBadgeStyleFor(rarity)}>{rarity.toUpperCase()}</span>
      </div>

      <div style={cardBodyStyle}>
        <strong style={cardNameVisualStyle}>{name}</strong>
        <span style={cardMetaStyle}>{sport} · {series}</span>

        {!compact && (
          <>
            <div style={conditionHeaderStyle}>
              <span>Zustand</span>
              <strong>{condition}%</strong>
            </div>
            <div style={conditionTrackStyle}>
              <div
                style={{
                  ...conditionFillStyle,
                  width: `${condition}%`,
                  background: conditionColor(condition),
                }}
              />
            </div>
            <span style={cardDateStyle}>
              Erhalten: {formatDate(readString(card, "obtained_at") || readString(card, "created_at"))}
            </span>
          </>
        )}
      </div>
    </>
  );
}

function getCardRarity(card: JsonMap) {
  const raw = (readString(card, "rarity") || "common").toLowerCase().trim();

  if (raw === "basic" || raw === "base" || raw === "starter") return "basic";
  if (raw === "rare") return "rare";
  if (raw === "epic") return "epic";
  if (raw === "legendary") return "legendary";
  if (raw === "ultra" || raw === "ultra_rare" || raw === "ultra-rare") return "ultra";
  return "common";
}

function getCardCondition(card: JsonMap) {
  const raw = readNumber(card, "condition_percent") || readNumber(card, "conditionPercent");
  return Math.max(1, Math.min(100, raw || 100));
}

function cardDisplayName(card: JsonMap) {
  return (
    readString(card, "name") ||
    readString(card, "card_name") ||
    readString(card, "title") ||
    readString(card, "card_id") ||
    "Unbekannte Karte"
  );
}

function resolveCardImage(card: JsonMap) {
  const raw =
    readString(card, "medium_url") ||
    readString(card, "mediumUrl") ||
    readString(card, "image_url") ||
    readString(card, "imageUrl") ||
    readString(card, "thumb_url") ||
    readString(card, "thumbUrl");

  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

  return supabase.storage.from("cards").getPublicUrl(raw).data.publicUrl;
}

function isSetCompletionCard(card: JsonMap) {
  const value = (readString(card, "special_type") || readString(card, "specialType")).toLowerCase();
  return ["set_completion", "completion", "full_set", "set_reward"].includes(value);
}

function rarityCardStyle(rarity: string): CSSProperties {
  const palette = rarityPalette(rarity);
  return {
    border: `2px solid ${palette.main}`,
    boxShadow: `0 0 0 1px ${palette.soft}, 0 12px 30px ${palette.glow}`,
  };
}

function rarityBadgeStyleFor(rarity: string): CSSProperties {
  const palette = rarityPalette(rarity);
  return {
    display: "inline-flex",
    padding: "6px 9px",
    borderRadius: "999px",
    background: palette.badgeBackground,
    color: palette.badgeText,
    border: `1px solid ${palette.main}`,
    fontSize: "10px",
    fontWeight: 900,
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  };
}

function rarityPalette(rarity: string) {
  switch (rarity) {
    case "basic":
      return {
        main: "#E4E4E4",
        soft: "rgba(228,228,228,0.25)",
        glow: "rgba(228,228,228,0.14)",
        badgeBackground: "#2a2a2a",
        badgeText: "#f3f4f6",
      };
    case "common":
      return {
        main: "#6DFF72",
        soft: "rgba(109,255,114,0.25)",
        glow: "rgba(109,255,114,0.16)",
        badgeBackground: "#12361a",
        badgeText: "#b9ffbc",
      };
    case "rare":
      return {
        main: "#4DA3FF",
        soft: "rgba(77,163,255,0.25)",
        glow: "rgba(77,163,255,0.16)",
        badgeBackground: "#102b4c",
        badgeText: "#b7d8ff",
      };
    case "epic":
      return {
        main: "#B16CFF",
        soft: "rgba(177,108,255,0.25)",
        glow: "rgba(177,108,255,0.18)",
        badgeBackground: "#351451",
        badgeText: "#e4c8ff",
      };
    case "legendary":
      return {
        main: "#FFD54A",
        soft: "rgba(255,213,74,0.25)",
        glow: "rgba(255,213,74,0.18)",
        badgeBackground: "#4a3510",
        badgeText: "#ffeca3",
      };
    default:
      return {
        main: "#FF5252",
        soft: "rgba(255,82,82,0.25)",
        glow: "rgba(255,82,82,0.18)",
        badgeBackground: "#4a1111",
        badgeText: "#ffc2c2",
      };
  }
}

function conditionColor(condition: number) {
  if (condition >= 80) return "#6DFF72";
  if (condition >= 50) return "#FFD54A";
  return "#FF5252";
}

function summarizeRarities(cards: JsonMap[]) {
  if (cards.length === 0) return "keine Karten";

  const counts = new Map<string, number>();
  for (const card of cards) {
    const rarity = getCardRarity(card);
    counts.set(rarity, (counts.get(rarity) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([rarity, count]) => `${count}× ${rarity.charAt(0).toUpperCase() + rarity.slice(1)}`)
    .join(", ");
}

function normalizeInventoryTokenKey(raw: string) {
  const value = raw.trim().toLowerCase().replaceAll("-", "_").replaceAll(" ", "_");
  if (["boost", "boostpack", "boost_pack", "boost_token", "drop_boost", "rarity_boost"].includes(value)) {
    return "boost_pack";
  }
  if (["pack_token", "token", "extra", "extra_pack", "free", "free_pack", "pro", "pro_pack", "elite", "elite_pack", "master", "master_pack"].includes(value)) {
    return "extra_pack";
  }
  return value;
}

function inventoryTokenTitle(token: JsonMap) {
  switch (normalizeInventoryTokenKey(readString(token, "pack_key"))) {
    case "boost_pack":
      return "Boost Token";
    case "extra_pack":
      return "Pack Token";
    case "basic_3_pack":
      return "Basis-Pack";
    case "common_3_pack":
      return "Gewöhnliches Pack";
    case "rare_3_pack":
      return "Seltenes Pack";
    case "epic_3_pack":
      return "Episches Pack";
    case "legendary_3_pack":
      return "Legendäres Pack";
    default:
      return readString(token, "pack_name") || readString(token, "pack_key") || "Event-Token";
  }
}

function inventoryTokenEffect(token: JsonMap) {
  switch (normalizeInventoryTokenKey(readString(token, "pack_key"))) {
    case "boost_pack":
      return "+10 % bessere Drop-Chancen · 7 Tage ab Aktivierung";
    case "extra_pack":
      return "Immer 5 Karten · wird vom User selbst geöffnet";
    case "basic_3_pack":
    case "common_3_pack":
    case "rare_3_pack":
    case "epic_3_pack":
    case "legendary_3_pack":
      return "3 Karten";
    default:
      return "Event-Belohnung";
  }
}

function tokenStatusLabel(status: string) {
  switch (status.trim().toLowerCase()) {
    case "pending":
      return "Verfügbar";
    case "active":
      return "Aktiv";
    case "consumed":
      return "Eingelöst";
    case "expired":
      return "Abgelaufen";
    default:
      return status || "—";
  }
}

function PackRewardGrid({ items }: { items: JsonMap[] }) {
  if (items.length === 0) {
    return <p style={emptyTextStyle}>Keine Inventar-Tokens gefunden.</p>;
  }

  return (
    <div style={cardGridStyle}>
      {items.map((token, index) => {
        const status = readString(token, "status") || "pending";
        const statusLower = status.toLowerCase();
        const receivedAt = readString(token, "received_at") || readString(token, "created_at");
        const activatedAt = readString(token, "activated_at");
        const expiresAt = readString(token, "expires_at");
        const consumedAt = readString(token, "consumed_at") || readString(token, "opened_at") || readString(token, "claimed_at");
        const quantity = Math.max(0, readNumber(token, "quantity"));
        const isPending = statusLower === "pending";
        const isActive = statusLower === "active";

        return (
          <div
            key={readString(token, "id") || `${index}`}
            style={{
              ...inventoryCardStyle,
              border: `1px solid ${isActive ? "#22c55e" : isPending ? "#4DA3FF" : "#27312d"}`,
            }}
          >
            <div style={cardTopRowStyle}>
              <strong style={cardNameStyle}>{inventoryTokenTitle(token)}</strong>
              <span
                style={{
                  ...rarityBadgeStyle,
                  background: isActive ? "#12361a" : isPending ? "#102b4c" : "#1d2a24",
                  color: isActive ? "#bbf7d0" : isPending ? "#b7d8ff" : "#d1d5db",
                  borderColor: isActive ? "#22c55e" : isPending ? "#4DA3FF" : "#475569",
                }}
              >
                {tokenStatusLabel(status)}
              </span>
            </div>

            <p style={{ ...sectionTextStyle, marginTop: 0, marginBottom: "12px" }}>
              {inventoryTokenEffect(token)}
            </p>

            <InfoGrid
              compact
              items={[
                ["Anzahl", String(quantity)],
                ["Erhalten am", formatDate(receivedAt)],
                ["Aktiviert am", activatedAt ? formatDate(activatedAt) : "—"],
                ["Gültig bis", expiresAt ? formatDate(expiresAt) : "—"],
                ["Eingelöst am", consumedAt ? formatDate(consumedAt) : "—"],
                ["Notiz", readString(token, "note") || readString(token, "admin_note") || "—"],
              ]}
            />
          </div>
        );
      })}
    </div>
  );
}

function JsonCardGrid({ items, emptyText, preferredTitleKeys = ["pack_key", "pack_name", "pack_tier", "reward_key", "status", "id"] }: { items: JsonMap[]; emptyText: string; preferredTitleKeys?: string[] }) {
  if (items.length === 0) return <p style={emptyTextStyle}>{emptyText}</p>;
  return <div style={cardGridStyle}>{items.map((item, index) => <div key={readString(item, "id") || `${index}`} style={inventoryCardStyle}><div style={cardTopRowStyle}><strong style={cardNameStyle}>{bestTitle(item, preferredTitleKeys)}</strong><span style={rarityBadgeStyle}>{readString(item, "status") || readString(item, "rarity") || "—"}</span></div><InfoGrid compact items={summaryItems(item)} /></div>)}</div>;
}

function summaryItems(item: JsonMap): [string, string][] {
  const preferred = ["id", "pack_key", "pack_name", "pack_tier", "reward_key", "status", "cards_count", "card_count", "cards_per_open", "quantity", "coin_cost", "total_coin_cost", "claim_date", "created_at", "claimed_at"];
  const rows: [string, string][] = [];
  for (const key of preferred) {
    if (item[key] !== undefined && item[key] !== null && rows.length < 8) {
      rows.push([key, readable(item[key])]);
    }
  }
  if (rows.length === 0) {
    for (const [key, value] of Object.entries(item).slice(0, 8)) rows.push([key, readable(value)]);
  }
  return rows;
}

function readable(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function bestTitle(item: JsonMap, keys: string[]) {
  for (const key of keys) {
    const value = readString(item, key);
    if (value) return value;
  }
  return "Eintrag";
}

function readString(source: JsonMap | null | undefined, key: string) {
  if (!source) return "";
  const value = source[key];
  if (value === null || value === undefined) return "";
  return String(value);
}

function readNumber(source: JsonMap | null | undefined, key: string): number;
function readNumber(value: unknown): number;
function readNumber(sourceOrValue: JsonMap | unknown, key?: string) {
  const value = key && sourceOrValue && typeof sourceOrValue === "object" ? (sourceOrValue as JsonMap)[key] : sourceOrValue;
  if (typeof value === "number") return Number.isNaN(value) ? 0 : value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function readBoolean(source: JsonMap | null | undefined, key: string) {
  if (!source) return false;
  return source[key] === true;
}

function formatNumber(value: unknown) { return Math.round(readNumber(value)).toLocaleString("de-DE"); }
function formatMoney(value: unknown) { return readNumber(value).toLocaleString("de-DE", { style: "currency", currency: "EUR" }); }
function formatDate(dateString?: string | null) { if (!dateString) return "—"; const date = new Date(dateString); if (Number.isNaN(date.getTime())) return "—"; return date.toLocaleString("de-DE"); }
function normalizeVariant(value: string): SubscriptionVariant { const variant = value.toLowerCase().trim(); if (variant === "basic") return "basic"; if (variant === "pro") return "pro"; if (variant === "elite") return "elite"; if (variant === "master") return "master"; return "free"; }
function normalizeStatus(value: string): SubscriptionStatus { const status = value.toLowerCase().trim(); if (status === "trialing") return "trialing"; if (status === "cancelled") return "cancelled"; if (status === "expired") return "expired"; return "active"; }
function labelVariant(value: string) { const variant = normalizeVariant(value); return variant.charAt(0).toUpperCase() + variant.slice(1); }

const pageStyle: CSSProperties = { width: "100%" };
const pageHeaderStyle: CSSProperties = { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "14px", flexWrap: "wrap", marginBottom: "20px" };
const backLinkStyle: CSSProperties = { display: "inline-flex", marginBottom: "10px", color: "#86efac", textDecoration: "none", fontWeight: 800 };
const pageTitleStyle: CSSProperties = { marginTop: 0, marginBottom: "8px", fontSize: "30px", color: "#e7f1eb" };
const pageSubtitleStyle: CSSProperties = { marginTop: 0, color: "#94a39b", lineHeight: 1.5 };
const refreshButtonStyle: CSSProperties = { minHeight: "42px", padding: "9px 14px", borderRadius: "12px", border: "1px solid #27312d", background: "#101714", color: "#e7f1eb", fontWeight: 800, cursor: "pointer" };
const errorBoxStyle: CSSProperties = { background: "#331717", border: "1px solid #7f1d1d", color: "#fecaca", borderRadius: "14px", padding: "12px 14px", marginBottom: "16px", lineHeight: 1.5 };
const successBoxStyle: CSSProperties = { background: "#163322", border: "1px solid #166534", color: "#bbf7d0", borderRadius: "14px", padding: "12px 14px", marginBottom: "16px", lineHeight: 1.5 };
const kpiGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "20px" };
const kpiCardStyle: CSSProperties = { background: "#171f1c", padding: "16px", borderRadius: "16px", border: "1px solid #27312d", boxShadow: "0 8px 30px rgba(0,0,0,0.16)" };
const kpiTitleStyle: CSSProperties = { margin: 0, fontSize: "13px", color: "#94a39b" };
const kpiValueStyle: CSSProperties = { margin: "10px 0 0 0", fontSize: "22px", color: "#e7f1eb", wordBreak: "break-word" };
const greenValueStyle: CSSProperties = { ...kpiValueStyle, color: "#86efac" };
const orangeValueStyle: CSSProperties = { ...kpiValueStyle, color: "#fdba74" };
const blueValueStyle: CSSProperties = { ...kpiValueStyle, color: "#93c5fd" };
const tabsStyle: CSSProperties = { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "18px" };
const tabButtonStyle: CSSProperties = { minHeight: "42px", padding: "9px 14px", borderRadius: "999px", border: "1px solid #27312d", background: "#101714", color: "#e7f1eb", fontWeight: 800, cursor: "pointer" };
const activeTabButtonStyle: CSSProperties = { ...tabButtonStyle, background: "#22c55e", color: "#08130c", border: "1px solid #22c55e" };
const gridTwoStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px", marginBottom: "18px" };
const cardStyle: CSSProperties = { background: "#171f1c", borderRadius: "16px", padding: "18px", border: "1px solid #27312d", boxShadow: "0 8px 30px rgba(0,0,0,0.16)", marginBottom: "18px" };
const sectionHeaderStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" };
const sectionTitleStyle: CSSProperties = { margin: 0, color: "#e7f1eb", fontSize: "20px" };
const sectionTextStyle: CSSProperties = { margin: "6px 0 0 0", color: "#94a39b", lineHeight: 1.5 };
const sectionCountStyle: CSSProperties = { color: "#94a39b", fontSize: "14px" };
const formStyle: CSSProperties = { display: "grid", gap: "14px" };
const labelStyle: CSSProperties = { display: "block", marginBottom: "8px", color: "#cfe0d6", fontWeight: 800 };
const inputStyle: CSSProperties = { width: "100%", minHeight: "46px", borderRadius: "12px", border: "1px solid #27312d", background: "#0f1512", color: "#e7f1eb", padding: "11px 13px", boxSizing: "border-box", outline: "none" };
const primaryButtonStyle: CSSProperties = { minHeight: "46px", border: 0, borderRadius: "12px", background: "#22c55e", color: "#08130c", fontWeight: 900, cursor: "pointer" };
const hintStyle: CSSProperties = { color: "#94a39b", lineHeight: 1.5, margin: "14px 0 0 0" };
const emptyTextStyle: CSSProperties = { color: "#94a39b", lineHeight: 1.5 };
const infoGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" };
const infoGridCompactStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" };
const infoItemStyle: CSSProperties = { background: "#101714", border: "1px solid #27312d", borderRadius: "12px", padding: "12px" };
const infoLabelStyle: CSSProperties = { fontSize: "12px", color: "#94a39b", marginBottom: "6px" };
const infoValueStyle: CSSProperties = { fontSize: "14px", color: "#e7f1eb", wordBreak: "break-word" };
const cardGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" };
const inventoryCardStyle: CSSProperties = { background: "#101714", border: "1px solid #27312d", borderRadius: "16px", padding: "14px" };
const cardTopRowStyle: CSSProperties = { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "12px" };
const cardNameStyle: CSSProperties = { color: "#e7f1eb", fontSize: "16px", wordBreak: "break-word" };
const rarityBadgeStyle: CSSProperties = { display: "inline-flex", padding: "6px 9px", borderRadius: "999px", background: "#172554", color: "#93c5fd", fontSize: "12px", fontWeight: 800, whiteSpace: "nowrap" };
const twoInputGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" };
const selectedCardBoxStyle: CSSProperties = { minHeight: "48px", display: "flex", alignItems: "center", borderRadius: "12px", border: "1px solid #27312d", background: "#0f1512", padding: "10px 12px" };
const selectedCardRowStyle: CSSProperties = { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" };
const selectedCardNameStyle: CSSProperties = { color: "#e7f1eb", fontWeight: 800 };
const secondaryButtonStyle: CSSProperties = { minHeight: "46px", padding: "10px 14px", border: "1px solid #2f5f45", borderRadius: "12px", background: "#12351e", color: "#b9ffbc", fontWeight: 900, cursor: "pointer" };
const checkRowStyle: CSSProperties = { display: "flex", alignItems: "center", gap: "9px", minHeight: "42px", color: "#cfe0d6", fontWeight: 800, cursor: "pointer" };
const catalogFilterStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "12px", alignItems: "end", marginBottom: "16px" };
const visualCardGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(205px, 1fr))", gap: "15px" };
const visualCardStyle: CSSProperties = { background: "linear-gradient(180deg, #17211c 0%, #0d1410 100%)", borderRadius: "17px", overflow: "hidden", minWidth: 0 };
const catalogCardButtonStyle: CSSProperties = { ...visualCardStyle, padding: 0, textAlign: "left", cursor: "pointer", transition: "transform 140ms ease, box-shadow 140ms ease", position: "relative" };
const cardImageWrapStyle: CSSProperties = { position: "relative", height: "230px", background: "#0b0f0d", overflow: "hidden" };
const cardImageStyle: CSSProperties = { width: "100%", height: "100%", objectFit: "cover", display: "block" };
const cardImagePlaceholderStyle: CSSProperties = { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#7b8a81", fontWeight: 900, letterSpacing: "0.1em", background: "radial-gradient(circle at 50% 25%, #1c2c23, #0b0f0d 65%)" };
const cardBodyStyle: CSSProperties = { display: "grid", gap: "7px", padding: "12px" };
const cardNameVisualStyle: CSSProperties = { color: "#f4faf6", fontSize: "15px", lineHeight: 1.2, wordBreak: "break-word" };
const cardMetaStyle: CSSProperties = { color: "#a7b8ad", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
const conditionHeaderStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", color: "#cfe0d6", fontSize: "12px", marginTop: "2px" };
const conditionTrackStyle: CSSProperties = { width: "100%", height: "7px", borderRadius: "99px", background: "#27312d", overflow: "hidden" };
const conditionFillStyle: CSSProperties = { height: "100%", borderRadius: "99px" };
const cardDateStyle: CSSProperties = { color: "#708078", fontSize: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const specialBadgeStyle: CSSProperties = { position: "absolute", top: "10px", left: "10px", padding: "6px 8px", borderRadius: "999px", background: "#402015", border: "1px solid #fb923c", color: "#fed7aa", fontSize: "10px", fontWeight: 900, zIndex: 2 };
const inventoryActionRowStyle: CSSProperties = { display: "grid", padding: "0 12px 12px" };
const deleteCardButtonStyle: CSSProperties = { minHeight: "42px", borderRadius: "11px", border: "1px solid #991b1b", background: "#3a1515", color: "#fecaca", fontWeight: 900, cursor: "pointer" };
const marketRepairButtonStyle: CSSProperties = { minHeight: "42px", borderRadius: "11px", border: "1px solid #a16207", background: "#3d2b0d", color: "#fde68a", fontWeight: 900, cursor: "pointer" };
const marketNeutralBoxStyle: CSSProperties = { margin: "0 12px 12px", padding: "9px 10px", borderRadius: "10px", background: "#101714", color: "#94a39b", fontSize: "12px", fontWeight: 700 };
const marketActiveBoxStyle: CSSProperties = { display: "grid", gap: "4px", margin: "0 12px 12px", padding: "10px", borderRadius: "10px", border: "1px solid #a16207", background: "#33230b", color: "#fde68a" };
const marketErrorBoxStyle: CSSProperties = { display: "grid", gap: "4px", margin: "0 12px 12px", padding: "10px", borderRadius: "10px", border: "1px solid #991b1b", background: "#381515", color: "#fecaca" };
const marketTitleStyle: CSSProperties = { fontSize: "12px", fontWeight: 900 };
const marketTextStyle: CSSProperties = { fontSize: "11px", lineHeight: 1.35 };
const rawBoxStyle: CSSProperties = { background: "#0b0f0d", border: "1px solid #27312d", borderRadius: "14px", padding: "14px", color: "#cfe0d6", whiteSpace: "pre-wrap", overflowX: "auto" };
