import type { CSSProperties } from "react";
import Link from "next/link";

export default function PrivacyPageEn() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={heroStyle}>
          <span style={eyebrowStyle}>Privacy</span>
          <h1 style={titleStyle}>Privacy Policy</h1>
          <p style={subtitleStyle}>For the Cardletics website and mobile app.</p>
          <p style={metaStyle}>Last updated: 21 September 2026</p>
          <div style={heroActionsStyle}>
            <Link href="/" style={backButtonStyle}>Back to homepage</Link>
            <Link href="/delete/en" style={secondaryButtonStyle}>Delete account</Link>
            <Link href="/datenschutz" style={secondaryButtonStyle}>Deutsch</Link>
          </div>
        </div>

        <Section title="1. Controller">
          <p>The controller within the meaning of the General Data Protection Regulation (GDPR) is:</p>
          <p style={addressStyle}>
            <strong>Sascha Leineweber – Cardletics</strong><br />
            Freelancer<br />
            Oppenheimer Str. 26<br />
            55130 Mainz<br />
            Germany<br />
            Email: datenschutz@cardletics.com
          </p>
        </Section>

        <Section title="2. Scope">
          <p>This Privacy Policy applies to the website at <strong> www.cardletics.com</strong> and to the mobile app <strong> Cardletics</strong>.</p>
          <p>It explains which personal data we process, for which purposes, on which legal basis, and which rights are available to you.</p>
        </Section>

        <Section title="3. Data we process">
          <p>Depending on how you use Cardletics, we may process in particular the following data:</p>
          <ul style={listStyle}>
            <li><strong>Account data:</strong> email address, username, internal user ID, registration time, login method (for example email, Apple or Google), authentication status and technical account data.</li>
            <li><strong>Profile data:</strong> avatar or profile picture, selected background, username, Cardletics-internal progress values, Card Points, Coins, showcase card, marketplace-related status data, friend/visibility settings and a coarse two-letter country code derived from the device region setting (for example DE). This country code is not derived from GPS or IP location data.</li>
            <li><strong>Game and inventory data:</strong> cards, card condition, card series, rarities, pack and Boost Pack data, activity, promo and set stamps including gameplay-related metadata stored for a stamp, backgrounds, inventory status, trading status, internal price information, transaction and progress data.</li>
            <li><strong>Administrative correction and support data:</strong> if authorised administrators review, rebuild, set or remove card stamps for troubleshooting or in response to a support request, a change log may be stored containing the affected card or inventory ID, type of correction, previous and new stamp status, time, internal administrator ID and an optional note. This log is used for traceability, security and troubleshooting.</li>
            <li><strong>Social, friends and communication data:</strong> friend requests, friends lists, chat messages, groups, group memberships, friendly battles, general matchmaking, leaderboards, online/offline status, times of messages and interactions, and visibility settings.</li>
            <li><strong>Nearby and location data:</strong> if you enable the Nearby/Radar feature, location data may be processed in order to show players near you. Depending on your settings, other users may see your username, avatar, online status and an approximate distance or proximity. Display takes place only within the app feature and according to your chosen visibility settings.</li>
            <li><strong>Health and movement data:</strong> if you explicitly consent and grant the required system permissions, Cardletics may read step counts and supported workout and distance data from Apple Health/HealthKit or Android Health Connect. Depending on the data available in the respective system, outdoor cycling, swimming, rowing and other workouts may be taken into account for gameplay. Walking, running and comparable activities may deliberately not be counted as an additional separate workout category for individual game mechanics. The data are used exclusively for movement-related game, progress and reward features of Cardletics.</li>
            <li><strong>Data from fitness and health platforms:</strong> Cardletics currently accesses the operating-system health platforms Apple Health/HealthKit and Android Health Connect. Cardletics does not connect directly to services such as Strava, Garmin, Fitbit, Samsung Health, Google Fit or similar fitness services. If those services provide data to Apple Health or Health Connect and the data are made available there to Cardletics, they may indirectly be part of the data read by Cardletics.</li>
            <li><strong>Subscription and purchase data:</strong> subscription model (Free, Club or Master), status, term, purchase history, Coin purchases, Coin usage and technical confirmation data from the respective app-store platform.</li>
            <li><strong>Marketplace data:</strong> internal listings, bids, sales, purchases, fees, buyer/seller assignments and related timestamps.</li>
            <li><strong>Affiliate and referral data:</strong> internal attribution and evaluation data for referrals and partner programmes.</li>
            <li><strong>Support and communication data:</strong> name, email address, subject and message when you contact us, as well as the related email communication.</li>
            <li><strong>Technical data:</strong> IP address, device and app information, browser data, operating system, access times, server logs, error data and security data.</li>
            <li><strong>Notification information:</strong> information required to display local notifications on your device and manage the related permission. In the current app version, Cardletics does not use its own server-side push delivery for this purpose.</li>
          </ul>
        </Section>

        <Section title="4. Purposes of processing">
          <p>We process personal data in particular for the following purposes:</p>
          <ul style={listStyle}>
            <li>providing the website and app,</li>
            <li>creating and managing user accounts,</li>
            <li>providing game functions and in-app features,</li>
            <li>managing inventory, cards, backgrounds, packs and showcases,</li>
            <li>calculating movement progress, goals, Daily Packs, activity stamps and rewards,</li>
            <li>providing the Nearby/Radar feature and showing nearby players,</li>
            <li>providing friends features, chats, groups, friendly battles, general matchmaking and leaderboards,</li>
            <li>processing Coin purchases, in-app purchases and subscriptions,</li>
            <li>providing and securing the internal marketplace,</li>
            <li>internal attribution of referral and affiliate activity,</li>
            <li>displaying game-related notices and reminders through local notifications,</li>
            <li>handling support and contact requests,</li>
            <li>troubleshooting, system security and abuse prevention,</li>
            <li>traceable administrative corrections to card and stamp data in support cases,</li>
            <li>complying with statutory retention and documentation obligations.</li>
          </ul>
        </Section>

        <Section title="5. Legal bases">
          <p>We process personal data on the following legal bases:</p>
          <ul style={listStyle}>
            <li><strong>Article 6(1)(b) GDPR</strong>, where processing is necessary for the performance of a contract or to take steps prior to entering into a contract, in particular for user accounts, app features, game progress, inventory management, Coin functions, marketplace, showcases, friends, chats, groups, support and paid services.</li>
            <li><strong>Article 6(1)(c) GDPR</strong>, where we are subject to legal obligations, in particular tax and commercial retention obligations.</li>
            <li><strong>Article 6(1)(f) GDPR</strong>, where we process data on the basis of legitimate interests, for example system security, troubleshooting, abuse prevention, internal administration and improving service stability.</li>
            <li><strong>Article 6(1)(a) GDPR</strong> for processing based on consent, in particular optional features such as notifications, location sharing, fitness/health integration or optional profile and visibility functions.</li>
            <li><strong>Article 9(2)(a) GDPR</strong> for health and movement data based on your explicit consent.</li>
          </ul>
        </Section>

        <Section title="6. Health, movement and fitness data">
          <p>Use of health and movement data is voluntary. Cardletics processes such data only after you have explicitly consented and granted the required permissions on your device.</p>
          <p>On iOS, Cardletics reads — where you have permitted access and the data are available — in particular steps, swimming distance and workout data from Apple Health/HealthKit. On Android, Cardletics reads in particular steps and supported workout and distance data via Health Connect. Recorded workouts can therefore include outdoor cycling, swimming, rowing and other workouts. Cardletics does not connect directly to the respective sports watch; what matters is that the data are available in Apple Health or Health Connect and accessible to Cardletics. On Android, the Health Connect library currently used may technically read total calorie values as additional workout data. Cardletics does not currently use these values for game calculations and does not store them as a separate Cardletics gameplay value in the database.</p>
          <p>The data are used in particular for progress displays, daily challenges, unlocking Daily Packs and activity stamps on newly generated Daily Pack cards. An activity stamp can be Bronze, Silver or Gold and depends on the number of different qualifying activity categories on the underlying day. Such a stamp can also apply an in-game battle bonus to the respective card: Bronze increases the battle strength calculated from rarity and card condition by 3%, Silver by 6% and Gold by 10%.</p>
          <p>Gameplay-related daily values such as steps, cycling, rowing or swimming distance, workout minutes, the activity date and — if the location/Radar feature was already enabled and a place name was available for that day — a coarse place name such as “Mainz” may be stored for an activity stamp. These daily values and derived Cardletics values may be transmitted to the Cardletics backend and stored in association with your account. Exact coordinates, street or house number are not stored in the card’s stamp metadata.</p>
          <p><strong>Sharing health and movement data is not required for the basic use of Cardletics.</strong>{" "}If you do not consent or do not grant system permission, you can continue to use Cardletics in a limited mode. Features, progress or rewards that require movement data may then be unavailable or limited.</p>
          <p>Without your consent, Cardletics does not access the health and movement data intended for Cardletics. Fitness-data use can later be enabled again in Cardletics. Individual permissions that were not previously granted or were later changed can also be adjusted in Apple Health or in the Health Connect/system settings of your device.</p>
          <p>You can withdraw consent at any time with effect for the future in Cardletics. You can also change or revoke the relevant access rights in your operating-system settings. After withdrawal, Cardletics no longer accesses new health and movement data until you consent again.</p>
          <p>Game or progress data previously generated during use may remain part of your Cardletics account until they are deleted or your account is deleted, unless statutory obligations prevent deletion.</p>
          <p>Cardletics is not a medical device and does not replace medical advice. Health and movement data are used exclusively for game, motivation and progress features.</p>
        </Section>

        <Section title="7. Nearby, Radar and location data">
          <p>The app includes an optional Nearby/Radar feature. It is disabled by default. If you enable this feature and allow location access, Cardletics processes your location to show you nearby players and — depending on your settings — to allow other users to see your approximate proximity or presence. While the Radar screen is open and the feature is active, the location may be determined again and transmitted to the Cardletics backend approximately every 45 seconds.</p>
          <p>Depending on your settings, other users may see:</p>
          <ul style={listStyle}>
            <li>username and avatar/profile picture,</li>
            <li>online status or last active status,</li>
            <li>approximate distance or proximity,</li>
            <li>friendship status or interaction options.</li>
          </ul>
          <p>The Nearby/Radar feature is optional. You can disable visibility and location access at any time. When Radar is disabled, Radar visibility ends and Cardletics no longer uses your location for active nearby visibility. The most recently stored precise coordinates and the timestamp of the location update may technically remain stored in the Cardletics presence row until they are overwritten by a later location update or removed when your user account is deleted. Technical security or server logs of the infrastructure used may remain independently in accordance with the respective technical retention periods. Cardletics does not publish an exact address as a public user profile.</p>
          <p>If you have already enabled the Radar/location feature, Cardletics may additionally derive a coarse place name such as “Mainz” from the existing location processing. Such a coarse place name may be stored for an activity stamp generated on the same activity date. The exact coordinates of the Radar feature are not copied into card or stamp metadata for this purpose.</p>
        </Section>

        <Section title="8. Friends, chat, groups and profile visibility">
          <p>Cardletics includes social features such as friend requests, friends lists, chats, groups, friendly battles, general matchmaking and leaderboards. To provide these functions, we process the necessary data, in particular user IDs, usernames, profile pictures, message content, timestamps, group memberships and interaction status.</p>
          <p>Within the app, you can determine which profile information should be visible to friends, for example Coins, subscription status, awards, registration time or card stamps, where those options are offered. Messages and group content are not public, but are intended only for the users or group members involved. For administration, security, abuse prevention or support, internally authorised persons may access the data required for those purposes.</p>
        </Section>

        <Section title="9. Notifications">
          <p>Cardletics may display local notifications on your device, for example game-related reminders or notices.</p>
          <p>Cardletics may request the operating system’s notification permission. You can disable that permission at any time in your device settings.</p>
          <p>In the current app version, Cardletics does not use server-side push delivery for this function and does not store its own push token for delivery via a Cardletics push service. If server-side push notifications are introduced in the future, this Privacy Policy will be updated accordingly.</p>
        </Section>

        <Section title="10. User account and login">
          <p>Users can create an account. Login is currently available by email and — where offered — via Apple and Google.</p>
          <p>As part of the user account, we process the data necessary for authentication, account management and providing the functions. Certain profile information such as username, avatar, online status, friendship status or nearby visibility may be shown to other users in the app where this is required for the relevant function or enabled by you.</p>
        </Section>

        <Section title="11. Coins, purchases, subscriptions and marketplace">
          <p>Cardletics uses a virtual currency in the form of Coins. Coins can be obtained through in-app purchases. Subscriptions may also be offered.</p>
          <p>The following subscription models may be processed:</p>
          <ul style={listStyle}><li>Free</li><li>Club</li><li>Master</li></ul>
          <p>Purchase and billing information is processed to attribute purchases, provide entitlements, document payments and comply with legal obligations. Payment processing and subscription management are handled through the respective app-store platform or the payment service used there.</p>
          <p>The marketplace is visible only internally within the platform. Marketplace data are processed in order to provide and secure listings, bids, purchases, sales, fees, assignments and records within Cardletics.</p>
        </Section>

        <Section title="12. Contact form and support">
          <p>If you contact us — in particular via a contact form or by email — we process the data you provide, in particular your name, email address, subject and message, in order to handle your request.</p>
          <p>Support is currently provided by email at <strong> support@cardletics.com</strong>.</p>
          <p>You can delete your user account directly in the Cardletics app under <strong>Settings → Delete account</strong>. The technical account-deletion process is triggered immediately there. Alternatively, you can use the <Link href="/delete/en"> /delete page</Link> or contact <strong> support@cardletics.com</strong>.</p>
        </Section>

        <Section title="13. Hosting, infrastructure and services used">
          <p>Our website is provided through <strong>Vercel</strong>. We use <strong>Supabase</strong> for backend functions, in particular authentication, database, storage, realtime and Edge Functions.</p>
          <p>Through Supabase, user accounts, database entries, chat and group data, location/presence data, images and other files may be processed.</p>
          <p>We use <strong>IONOS</strong> for email mailboxes and processing incoming messages. We use <strong>Resend</strong> for transactional system emails, in particular account and password-reset messages. This may include the email address, message content, subject, send time and technical delivery information.</p>
          <p>The website currently loads country flags in the language menu via <strong>FlagCDN (flagcdn.com)</strong>. When these graphics are retrieved, the provider may technically receive in particular the IP address of the requesting device.</p>
          <p>Technical server and security logs may be generated as part of operating the services.</p>
        </Section>

        <Section title="14. Recipients, platforms and data sources">
          <p>Personal data are disclosed to third parties only where necessary for the purposes described, required by law or covered by valid consent.</p>
          <p>This may include in particular:</p>
          <ul style={listStyle}>
            <li>Vercel as hosting provider,</li>
            <li>Supabase as backend, database, realtime and storage provider,</li>
            <li>IONOS for email mailboxes and email communication,</li>
            <li>Resend for transactional account and password emails,</li>
            <li>FlagCDN for country flags in the website language menu,</li>
            <li>Apple App Store for iOS in-app purchases and subscriptions,</li>
            <li>Google Play Billing for Android in-app purchases and subscriptions,</li>
            <li>Apple Health/HealthKit as an iOS system data source where you explicitly permit access,</li>
            <li>Android Health Connect as an Android system data source where you explicitly permit access,</li>
            <li>fitness services such as Strava, Garmin, Fitbit, Samsung Health, Google Fit or similar services are currently not connected directly to Cardletics. Data from such services can reach Cardletics only indirectly if they have first been transferred to Apple Health or Health Connect and are made available there to Cardletics,</li>
            <li>tax advisers where necessary for proper accounting and legal obligations.</li>
          </ul>
          <p>An internal administration area exists. Access is limited to internally authorised persons where required for administration, troubleshooting, abuse prevention, billing or support. Administrative corrections to card stamps are logged for traceability and security.</p>
        </Section>

        <Section title="15. International data processing">
          <p>The app can be used by users in different countries. Individual service providers, platforms or app-store providers may also process data outside the EU or European Economic Area.</p>
          <p>Where data are processed in third countries, this is done only in accordance with the applicable legal requirements, in particular on the basis of appropriate safeguards such as adequacy decisions, standard contractual clauses or comparable mechanisms where required.</p>
        </Section>

        <Section title="16. Retention periods">
          <p>We generally store personal data only for as long as necessary for the respective processing purpose or as required by statutory retention obligations.</p>
          <p>User-account, profile, game and inventory data are generally stored for the duration of the user account. When the user account is deleted, personal data are deleted or anonymised unless they must continue to be retained due to legal obligations or for the establishment, exercise or defence of legal claims.</p>
          <p>Friends, group, chat and other social data are generally stored for as long as required for the relevant function and user account. Individual content may be deleted earlier where corresponding deletion functions are provided.</p>
          <p>Location data from the Nearby/Radar feature are processed where required for the feature. When Radar is disabled, active Radar visibility ends. The most recently stored precise coordinates and the timestamp of the location update may technically remain stored in the Cardletics presence row until they are overwritten by a later location update or removed when the user account is deleted. Independently, technically necessary server or security logs may remain in accordance with the retention periods of the infrastructure and platform providers used.</p>
          <p>After consent is withdrawn, Cardletics no longer accesses new health and movement data. Game and progress data already created or stored from such data — including activity stamps already awarded and the gameplay-related daily metadata stored with them — may remain stored until they are deleted or the user account is deleted, where continued storage is permitted.</p>
          <p>Purchase, payment and billing data are stored for as long as necessary for contract processing and due to tax, commercial or other statutory retention obligations.</p>
          <p>Administrative correction logs relating to cards and stamps are stored only for as long as necessary for traceability, support, system security or defence against abuse. If the affected card or associated user account is deleted, related correction logs are also removed in accordance with the technical database relationships unless legal reasons require otherwise.</p>
          <p>Technical server, security and error data are stored only for as long as necessary for operation, security, troubleshooting or abuse prevention. Where such data are processed by infrastructure or platform providers, their technical retention periods may also apply.</p>
        </Section>

        <Section title="17. Children and minors">
          <p>Cardletics can also be used by young people. Where consent is required for specific processing, minors must meet the applicable legal requirements. In Germany, consent for information-society services may generally be given independently from the age of 16; below that age, consent from a parent or guardian may be required.</p>
          <p>For paid features, in particular in-app purchases and subscriptions, the rules of the payment or platform provider and, where applicable, the consent of parents or guardians must be observed.</p>
        </Section>

        <Section title="18. Cookies and similar technologies">
          <p>Under our current setup, we do not use analytics or marketing tools on the website. The selected website language may be stored locally in the browser using Local Storage so that the choice is retained on the next visit. This storage is not used for advertising or user tracking.</p>
          <p>Where technically necessary cookies or similar technologies are used beyond this, they are used to provide, secure and operate the website.</p>
          <p>If additional cookies or similar technologies are introduced in the future, in particular for analytics, reach measurement or marketing, we will update this Privacy Policy and, where required, our consent processes accordingly.</p>
        </Section>

        <Section title="19. App-store privacy disclosures">
          <p>Additional privacy disclosures may be required for publication in app stores, in particular Google Play and the Apple App Store. These disclosures must be consistent with this Privacy Policy and the actual data processing in the app.</p>
          <p>In particular, disclosures concerning health/fitness data, workout and distance data, location/Radar, coarse place names, social features, marketplace functions and purchases must reflect the version of the app actually published. If these functions change, the corresponding app-store privacy disclosures will also be updated.</p>
        </Section>

        <Section title="20. Data-subject rights">
          <p>Subject to the applicable statutory requirements, you have in particular the right to:</p>
          <ul style={listStyle}>
            <li>request access to your stored data,</li>
            <li>have inaccurate data corrected,</li>
            <li>request deletion of your data,</li>
            <li>request restriction of processing,</li>
            <li>object to processing,</li>
            <li>request data portability where applicable,</li>
            <li>withdraw consent at any time with effect for the future.</li>
          </ul>
          <p>You can delete your user account directly in the Cardletics app under <strong>Settings → Delete account</strong>. Alternatively, you can use the <Link href="/delete/en"> /delete page</Link> or contact <strong> support@cardletics.com</strong>.</p>
          <p>You also have the right to lodge a complaint with a competent data-protection supervisory authority.</p>
        </Section>

        <Section title="21. Data security">
          <p>We take technical and organisational measures to protect personal data against loss, misuse, unauthorised access, unauthorised disclosure and unlawful alteration.</p>
        </Section>

        <Section title="22. Changes to this Privacy Policy">
          <p>We may amend this Privacy Policy if legal, technical or organisational changes occur or if new functions, services or processes are introduced.</p>
        </Section>

        <Section title="23. Privacy contact">
          <p>If you have questions about privacy or exercising your rights, you can contact us at any time:</p>
          <p style={addressStyle}>
            <strong>Sascha Leineweber – Cardletics</strong><br />
            Oppenheimer Str. 26<br />
            55130 Mainz<br />
            Germany<br />
            Email: datenschutz@cardletics.com
          </p>
        </Section>
      </div>
      <PageFooter />
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitleStyle}>{title}</h2>
      <div style={sectionContentStyle}>{children}</div>
    </section>
  );
}

function PageFooter() {
  return (
    <footer style={footerStyle}>
      <div style={footerBrandStyle}>
        <strong>Cardletics</strong>
        <span>Track • Collect • Battle • Trade</span>
      </div>
      <nav style={footerLinksStyle}>
        <Link href="/impressum" style={footerLinkStyle}>Legal notice</Link>
        <Link href="/datenschutz/en" style={footerLinkStyle}>Privacy</Link>
        <Link href="/agb" style={footerLinkStyle}>Terms</Link>
        <Link href="/kontakt" style={footerLinkStyle}>Contact</Link>
        <Link href="/delete/en" style={footerLinkStyle}>Delete account</Link>
        <Link href="/datenschutz" style={footerLinkStyle}>Deutsch</Link>
      </nav>
    </footer>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #07150f 0%, #0d1d16 100%)",
  padding: "32px 16px 64px",
  color: "#eaf6ee",
};

const containerStyle: CSSProperties = {
  maxWidth: "980px",
  margin: "0 auto",
};

const heroStyle: CSSProperties = {
  background: "linear-gradient(135deg, #14532d 0%, #0f172a 100%)",
  border: "1px solid #2f5f45",
  borderRadius: "24px",
  padding: "28px 24px",
  boxShadow: "0 14px 40px rgba(0,0,0,0.28)",
  marginBottom: "24px",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "rgba(34,197,94,0.12)",
  color: "#bbf7d0",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.03em",
  marginBottom: "12px",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "38px",
  lineHeight: 1.08,
  color: "#ffffff",
};

const subtitleStyle: CSSProperties = {
  marginTop: "12px",
  marginBottom: "8px",
  color: "#d7f5df",
  fontSize: "16px",
  lineHeight: 1.6,
};

const metaStyle: CSSProperties = {
  margin: 0,
  color: "#9fceb0",
  fontSize: "14px",
};

const heroActionsStyle: CSSProperties = {
  marginTop: "18px",
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

const backButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "44px",
  padding: "10px 14px",
  borderRadius: "12px",
  background: "#22c55e",
  color: "#08130c",
  fontWeight: 700,
  textDecoration: "none",
};

const secondaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "44px",
  padding: "10px 14px",
  borderRadius: "12px",
  background: "transparent",
  color: "#bbf7d0",
  border: "1px solid #2f5f45",
  fontWeight: 700,
  textDecoration: "none",
};

const sectionStyle: CSSProperties = {
  background: "#171f1c",
  borderRadius: "18px",
  padding: "22px 20px",
  border: "1px solid #27312d",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
  marginBottom: "18px",
};

const sectionTitleStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: "14px",
  fontSize: "22px",
  color: "#e7f1eb",
};

const sectionContentStyle: CSSProperties = {
  color: "#d9e7de",
  lineHeight: 1.75,
  fontSize: "15px",
};

const listStyle: CSSProperties = {
  paddingLeft: "20px",
  marginTop: "10px",
  marginBottom: 0,
};

const addressStyle: CSSProperties = {
  background: "#101714",
  border: "1px solid #27312d",
  borderRadius: "14px",
  padding: "14px",
};


const footerStyle: CSSProperties = {
  maxWidth: "980px",
  margin: "24px auto 0 auto",
  padding: "18px",
  borderRadius: "20px",
  background: "#111714",
  border: "1px solid #27312d",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap",
};

const footerBrandStyle: CSSProperties = {
  display: "grid",
  gap: "4px",
  color: "#ffffff",
};

const footerLinksStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const footerLinkStyle: CSSProperties = {
  color: "#86efac",
  textDecoration: "none",
  fontWeight: 800,
  padding: "8px 10px",
  borderRadius: "999px",
  background: "rgba(34,197,94,0.08)",
  border: "1px solid rgba(134,239,172,0.18)",
};
