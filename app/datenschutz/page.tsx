import type { CSSProperties } from "react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={heroStyle}>
          <span style={eyebrowStyle}>Datenschutz</span>
          <h1 style={titleStyle}>Datenschutzerklärung</h1>
          <p style={subtitleStyle}>Für die Website und die App Cardletics.</p>
          <p style={metaStyle}>Stand: 29.08.2026</p>
          <div style={heroActionsStyle}>
            <Link href="/" style={backButtonStyle}>
              Zurück zur Startseite
            </Link>
            <Link href="/konto-loeschen" style={secondaryButtonStyle}>
              Konto löschen
            </Link>
          </div>
        </div>

        <Section title="1. Verantwortlicher">
          <p>
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO)
            ist:
          </p>
          <p style={addressStyle}>
            <strong>Sascha Leineweber – Cardletics</strong>
            <br />
            Freiberufler
            <br />
            Oppenheimer Str. 26
            <br />
            55130 Mainz
            <br />
            Deutschland
            <br />
            E-Mail: info@cardletics.com
          </p>
        </Section>

        <Section title="2. Geltungsbereich">
          <p>
            Diese Datenschutzerklärung gilt für die Website unter
            <strong> www.cardletics.com</strong> sowie für die mobile App
            <strong> Cardletics</strong>.
          </p>
          <p>
            Sie informiert darüber, welche personenbezogenen Daten wir
            verarbeiten, zu welchen Zwecken dies geschieht, auf welcher
            Rechtsgrundlage dies erfolgt und welche Rechte dir zustehen.
          </p>
        </Section>

        <Section title="3. Welche Daten wir verarbeiten">
          <p>Je nach Nutzung verarbeiten wir insbesondere folgende Daten:</p>
          <ul style={listStyle}>
            <li>
              <strong>Kontodaten:</strong> E-Mail-Adresse, Benutzername,
              interne User-ID, Registrierungszeitpunkt, Login-Methode
              (z. B. E-Mail, Apple oder Google), Authentifizierungsstatus und
              technische Kontodaten.
            </li>
            <li>
              <strong>Profildaten:</strong> Avatar bzw. Profilbild,
              ausgewählter Hintergrund, Nutzername, Cardletics-interne
              Fortschrittswerte, Card Points, Coins, Ausstellungskarte,
              Marketplace-bezogene Statusdaten, Freundes-/Sichtbarkeits-
              Einstellungen und sonstige nutzerbezogene In-App-Einstellungen.
            </li>
            <li>
              <strong>Spiel- und Inventardaten:</strong> Karten, Kartenzustand,
              Kartenserien, Raritäten, Pack- und Boost-Pack-Daten,
              Hintergründe, Inventarstatus, Handelsstatus, interne
              Preisangaben, Transaktions- und Fortschrittsdaten.
            </li>
            <li>
              <strong>Social-, Freunde- und Kommunikationsdaten:</strong>
              Freundschaftsanfragen, Freundeslisten, Chatnachrichten,
              Gruppen, Gruppenzugehörigkeiten, Freundschaftskämpfe,
              Online-/Offline-Status, Zeitpunkte von Nachrichten und
              Interaktionen sowie Sichtbarkeitseinstellungen.
            </li>
            <li>
              <strong>Umgebungs- und Standortdaten:</strong> sofern du die
              Umgebung-/Radar-Funktion aktivierst, können Standortdaten
              verarbeitet werden, um Spieler in deiner Nähe anzuzeigen. Je nach
              Einstellung können anderen Nutzern dein Nutzername, Avatar,
              Online-Status und eine ungefähre Nähe bzw. Entfernung angezeigt
              werden. Die Anzeige erfolgt nur im Rahmen der App-Funktion und
              deiner gewählten Sichtbarkeitseinstellungen.
            </li>
            <li>
              <strong>Gesundheits- und Bewegungsdaten:</strong> Wenn du ausdrücklich
              einwilligst und die erforderlichen Systemberechtigungen erteilst,
              kann Cardletics Bewegungsdaten verarbeiten. Unter Android werden
              derzeit insbesondere Schrittzahlen verwendet. Unter iOS können
              insbesondere Schrittzahlen, Schwimmdistanzen und Workout-Daten
              verarbeitet werden. Aus Workout-Daten können je nach in Apple
              Health vorhandener Aktivitätsart auch bewegungsbezogene
              Informationen, beispielsweise zu Fahrradaktivitäten, abgeleitet
              werden. Die Daten werden ausschließlich für bewegungsbezogene
              Spiel-, Fortschritts- und Belohnungsfunktionen von Cardletics
              verwendet.
            </li>
            <li>
              <strong>Daten aus Fitness- und Gesundheitsplattformen:</strong>
              Cardletics greift derzeit auf die vom Betriebssystem
              bereitgestellten Gesundheitsplattformen Apple Health/HealthKit bzw.
              Android Health Connect zu. Cardletics stellt keine direkte
              Verbindung zu Diensten wie Strava, Garmin, Fitbit, Samsung Health,
              Google Fit oder vergleichbaren Fitnessdiensten her. Soweit solche
              Dienste Daten in Apple Health oder Health Connect bereitstellen und
              diese Daten dort für Cardletics freigegeben sind, können sie
              indirekt Bestandteil der von Cardletics gelesenen Daten sein.
            </li>
            <li>
              <strong>Abonnement- und Kaufdaten:</strong> Abo-Modell
              (Kostenlos, Basic, Pro, Elite, Master), Status, Laufzeit,
              Kaufhistorien, Coin-Käufe, Coin-Verbrauch und technische
              Bestätigungsdaten der jeweiligen App-Store-Plattform.
            </li>
            <li>
              <strong>Marketplace-Daten:</strong> interne Angebote, Gebote,
              Verkäufe, Käufe, Gebühren, Käufer-/Verkäufer-Zuordnungen und
              zugehörige Zeitpunkte.
            </li>
            <li>
              <strong>Affiliate- und Referral-Daten:</strong> interne
              Zuordnungs- und Auswertungsdaten für Empfehlungen und
              Partnerprogramme.
            </li>
            <li>
              <strong>Support- und Kommunikationsdaten:</strong> Name,
              E-Mail-Adresse, Betreff und Nachricht bei Kontaktanfragen sowie
              die zugehörige Kommunikation per E-Mail.
            </li>
            <li>
              <strong>Technische Daten:</strong> IP-Adresse, Geräte- und
              App-Informationen, Browserdaten, Betriebssystem, Zeitpunkte von
              Zugriffen, Server-Logdaten, Fehler- und Sicherheitsdaten.
            </li>
            <li>
              <strong>Benachrichtigungsinformationen:</strong> Informationen,
              die erforderlich sind, um lokale Benachrichtigungen auf deinem
              Gerät anzuzeigen und die zugehörige Berechtigung zu verwalten.
              In der derzeitigen App-Version verwendet Cardletics hierfür keine
              eigene serverseitige Push-Zustellung.
            </li>
          </ul>
        </Section>

        <Section title="4. Zwecke der Verarbeitung">
          <p>
            Wir verarbeiten personenbezogene Daten insbesondere zu folgenden
            Zwecken:
          </p>
          <ul style={listStyle}>
            <li>Bereitstellung von Website und App</li>
            <li>Erstellung und Verwaltung von Nutzerkonten</li>
            <li>Bereitstellung von Spielfunktionen und In-App-Features</li>
            <li>Verwaltung von Inventar, Karten, Hintergründen, Packs und Ausstellung</li>
            <li>Berechnung von Bewegungsfortschritt, Zielen, Streaks und Belohnungen</li>
            <li>Bereitstellung der Umgebung-/Radar-Funktion und Anzeige naher Spieler</li>
            <li>Bereitstellung von Freundesfunktionen, Chats, Gruppen und Freundschaftskämpfen</li>
            <li>Abwicklung von Coin-Käufen, In-App-Käufen und Abonnements</li>
            <li>Bereitstellung und Absicherung des internen Marketplaces</li>
            <li>Interne Zuordnung von Referral- und Affiliate-Vorgängen</li>
            <li>Anzeige von spielbezogenen Hinweisen und Erinnerungen durch lokale Benachrichtigungen</li>
            <li>Bearbeitung von Support- und Kontaktanfragen</li>
            <li>Fehleranalyse, Systemsicherheit und Missbrauchsprävention</li>
            <li>Erfüllung gesetzlicher Aufbewahrungs- und Nachweispflichten</li>
          </ul>
        </Section>

        <Section title="5. Rechtsgrundlagen der Verarbeitung">
          <p>
            Wir verarbeiten personenbezogene Daten auf Grundlage der folgenden
            Rechtsgrundlagen:
          </p>
          <ul style={listStyle}>
            <li>
              <strong>Art. 6 Abs. 1 lit. b DSGVO</strong>, soweit die
              Verarbeitung für die Erfüllung eines Vertrags oder zur
              Durchführung vorvertraglicher Maßnahmen erforderlich ist,
              insbesondere für Nutzerkonto, App-Funktionen, Spielfortschritt,
              Inventarverwaltung, Coin-Funktionen, Marketplace, Ausstellung,
              Freunde, Chats, Gruppen, Support und die Bereitstellung bezahlter
              Leistungen.
            </li>
            <li>
              <strong>Art. 6 Abs. 1 lit. c DSGVO</strong>, soweit wir
              gesetzlichen Verpflichtungen unterliegen, insbesondere steuer- und
              handelsrechtlichen Aufbewahrungspflichten.
            </li>
            <li>
              <strong>Art. 6 Abs. 1 lit. f DSGVO</strong>, soweit wir Daten auf
              Grundlage berechtigter Interessen verarbeiten, z. B. zur
              Systemsicherheit, Fehleranalyse, Missbrauchsprävention, internen
              Administration und Verbesserung der Stabilität unserer Dienste.
            </li>
            <li>
              <strong>Art. 6 Abs. 1 lit. a DSGVO</strong> für Verarbeitungen auf
              Grundlage einer Einwilligung, insbesondere bei optionalen
              Funktionen wie Benachrichtigungen, Standortfreigabe,
              Fitness-/Health-Anbindung oder optionalen Profil- und
              Sichtbarkeitsfunktionen.
            </li>
            <li>
              <strong>Art. 9 Abs. 2 lit. a DSGVO</strong> für Gesundheits- und
              Bewegungsdaten auf Basis deiner ausdrücklichen Einwilligung.
            </li>
          </ul>
        </Section>

        <Section title="6. Gesundheits-, Bewegungs- und Fitnessdaten">
          <p>
            Die Nutzung von Gesundheits- und Bewegungsdaten ist freiwillig.
            Cardletics verarbeitet solche Daten nur, wenn du zuvor ausdrücklich
            in die Verarbeitung eingewilligt und die erforderlichen
            Berechtigungen auf deinem Gerät erteilt hast.
          </p>
          <p>
            Unter Android verwendet Cardletics derzeit insbesondere
            Schrittzahlen. Unter iOS können insbesondere Schrittzahlen,
            Schwimmdistanzen und Workout-Daten aus Apple Health verarbeitet
            werden. Je nach in Apple Health vorhandenem Workout können daraus
            auch Informationen über bestimmte Aktivitätsarten, beispielsweise
            Fahrradaktivitäten, hervorgehen.
          </p>
          <p>
            Die Daten werden insbesondere verwendet für bewegungsbezogene
            Spielfunktionen, Fortschrittsanzeigen, Ziele sowie
            bewegungsabhängige Karten, Drops und Belohnungen.
          </p>
          <p>
            <strong>
              Die Freigabe von Gesundheits- und Bewegungsdaten ist keine
              Voraussetzung für die grundsätzliche Nutzung von Cardletics.
            </strong>{" "}
            Wenn du nicht einwilligst oder keine Systemberechtigung erteilst,
            kannst du Cardletics in einem eingeschränkten Modus weiterhin
            nutzen. Funktionen, Fortschritte oder Belohnungen, die
            Bewegungsdaten voraussetzen, stehen dann nicht oder nur
            eingeschränkt zur Verfügung.
          </p>
          <p>
            Ohne deine Einwilligung greift Cardletics nicht auf die für
            Cardletics vorgesehenen Gesundheits- und Bewegungsdaten zu. Eine
            zunächst abgelehnte Freigabe kann später freiwillig in der App
            aktiviert werden.
          </p>
          <p>
            Du kannst eine erteilte Einwilligung jederzeit mit Wirkung für die
            Zukunft in Cardletics widerrufen. Zusätzlich kannst du die
            entsprechenden Zugriffsrechte in den Einstellungen deines
            Betriebssystems ändern oder entziehen. Nach einem Widerruf greift
            Cardletics nicht mehr auf neue Gesundheits- und Bewegungsdaten zu,
            solange keine erneute Einwilligung erfolgt.
          </p>
          <p>
            Bereits im Rahmen der bisherigen Nutzung erzeugte Spiel- oder
            Fortschrittsdaten können weiterhin Bestandteil deines
            Cardletics-Kontos sein, bis sie gelöscht werden oder dein Konto
            gelöscht wird, soweit keine gesetzlichen Pflichten einer Löschung
            entgegenstehen.
          </p>
          <p>
            Cardletics ist kein Medizinprodukt und ersetzt keine medizinische
            Beratung. Gesundheits- und Bewegungsdaten werden ausschließlich für
            Spiel-, Motivations- und Fortschrittsfunktionen verwendet.
          </p>
        </Section>

        <Section title="7. Umgebung, Radar und Standortdaten">
          <p>
            Die App kann eine optionale Umgebung-/Radar-Funktion enthalten. Wenn
            du diese Funktion aktivierst und Standortzugriff erlaubst,
            verarbeitet Cardletics deinen Standort, um dir Spieler in deiner
            Nähe anzuzeigen und anderen Nutzern – abhängig von deinen
            Einstellungen – deine Nähe bzw. Präsenz in der Umgebung anzeigen zu
            können.
          </p>
          <p>Je nach Einstellung können anderen Nutzern angezeigt werden:</p>
          <ul style={listStyle}>
            <li>Nutzername, Avatar bzw. Profilbild,</li>
            <li>Online-Status bzw. zuletzt aktiv,</li>
            <li>ungefähre Entfernung oder Nähe,</li>
            <li>Freundschaftsstatus oder Interaktionsmöglichkeiten.</li>
          </ul>
          <p>
            Die Umgebung-/Radar-Funktion ist optional. Du kannst die Sichtbarkeit
            sowie den Standortzugriff jederzeit deaktivieren. Bei deaktivierter
            Radar-Sichtbarkeit wirst du anderen Nutzern nicht mehr über diese
            Funktion angezeigt und Cardletics verwendet deinen Standort nicht
            mehr für die aktive Umgebungssichtbarkeit. Eine Deaktivierung der
            Radar-Funktion bewirkt jedoch nicht automatisch die Löschung bereits
            im Cardletics-System gespeicherter Standortwerte. Diese können bis zu
            ihrer Überschreibung, Löschung oder bis zur Löschung des
            Nutzerkontos gespeichert bleiben, soweit sie technisch oder für
            Sicherheits- und Nachweiszwecke noch erforderlich sind. Cardletics
            veröffentlicht keine genaue Adresse als öffentliches Nutzerprofil.
          </p>
        </Section>

        <Section title="8. Freunde, Chat, Gruppen und Profil-Sichtbarkeit">
          <p>
            Cardletics enthält Social-Funktionen wie Freundschaftsanfragen,
            Freundeslisten, Chats, Gruppen und Freundschaftskämpfe. Zur
            Bereitstellung dieser Funktionen verarbeiten wir die hierfür
            notwendigen Daten, insbesondere Nutzer-IDs, Nutzernamen,
            Profilbilder, Nachrichteninhalte, Zeitpunkte, Gruppenmitgliedschaften
            und Interaktionsstatus.
          </p>
          <p>
            Du kannst innerhalb der App festlegen, welche Profilinformationen
            für Freunde sichtbar sein sollen, z. B. Coins, Abo-Status, Awards
            oder Registrierungszeitpunkt, soweit diese Optionen angeboten
            werden. Nachrichten und Gruppeninhalte sind nicht öffentlich,
            sondern nur für die jeweils beteiligten Nutzer bzw. Gruppenmitglieder
            bestimmt. Zur Administration, Sicherheit, Missbrauchsprävention oder
            zur Bearbeitung von Supportfällen können intern berechtigte Personen
            auf erforderliche Daten zugreifen.
          </p>
        </Section>

        <Section title="9. Benachrichtigungen">
          <p>
            Cardletics kann lokale Benachrichtigungen auf deinem Gerät anzeigen,
            beispielsweise für spielbezogene Erinnerungen oder Hinweise.
          </p>
          <p>
            Für die Anzeige solcher Benachrichtigungen kann Cardletics die
            Benachrichtigungsberechtigung des Betriebssystems anfordern. Du
            kannst diese Berechtigung jederzeit in den Einstellungen deines
            Geräts deaktivieren.
          </p>
          <p>
            In der derzeitigen App-Version verwendet Cardletics für diese
            Funktion keine serverseitige Push-Zustellung und speichert hierfür
            keinen eigenen Push-Token zur Zustellung über einen
            Cardletics-Push-Dienst. Sollten zukünftig echte serverseitige
            Push-Benachrichtigungen eingeführt werden, wird diese
            Datenschutzerklärung entsprechend angepasst.
          </p>
        </Section>

        <Section title="10. Nutzerkonto und Login">
          <p>
            Nutzer können ein Konto erstellen. Die Anmeldung ist derzeit über
            E-Mail sowie – soweit angeboten – über Apple und Google möglich.
          </p>
          <p>
            Im Rahmen des Nutzerkontos verarbeiten wir die erforderlichen Daten
            zur Authentifizierung, Kontoverwaltung und Bereitstellung der
            Funktionen. Bestimmte Profilinformationen wie Nutzername, Avatar,
            Online-Status, Freundschaftsstatus oder Umgebungssichtbarkeit können
            anderen Nutzern innerhalb der App angezeigt werden, sofern dies für
            die jeweilige Funktion erforderlich ist oder von dir aktiviert wurde.
          </p>
        </Section>

        <Section title="11. Coins, Käufe, Abonnements und Marketplace">
          <p>
            Cardletics verwendet virtuelle Währung in Form von Coins. Coins
            können über In-App-Käufe bezogen werden. Außerdem können
            Abonnements angeboten werden.
          </p>
          <p>Folgende Abo-Modelle können verarbeitet werden:</p>
          <ul style={listStyle}>
            <li>Kostenlos</li>
            <li>Basic</li>
            <li>Pro</li>
            <li>Elite</li>
            <li>Master</li>
          </ul>
          <p>
            Kauf- und Abrechnungsinformationen werden verarbeitet, um Käufe
            zuzuordnen, Leistungen bereitzustellen, Zahlungen zu dokumentieren
            und gesetzliche Pflichten zu erfüllen. Zahlungsabwicklung und
            Abonnementverwaltung erfolgen über die jeweilige App-Store-Plattform
            bzw. den dort eingesetzten Zahlungsdienst.
          </p>
          <p>
            Der Marketplace ist ausschließlich intern innerhalb der Plattform
            sichtbar. Marketplace-Daten werden verarbeitet, um Angebote,
            Gebote, Käufe, Verkäufe, Gebühren, Zuordnungen und Nachweise
            innerhalb von Cardletics bereitzustellen und abzusichern.
          </p>
        </Section>

        <Section title="12. Kontaktformular und Support">
          <p>
            Wenn du uns kontaktierst – insbesondere über ein Kontaktformular
            oder per E-Mail – verarbeiten wir die von dir übermittelten Daten,
            insbesondere Name, E-Mail-Adresse, Betreff und Nachricht, zur
            Bearbeitung deiner Anfrage.
          </p>
          <p>
            Support erfolgt derzeit per E-Mail unter
            <strong> support@cardletics.com</strong>.
          </p>
          <p>
            Für Anfragen zur Löschung deines Nutzerkontos kannst du außerdem
            <strong> delete@cardletics.com</strong> verwenden.
          </p>
        </Section>

        <Section title="13. Hosting, Infrastruktur und eingesetzte Dienste">
          <p>
            Unsere Website wird über <strong>Vercel</strong> bereitgestellt.
            Für Backend-Funktionen nutzen wir <strong>Supabase</strong>,
            insbesondere für Authentifizierung, Datenbank, Storage, Realtime
            und Edge Functions.
          </p>
          <p>
            Über Supabase können insbesondere Nutzerkonten, Datenbankeinträge,
            Chat- und Gruppendaten, Standort-/Präsenzdaten, Bilder und sonstige
            Dateien in Storage-Systemen verarbeitet werden.
          </p>
          <p>
            Im Rahmen des technischen Betriebs können Server- und
            Sicherheitsprotokolle bei den eingesetzten Infrastruktur- und
            Plattformdiensten anfallen.
          </p>
        </Section>

        <Section title="14. Empfänger, Plattformen und Datenquellen">
          <p>
            Personenbezogene Daten werden nur an Dritte weitergegeben, soweit
            dies zur Erfüllung der beschriebenen Zwecke erforderlich ist,
            gesetzlich vorgeschrieben ist oder eine wirksame Einwilligung
            vorliegt.
          </p>
          <p>Hierzu können insbesondere gehören:</p>
          <ul style={listStyle}>
            <li>Vercel als Hosting-Dienstleister</li>
            <li>
              Supabase als Backend-, Datenbank-, Realtime- und
              Storage-Dienstleister
            </li>
            <li>Apple App Store für iOS-In-App-Käufe und Abonnements</li>
            <li>Google Play Billing für Android-In-App-Käufe und Abonnements</li>
            <li>
              Apple Health/HealthKit als auf iOS verwendete System-Datenquelle,
              soweit du den Zugriff ausdrücklich freigibst
            </li>
            <li>
              Android Health Connect als auf Android verwendete
              System-Datenquelle, soweit du den Zugriff ausdrücklich freigibst
            </li>
            <li>
              Fitnessdienste wie Strava, Garmin, Fitbit, Samsung Health, Google
              Fit oder vergleichbare Dienste werden derzeit nicht unmittelbar
              von Cardletics angebunden. Daten solcher Dienste können Cardletics
              nur indirekt erreichen, wenn sie zuvor in Apple Health oder Health
              Connect übernommen wurden und dort für Cardletics freigegeben sind.
            </li>
            <li>
              Steuerberater, soweit dies zur ordnungsgemäßen Buchhaltung und
              Erfüllung gesetzlicher Pflichten erforderlich ist
            </li>
          </ul>
          <p>
            Ein interner Admin-Bereich existiert. Zugriff erhalten nur intern
            berechtigte Personen, soweit dies zur Administration,
            Fehlerbehebung, Missbrauchsprävention, Abrechnung oder Support
            erforderlich ist.
          </p>
        </Section>

        <Section title="15. Internationale Datenverarbeitung">
          <p>
            Die App kann von Nutzerinnen und Nutzern in unterschiedlichen
            Ländern verwendet werden. Zudem können einzelne Dienstleister,
            Plattformen oder App-Store-Anbieter Daten auch außerhalb der EU bzw.
            des Europäischen Wirtschaftsraums verarbeiten.
          </p>
          <p>
            Soweit Daten in Drittstaaten verarbeitet werden, erfolgt dies nur
            unter Beachtung der gesetzlichen Voraussetzungen, insbesondere auf
            Grundlage geeigneter Garantien wie Angemessenheitsbeschlüssen,
            Standardvertragsklauseln oder vergleichbaren Mechanismen, soweit
            erforderlich.
          </p>
        </Section>

        <Section title="16. Speicherdauer">
          <p>
            Wir speichern personenbezogene Daten grundsätzlich nur solange, wie
            dies für den jeweiligen Verarbeitungszweck erforderlich ist oder
            gesetzliche Aufbewahrungspflichten bestehen.
          </p>
          <p>
            Nutzerkonto-, Profil-, Spiel- und Inventardaten werden grundsätzlich
            für die Dauer des Nutzerkontos gespeichert. Bei Löschung des
            Nutzerkontos werden personenbezogene Daten gelöscht oder anonymisiert,
            soweit sie nicht aufgrund gesetzlicher Pflichten oder zur
            Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen
            weiterhin benötigt werden.
          </p>
          <p>
            Freunde-, Gruppen-, Chat- und sonstige Social-Daten werden
            grundsätzlich solange gespeichert, wie dies für die jeweilige
            Funktion und das Nutzerkonto erforderlich ist. Einzelne Inhalte
            können früher gelöscht werden, soweit entsprechende Löschfunktionen
            vorgesehen sind.
          </p>
          <p>
            Standortdaten der Umgebung-/Radar-Funktion werden verarbeitet, soweit
            dies für die Funktion erforderlich ist. Eine Deaktivierung der
            Radar-Sichtbarkeit beendet nicht automatisch die Speicherung bereits
            vorhandener Standortwerte. Diese werden gelöscht, überschrieben oder
            spätestens im Zusammenhang mit der Kontolöschung entfernt, soweit
            keine anderweitige Rechtsgrundlage oder gesetzliche Pflicht eine
            weitere Speicherung erfordert.
          </p>
          <p>
            Nach Widerruf der Einwilligung greift Cardletics nicht mehr auf neue
            Gesundheits- und Bewegungsdaten zu. Bereits daraus erzeugte oder
            gespeicherte Spiel- und Fortschrittsdaten können bis zu ihrer
            Löschung oder der Löschung des Nutzerkontos gespeichert bleiben,
            soweit eine weitere Speicherung zulässig ist.
          </p>
          <p>
            Kauf-, Zahlungs- und Abrechnungsdaten werden solange gespeichert, wie
            dies zur Vertragsabwicklung und aufgrund steuer-, handels- oder
            sonstiger gesetzlicher Aufbewahrungspflichten erforderlich ist.
          </p>
          <p>
            Technische Server-, Sicherheits- und Fehlerdaten werden nur solange
            gespeichert, wie dies für Betrieb, Sicherheit, Fehleranalyse oder
            Missbrauchsprävention erforderlich ist. Soweit solche Daten durch
            eingesetzte Infrastruktur- oder Plattformanbieter verarbeitet werden,
            können zusätzlich deren technisch vorgegebene Aufbewahrungsfristen
            gelten.
          </p>
        </Section>

        <Section title="17. Kinder und Minderjährige">
          <p>
            Cardletics kann auch von Jugendlichen genutzt werden. Soweit für
            einzelne Verarbeitungen eine Einwilligung erforderlich ist, müssen
            Minderjährige die jeweils geltenden gesetzlichen Voraussetzungen
            erfüllen. In Deutschland kann für Dienste der Informationsgesellschaft
            grundsätzlich ab 16 Jahren selbst eingewilligt werden; darunter kann
            eine Zustimmung der Erziehungsberechtigten erforderlich sein.
          </p>
          <p>
            Bei kostenpflichtigen Funktionen, insbesondere In-App-Käufen und
            Abonnements, sind die jeweiligen Vorgaben des Zahlungs- bzw.
            Plattformanbieters sowie ggf. die Zustimmung der Eltern oder
            Erziehungsberechtigten zu beachten.
          </p>
        </Section>

        <Section title="18. Cookies und ähnliche Technologien">
          <p>
            Derzeit setzen wir nach unserer aktuellen Planung keine Analyse-
            oder Marketing-Tools auf der Website ein. Soweit technisch
            notwendige Cookies oder vergleichbare Technologien verwendet werden,
            erfolgt dies zur Bereitstellung, Sicherheit und Funktionalität der
            Website.
          </p>
          <p>
            Sollten künftig zusätzliche Cookies oder vergleichbare Technologien
            eingesetzt werden, insbesondere für Analyse, Reichweitenmessung oder
            Marketing, werden wir diese Datenschutzerklärung und ggf. unsere
            Einwilligungsprozesse entsprechend anpassen.
          </p>
        </Section>

        <Section title="19. App-Store-Datenschutzangaben">
          <p>
            Für die Veröffentlichung in App Stores können zusätzliche
            Datenschutzangaben erforderlich sein, insbesondere im Google Play
            Store und Apple App Store. Diese Angaben müssen mit dieser
            Datenschutzerklärung und der tatsächlichen Datenverarbeitung in der
            App übereinstimmen.
          </p>
          <p>
            Wenn neue Funktionen eingeführt werden, insbesondere Standort,
            Health-/Fitness-Integrationen, Chat, Gruppen, Marketplace,
            Zahlungen, Analyse oder Werbung, müssen auch die jeweiligen
            App-Store-Datenschutzangaben entsprechend aktualisiert werden.
          </p>
        </Section>

        <Section title="20. Betroffenenrechte">
          <p>
            Du hast nach Maßgabe der gesetzlichen Vorschriften insbesondere das
            Recht:
          </p>
          <ul style={listStyle}>
            <li>Auskunft über deine gespeicherten Daten zu verlangen,</li>
            <li>unrichtige Daten berichtigen zu lassen,</li>
            <li>die Löschung deiner Daten zu verlangen,</li>
            <li>die Einschränkung der Verarbeitung zu verlangen,</li>
            <li>der Verarbeitung zu widersprechen,</li>
            <li>Datenübertragbarkeit zu verlangen, soweit anwendbar,</li>
            <li>
              erteilte Einwilligungen jederzeit mit Wirkung für die Zukunft zu
              widerrufen.
            </li>
          </ul>
          <p>
            Für die Löschung deines Nutzerkontos kannst du die Seite
            <Link href="/konto-loeschen"> /konto-loeschen</Link> nutzen oder uns
            unter <strong>delete@cardletics.com</strong> kontaktieren.
          </p>
          <p>
            Außerdem hast du das Recht, dich bei einer zuständigen
            Datenschutzaufsichtsbehörde zu beschweren.
          </p>
        </Section>

        <Section title="21. Datensicherheit">
          <p>
            Wir treffen technische und organisatorische Maßnahmen, um
            personenbezogene Daten gegen Verlust, Missbrauch, unberechtigten
            Zugriff, unbefugte Offenlegung und unzulässige Veränderung zu
            schützen.
          </p>
        </Section>

        <Section title="22. Änderungen dieser Datenschutzerklärung">
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, wenn
            sich rechtliche, technische oder organisatorische Änderungen ergeben
            oder wenn neue Funktionen, Dienste oder Prozesse eingeführt werden.
          </p>
        </Section>

        <Section title="23. Kontakt zu Datenschutzfragen">
          <p>
            Wenn du Fragen zum Datenschutz oder zur Ausübung deiner Rechte hast,
            kannst du uns jederzeit kontaktieren:
          </p>
          <p style={addressStyle}>
            <strong>Sascha Leineweber – Cardletics</strong>
            <br />
            Oppenheimer Str. 26
            <br />
            55130 Mainz
            <br />
            Deutschland
            <br />
            E-Mail: info@cardletics.com
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
        <Link href="/impressum" style={footerLinkStyle}>Impressum</Link>
        <Link href="/datenschutz" style={footerLinkStyle}>Datenschutz</Link>
        <Link href="/agb" style={footerLinkStyle}>AGB</Link>
        <Link href="/kontakt" style={footerLinkStyle}>Kontakt</Link>
        <Link href="/konto-loeschen" style={footerLinkStyle}>Konto löschen</Link>
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
