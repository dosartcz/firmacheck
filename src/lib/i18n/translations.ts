export type Lang = "cs" | "en" | "de";

export const LANGS: readonly Lang[] = ["cs", "en", "de"] as const;

export const LANG_LABELS: Record<Lang, string> = {
  cs: "Čeština",
  en: "English",
  de: "Deutsch",
};

export const LANG_SHORT: Record<Lang, string> = {
  cs: "CS",
  en: "EN",
  de: "DE",
};

interface Dict {
  // Hero
  heroEyebrow: string;
  heroHeading: string;
  heroHeadingBreak: string;
  heroSubheading: string;
  heroIllustrationAlt: string;

  // Form
  formIcoLabel: string;
  formIcoRequired: string;
  formNameLabel: string;
  formNameOptional: string;
  formSubmit: string;
  formSubmitting: string;
  formErrorIcoRequired: string;
  formErrorIcoDigits: string;
  formErrorIcoChecksum: string;

  // Status badges + source labels
  badgeApi: string;
  badgeCache: string;
  badgeApiTooltip: string;
  badgeCacheTooltip: string;
  sourceAres: string;
  sourceGeocoding: string;
  statusLoading: string;
  statusFound: string;
  statusNotFound: string;
  statusError: string;

  // Detail
  detailNameLabel: string;
  detailIcoLabel: string;
  detailSaveCta: string;
  detailRemoveCta: string;
  detailCloseCta: string;
  detailLegalForm: string;
  detailStatus: string;
  detailStatusActive: string;
  detailStatusDissolved: string;
  detailEstablished: string;
  detailDic: string;
  detailAddress: string;
  detailMapHeading: string;
  detailNoCoords: string;

  // Map
  mapOpenExternal: string;
  mapNoKey: string;

  // Name comparison
  nameMatchExact: string; // "Zadaný název „{input}" přesně odpovídá firmě „{ares}"."
  nameMatchPartial: string;
  nameMatchMismatch: string;

  // Saved
  savedHeading: string;
  savedCountSuffix: string;
  savedSubheading: string;
  savedEmpty: string;
  savedEmptyCta: string;
  savedExportCsv: string;
  savedExportJson: string;
  savedCopyJson: string;
  savedCopiedJson: string;
  savedCopyError: string;
  savedVerifiedAt: string;
  savedSourceLabel: string;
  savedActionDetail: string;
  savedActionDelete: string;

  // Page-level
  pageNotFoundMessage: string;
  pageGenericErrorMessage: string;
  pageNetworkError: string;
  pageGeocodingError: string;

  // Footer
  footerData: string;
  footerMap: string;

  // Top bar
  themeToggleToDark: string;
  themeToggleToLight: string;
  languageSelect: string;

  // Months / dates — we use locale-aware Intl APIs at call site
  dash: string;
}

const cs: Dict = {
  heroEyebrow: "FirmaCheck",
  heroHeading: "Ověřte českou firmu za pár sekund.",
  heroHeadingBreak: "Ověřte českou firmu",
  heroSubheading:
    "Zadejte IČO, případně i název. Aplikace načte aktuální údaje z ARESu, zobrazí sídlo firmy na mapě, uloží odpověď do SQLite cache a umožní vám firmy hromadně exportovat.",
  heroIllustrationAlt: "Ilustrace ověřování firmy",

  formIcoLabel: "IČO",
  formIcoRequired: "*",
  formNameLabel: "Název firmy",
  formNameOptional: "(volitelné)",
  formSubmit: "Ověřit firmu",
  formSubmitting: "Ověřuji…",
  formErrorIcoRequired: "IČO je povinné.",
  formErrorIcoDigits: "IČO smí obsahovat pouze číslice (1–8).",
  formErrorIcoChecksum: "IČO má neplatný kontrolní součet.",

  badgeApi: "API",
  badgeCache: "SQLite cache",
  badgeApiTooltip: "Načteno přímo z API",
  badgeCacheTooltip: "Načteno ze SQLite cache",
  sourceAres: "ARES data",
  sourceGeocoding: "Geocoding",
  statusLoading: "Načítám data…",
  statusFound: "✓ Firma nalezena",
  statusNotFound: "Firma nenalezena v ARES",
  statusError: "Chyba při načítání",

  detailNameLabel: "Obchodní název",
  detailIcoLabel: "IČO",
  detailSaveCta: "+ Uložit firmu",
  detailRemoveCta: "Odebrat z uložených",
  detailCloseCta: "Zavřít detail",
  detailLegalForm: "Právní forma",
  detailStatus: "Stav subjektu",
  detailStatusActive: "Aktivní",
  detailStatusDissolved: "Zaniklá",
  detailEstablished: "Datum vzniku",
  detailDic: "DIČ",
  detailAddress: "Adresa sídla",
  detailMapHeading: "Sídlo firmy",
  detailNoCoords: "Souřadnice sídla nejsou dostupné.",

  mapOpenExternal: "Otevřít na Mapy.com →",
  mapNoKey:
    "NEXT_PUBLIC_MAPY_API_KEY není nastaven — používá se OpenStreetMap fallback.",

  nameMatchExact:
    "Zadaný název „{input}\" přesně odpovídá firmě „{ares}\".",
  nameMatchPartial:
    "Zadaný název „{input}\" částečně odpovídá firmě „{ares}\".",
  nameMatchMismatch:
    "Zadaný název „{input}\" se liší od názvu v ARES „{ares}\".",

  savedHeading: "Uložené firmy",
  savedCountSuffix: "",
  savedSubheading:
    "Data zůstávají v lokální SQLite/IndexedDB i po obnovení stránky.",
  savedEmpty: "Zatím nemáte žádnou uloženou firmu. Po ověření klikněte na ",
  savedEmptyCta: "+ Uložit firmu",
  savedExportCsv: "Export CSV",
  savedExportJson: "Export JSON",
  savedCopyJson: "Kopírovat JSON",
  savedCopiedJson: "✓ Zkopírováno",
  savedCopyError: "Kopírování do schránky se nezdařilo.",
  savedVerifiedAt: "Ověřeno",
  savedSourceLabel: "zdroj",
  savedActionDetail: "Detail",
  savedActionDelete: "Smazat",

  pageNotFoundMessage: "Firma s tímto IČO nebyla v ARES nalezena.",
  pageGenericErrorMessage: "Něco se pokazilo. Zkuste to prosím znovu.",
  pageNetworkError: "Selhalo načítání z ARES.",
  pageGeocodingError: "Geocoding selhal.",

  footerData: "data ze státního",
  footerMap: "mapa",

  themeToggleToDark: "Přepnout na tmavý režim",
  themeToggleToLight: "Přepnout na světlý režim",
  languageSelect: "Jazyk",

  dash: "—",
};

const en: Dict = {
  heroEyebrow: "FirmaCheck",
  heroHeading: "Verify a Czech company in seconds.",
  heroHeadingBreak: "Verify a Czech company",
  heroSubheading:
    "Enter a Czech company registration number (IČO), and optionally a name. The app fetches up-to-date data from ARES, shows the registered office on a map, caches the response in local SQLite, and lets you bulk export your verified companies.",
  heroIllustrationAlt: "Illustration of company verification",

  formIcoLabel: "IČO",
  formIcoRequired: "*",
  formNameLabel: "Company name",
  formNameOptional: "(optional)",
  formSubmit: "Verify company",
  formSubmitting: "Verifying…",
  formErrorIcoRequired: "IČO is required.",
  formErrorIcoDigits: "IČO must contain only digits (1–8).",
  formErrorIcoChecksum: "IČO has an invalid checksum.",

  badgeApi: "API",
  badgeCache: "SQLite cache",
  badgeApiTooltip: "Fetched live from API",
  badgeCacheTooltip: "Loaded from SQLite cache",
  sourceAres: "ARES data",
  sourceGeocoding: "Geocoding",
  statusLoading: "Loading data…",
  statusFound: "✓ Company found",
  statusNotFound: "Company not found in ARES",
  statusError: "Failed to load",

  detailNameLabel: "Trade name",
  detailIcoLabel: "IČO",
  detailSaveCta: "+ Save company",
  detailRemoveCta: "Remove from saved",
  detailCloseCta: "Close detail",
  detailLegalForm: "Legal form",
  detailStatus: "Status",
  detailStatusActive: "Active",
  detailStatusDissolved: "Dissolved",
  detailEstablished: "Established",
  detailDic: "VAT ID (DIČ)",
  detailAddress: "Registered office",
  detailMapHeading: "Office location",
  detailNoCoords: "Coordinates are not available.",

  mapOpenExternal: "Open on Mapy.com →",
  mapNoKey:
    "NEXT_PUBLIC_MAPY_API_KEY is not set — using OpenStreetMap fallback.",

  nameMatchExact:
    "Input name “{input}” exactly matches the ARES record “{ares}”.",
  nameMatchPartial:
    "Input name “{input}” partially matches the ARES record “{ares}”.",
  nameMatchMismatch:
    "Input name “{input}” differs from the ARES record “{ares}”.",

  savedHeading: "Saved companies",
  savedCountSuffix: "",
  savedSubheading:
    "Data stays in local SQLite / IndexedDB and survives a page refresh.",
  savedEmpty: "No saved companies yet. After verifying, click ",
  savedEmptyCta: "+ Save company",
  savedExportCsv: "Export CSV",
  savedExportJson: "Export JSON",
  savedCopyJson: "Copy JSON",
  savedCopiedJson: "✓ Copied",
  savedCopyError: "Copy to clipboard failed.",
  savedVerifiedAt: "Verified",
  savedSourceLabel: "source",
  savedActionDetail: "Detail",
  savedActionDelete: "Delete",

  pageNotFoundMessage: "No company with this IČO was found in ARES.",
  pageGenericErrorMessage: "Something went wrong. Please try again.",
  pageNetworkError: "Failed to fetch from ARES.",
  pageGeocodingError: "Geocoding failed.",

  footerData: "data from the official",
  footerMap: "map",

  themeToggleToDark: "Switch to dark theme",
  themeToggleToLight: "Switch to light theme",
  languageSelect: "Language",

  dash: "—",
};

const de: Dict = {
  heroEyebrow: "FirmaCheck",
  heroHeading: "Überprüfen Sie eine tschechische Firma in Sekunden.",
  heroHeadingBreak: "Überprüfen Sie eine tschechische Firma",
  heroSubheading:
    "Geben Sie die tschechische Firmennummer (IČO) und optional einen Namen ein. Die App lädt aktuelle Daten aus ARES, zeigt den Firmensitz auf der Karte, speichert die Antwort in einem lokalen SQLite-Cache und ermöglicht den Export überprüfter Firmen.",
  heroIllustrationAlt: "Illustration der Firmenprüfung",

  formIcoLabel: "IČO",
  formIcoRequired: "*",
  formNameLabel: "Firmenname",
  formNameOptional: "(optional)",
  formSubmit: "Firma prüfen",
  formSubmitting: "Prüfe…",
  formErrorIcoRequired: "IČO ist erforderlich.",
  formErrorIcoDigits: "IČO darf nur Ziffern enthalten (1–8).",
  formErrorIcoChecksum: "IČO hat eine ungültige Prüfsumme.",

  badgeApi: "API",
  badgeCache: "SQLite-Cache",
  badgeApiTooltip: "Direkt aus dem API geladen",
  badgeCacheTooltip: "Aus dem SQLite-Cache geladen",
  sourceAres: "ARES-Daten",
  sourceGeocoding: "Geocoding",
  statusLoading: "Lade Daten…",
  statusFound: "✓ Firma gefunden",
  statusNotFound: "Firma nicht im ARES gefunden",
  statusError: "Fehler beim Laden",

  detailNameLabel: "Firmenname",
  detailIcoLabel: "IČO",
  detailSaveCta: "+ Firma speichern",
  detailRemoveCta: "Aus den Gespeicherten entfernen",
  detailCloseCta: "Detail schließen",
  detailLegalForm: "Rechtsform",
  detailStatus: "Status",
  detailStatusActive: "Aktiv",
  detailStatusDissolved: "Aufgelöst",
  detailEstablished: "Gründungsdatum",
  detailDic: "USt-IdNr. (DIČ)",
  detailAddress: "Firmensitz",
  detailMapHeading: "Standort",
  detailNoCoords: "Koordinaten sind nicht verfügbar.",

  mapOpenExternal: "Auf Mapy.com öffnen →",
  mapNoKey:
    "NEXT_PUBLIC_MAPY_API_KEY ist nicht gesetzt — OpenStreetMap-Fallback wird verwendet.",

  nameMatchExact:
    "Der Name „{input}\" stimmt genau mit dem ARES-Eintrag „{ares}\" überein.",
  nameMatchPartial:
    "Der Name „{input}\" stimmt teilweise mit dem ARES-Eintrag „{ares}\" überein.",
  nameMatchMismatch:
    "Der Name „{input}\" weicht vom ARES-Eintrag „{ares}\" ab.",

  savedHeading: "Gespeicherte Firmen",
  savedCountSuffix: "",
  savedSubheading:
    "Daten bleiben in der lokalen SQLite/IndexedDB auch nach dem Neuladen erhalten.",
  savedEmpty: "Noch keine gespeicherten Firmen. Nach der Prüfung klicken Sie auf ",
  savedEmptyCta: "+ Firma speichern",
  savedExportCsv: "CSV exportieren",
  savedExportJson: "JSON exportieren",
  savedCopyJson: "JSON kopieren",
  savedCopiedJson: "✓ Kopiert",
  savedCopyError: "Kopieren in die Zwischenablage fehlgeschlagen.",
  savedVerifiedAt: "Geprüft",
  savedSourceLabel: "Quelle",
  savedActionDetail: "Detail",
  savedActionDelete: "Löschen",

  pageNotFoundMessage: "Keine Firma mit dieser IČO wurde im ARES gefunden.",
  pageGenericErrorMessage:
    "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
  pageNetworkError: "Laden aus ARES fehlgeschlagen.",
  pageGeocodingError: "Geocoding fehlgeschlagen.",

  footerData: "Daten vom staatlichen",
  footerMap: "Karte",

  themeToggleToDark: "Zu dunklem Design wechseln",
  themeToggleToLight: "Zu hellem Design wechseln",
  languageSelect: "Sprache",

  dash: "—",
};

export const translations: Record<Lang, Dict> = { cs, en, de };
export type TranslationKey = keyof Dict;
