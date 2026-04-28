import Link from "next/link";

export default function AgbPage() {
  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <Link href="/" style={backLinkStyle}>
          ← Zurück zur Startseite
        </Link>

        <h1 style={titleStyle}>Allgemeine Geschäftsbedingungen (AGB)</h1>
        <p style={introStyle}>
          Diese AGB gelten für die Nutzung der Website und der mobilen App
          „Cardletics“ sowie für damit verbundene digitale Inhalte, Funktionen,
          virtuelle Güter, Abonnements und In-App-Käufe.
        </p>

        <Section
          title="1. Anbieter"
          text={`Anbieter des Angebots ist:

Cardletics
Sascha Leineweber
Oppenheimer Str. 26
55130 Mainz
Deutschland

E-Mail: info@cardletics.com`}
        />

        <Section
          title="2. Geltungsbereich"
          text={`Diese AGB gelten für alle Verträge zwischen Cardletics und Nutzern über die Nutzung der Website, der App und der darin angebotenen digitalen Inhalte und Funktionen.

Sie gelten insbesondere für:
- die Registrierung und Nutzung eines Nutzerkontos
- kostenlose und kostenpflichtige Funktionen
- In-App-Käufe und Abonnements
- virtuelle Inhalte wie Karten, Coins, Packs, Awards, Sammlungen und Teams
- interne Handels- und Marketplace-Funktionen`}
        />

        <Section
          title="3. Vertragsgegenstand"
          text={`Cardletics stellt ein digitales Angebot im Bereich Sport, Aktivität, Sammelkarten, Spiel- und Fortschrittsmechaniken bereit.

Zum Leistungsumfang können insbesondere gehören:
- Nutzerkonto und Profil
- Erfassung und Auswertung sportbezogener Aktivitäten
- Vergabe, Anzeige und Verwaltung digitaler Karten
- Sammlungen, Teams, Ausstellung und Awards
- interne Marketplace- und Handelsfunktionen
- virtuelle Coins und weitere digitale Inhalte
- kostenlose sowie kostenpflichtige Zusatzfunktionen`}
        />

        <Section
          title="4. Registrierung und Nutzerkonto"
          text={`Für die Nutzung bestimmter Funktionen ist die Erstellung eines Nutzerkontos erforderlich.

Eine Registrierung ist derzeit insbesondere per E-Mail sowie – soweit angeboten – über Apple oder Google möglich. Nutzer sind verpflichtet, ihre Zugangsdaten vertraulich zu behandeln und unbefugte Zugriffe unverzüglich zu melden.

Es besteht kein Anspruch auf Registrierung oder dauerhafte Freischaltung eines Nutzerkontos.`}
        />

        <Section
          title="5. Nutzungsvoraussetzungen"
          text={`Die Nutzung von Cardletics ist grundsätzlich kostenlos möglich. Für einzelne Funktionen, digitale Inhalte oder Erweiterungen können zusätzliche Voraussetzungen gelten, zum Beispiel ein aktives Nutzerkonto, eine Gerätekompatibilität, eine Internetverbindung oder eine gesonderte Buchung.

Soweit kostenpflichtige Leistungen angeboten werden, werden Preis, Laufzeit und wesentliche Bedingungen vor Vertragsschluss angezeigt.`}
        />

        <Section
          title="6. Digitale Inhalte und virtuelle Güter"
          text={`Cardletics kann digitale Inhalte und virtuelle Güter bereitstellen, darunter insbesondere Karten, Coins, Packs, Sammlungen, Awards, Hintergründe, Teams oder sonstige spielbezogene Inhalte.

Virtuelle Güter:
- sind ausschließlich innerhalb von Cardletics nutzbar,
- haben keinen Anspruch auf Auszahlung in Geld,
- sind grundsätzlich nicht auf externe Plattformen übertragbar,
- vermitteln kein Eigentum im sachenrechtlichen Sinn, sondern nur ein einfaches, widerrufliches Nutzungsrecht innerhalb des Angebots, soweit technisch vorgesehen.`}
        />

        <Section
          title="7. Coins und interne Währung"
          text={`Coins oder vergleichbare virtuelle Währungen dienen ausschließlich der Nutzung innerhalb von Cardletics.

Coins:
- können gegebenenfalls im Rahmen der App erworben oder freigeschaltet werden,
- haben keinen Geldwert außerhalb von Cardletics,
- sind nicht verzinslich,
- sind grundsätzlich nicht auszahlbar oder in gesetzliche Zahlungsmittel umtauschbar.

Soweit gesetzlich zulässig, besteht bei Verlust oder Sperrung eines Kontos kein Anspruch auf Erstattung rein virtueller Guthaben, wenn die Maßnahme auf einem Verstoß gegen diese AGB beruht.`}
        />

        <Section
          title="8. In-App-Käufe und Abonnements"
          text={`Kostenpflichtige digitale Inhalte, Coins, Packs oder Abonnements können über die jeweils unterstützten Plattformen, insbesondere Apple App Store und Google Play, angeboten werden.

Die Abwicklung von Zahlungen, Verlängerungen, Kündigungen und Erstattungen kann ganz oder teilweise den Bedingungen der jeweiligen Plattformbetreiber unterliegen. Maßgeblich sind insoweit ergänzend die Nutzungs- und Zahlungsbedingungen von Apple oder Google.

Abonnements können sich – je nach gewähltem Modell – automatisch verlängern, wenn sie nicht rechtzeitig über die jeweilige Plattform gekündigt werden.`}
        />

        <Section
          title="9. Widerruf bei digitalen Inhalten"
          text={`Soweit Verbrauchern ein gesetzliches Widerrufsrecht zusteht, wird hierüber gesondert belehrt.

Bei Verträgen über digitale Inhalte oder digitale Dienstleistungen kann das Widerrufsrecht vorzeitig erlöschen, wenn der Nutzer ausdrücklich zustimmt, dass mit der Vertragserfüllung vor Ablauf der Widerrufsfrist begonnen wird, und bestätigt, dass er dadurch sein Widerrufsrecht verliert, soweit dies gesetzlich vorgesehen ist.`}
        />

        <Section
          title="10. Marketplace und interne Handelsfunktionen"
          text={`Cardletics kann interne Marketplace-, Tausch- oder Handelsfunktionen für digitale Inhalte bereitstellen.

Dabei gilt:
- der Handel erfolgt ausschließlich innerhalb des Cardletics-Systems,
- ein Anspruch auf jederzeitige Verfügbarkeit bestimmter Handelsfunktionen besteht nicht,
- Cardletics kann Regeln, Gebühren, Limits oder technische Voraussetzungen für interne Handelsfunktionen festlegen oder ändern, soweit dies sachlich gerechtfertigt ist,
- bei Missbrauch, Manipulation, Betrugsverdacht oder Verstößen gegen diese AGB können Angebote, Transaktionen oder Accounts eingeschränkt oder gesperrt werden.`}
        />

        <Section
          title="11. Gesundheits- und Aktivitätsfunktionen"
          text={`Soweit Cardletics Bewegungs-, Fitness- oder Gesundheitsdaten verarbeitet, geschieht dies ausschließlich im Rahmen der bereitgestellten App-Funktionen und auf Basis gesonderter Einwilligungen bzw. Gerätefreigaben, soweit erforderlich.

Die App ist kein medizinisches Produkt und ersetzt keine ärztliche, therapeutische oder gesundheitliche Beratung.`}
        />

        <Section
          title="12. Pflichten der Nutzer"
          text={`Nutzer verpflichten sich insbesondere,
- wahrheitsgemäße Angaben zu machen,
- keine technischen Schutzmaßnahmen zu umgehen,
- keine Manipulationen, Bots, Exploits oder vergleichbare missbräuchliche Mechanismen einzusetzen,
- keine rechtswidrigen, beleidigenden oder schädlichen Inhalte einzustellen,
- keine unbefugten Zugriffe auf Systeme, Daten oder Konten zu versuchen.

Bei Verstößen kann Cardletics Inhalte entfernen, Funktionen einschränken, Accounts sperren oder Verträge außerordentlich beenden.`}
        />

        <Section
          title="13. Verfügbarkeit und Änderungen"
          text={`Cardletics bemüht sich um eine möglichst störungsfreie Verfügbarkeit der Website, App und Funktionen. Eine ununterbrochene oder jederzeit fehlerfreie Verfügbarkeit kann jedoch nicht garantiert werden.

Cardletics ist berechtigt, Funktionen, Inhalte, digitale Güter, Abomodelle, Spielmechaniken und interne Systeme weiterzuentwickeln, anzupassen oder einzustellen, soweit hierfür ein berechtigtes Interesse besteht und Nutzer hierdurch nicht unangemessen benachteiligt werden.`}
        />

        <Section
          title="14. Sperrung und Kündigung"
          text={`Nutzer können ihr Konto im Rahmen der technischen und vertraglichen Möglichkeiten kündigen oder löschen lassen.

Cardletics kann Nutzerkonten sperren oder kündigen, wenn ein wichtiger Grund vorliegt, insbesondere bei:
- Verstößen gegen diese AGB
- Manipulation, Betrug oder Missbrauch
- unzulässiger Mehrfachnutzung
- Gefährdung von Sicherheit oder Integrität des Angebots

Konten können außerdem nach drei Jahren Inaktivität gelöscht werden. Gesetzliche Aufbewahrungspflichten bleiben unberührt.`}
        />

        <Section
          title="15. Haftung"
          text={`Cardletics haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.

Bei einfach fahrlässiger Verletzung wesentlicher Vertragspflichten ist die Haftung auf den vorhersehbaren, vertragstypischen Schaden begrenzt. Im Übrigen ist die Haftung für einfach fahrlässige Pflichtverletzungen ausgeschlossen, soweit gesetzlich zulässig.

Zwingende gesetzliche Haftungsregelungen bleiben unberührt.`}
        />

        <Section
          title="16. Geistiges Eigentum"
          text={`Alle Inhalte, Designs, Marken, Grafiken, Texte, Datenbanken, Spielmechaniken und sonstigen Bestandteile von Cardletics sind urheber-, marken- oder sonst rechtlich geschützt, soweit nicht anders gekennzeichnet.

Nutzern wird ausschließlich das zur vertragsgemäßen Nutzung erforderliche, einfache, nicht übertragbare Nutzungsrecht eingeräumt.`}
        />

        <Section
          title="17. Anwendbares Recht"
          text={`Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts, soweit dem keine zwingenden Verbraucherschutzvorschriften entgegenstehen.`}
        />

        <Section
          title="18. Streitbeilegung"
          text={`Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit. Cardletics ist weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen, sofern keine gesetzliche Pflicht besteht.`}
        />

        <Section
          title="19. Schlussbestimmungen"
          text={`Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.

Diese AGB sind eine sorgfältig formulierte Ausgangsfassung für Cardletics. Vor Live-Schaltung und insbesondere bei kostenpflichtigen Angeboten, Marketplace-Funktionen oder Änderungen des Geschäftsmodells sollte eine rechtliche Prüfung erfolgen.`}
        />
      </div>
    </main>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <section style={sectionStyle}>
      <h2 style={headingStyle}>{title}</h2>
      <p style={textStyle}>{text}</p>
    </section>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0b0f0d",
  padding: "24px",
  color: "#e7f1eb",
  fontFamily: "Arial, sans-serif",
};

const cardStyle: React.CSSProperties = {
  maxWidth: "900px",
  margin: "0 auto",
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "20px",
  padding: "28px",
};

const backLinkStyle: React.CSSProperties = {
  color: "#86efac",
  textDecoration: "none",
  display: "inline-block",
  marginBottom: "18px",
};

const titleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "10px",
  fontSize: "38px",
  color: "#ffffff",
};

const introStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "22px",
  color: "#b7c6be",
  lineHeight: 1.7,
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "22px",
};

const headingStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: "22px",
  color: "#ffffff",
};

const textStyle: React.CSSProperties = {
  margin: 0,
  color: "#b7c6be",
  lineHeight: 1.7,
  whiteSpace: "pre-line",
};
