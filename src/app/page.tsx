"use client";

import { useCallback, useEffect, useState } from "react";
import { CompanyForm } from "@/components/CompanyForm";
import { CompanyDetail } from "@/components/CompanyDetail";
import { SavedCompanies } from "@/components/SavedCompanies";
import { HeroIllustration } from "@/components/HeroIllustration";
import { TopBar } from "@/components/TopBar";
import { VerificationBadge } from "@/components/StatusBadge";
import { useT } from "@/lib/i18n";
import { compareNames } from "@/lib/compare";
import { geocodeAddress } from "@/lib/geocoding";
import {
  deleteSavedCompany,
  getCachedAres,
  getCachedGeocoding,
  isSaved as dbIsSaved,
  listSavedCompanies,
  saveCompany,
  setCachedAres,
  setCachedGeocoding,
} from "@/lib/db";
import type {
  CompanyData,
  Coordinates,
  DataSource,
  NameMatchResult,
  SavedCompany,
  VerificationStatus,
} from "@/types";

export default function HomePage() {
  const { t } = useT();
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [aresSource, setAresSource] = useState<DataSource | null>(null);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [geocodingSource, setGeocodingSource] = useState<DataSource | null>(
    null
  );
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [nameMatch, setNameMatch] = useState<NameMatchResult | null>(null);
  const [errorKind, setErrorKind] = useState<"not_found" | "generic" | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedCompany[]>([]);
  const [savedFlag, setSavedFlag] = useState<boolean>(false);

  const refreshSaved = useCallback(async () => {
    const list = await listSavedCompanies();
    setSaved(list);
  }, []);

  useEffect(() => {
    refreshSaved().catch(() => {});
  }, [refreshSaved]);

  const verify = useCallback(async (ico: string, inputName: string) => {
    setStatus("loading");
    setCompany(null);
    setAresSource(null);
    setCoords(null);
    setGeocodingSource(null);
    setGeocodingError(null);
    setNameMatch(null);
    setErrorKind(null);
    setErrorDetail(null);

    let companyData: CompanyData | null = null;
    let source: DataSource;
    try {
      const cached = await getCachedAres(ico);
      if (cached) {
        companyData = cached;
        source = "cache";
      } else {
        const res = await fetch(`/api/ares?ico=${ico}`);
        const body = await res.json();
        if (res.status === 404) {
          setStatus("not_found");
          setErrorKind("not_found");
          return;
        }
        if (!res.ok) {
          setStatus("error");
          setErrorKind("generic");
          setErrorDetail(body.error ?? null);
          return;
        }
        companyData = body.company as CompanyData;
        source = "API";
        await setCachedAres(companyData);
      }
    } catch (e) {
      setStatus("error");
      setErrorKind("generic");
      setErrorDetail(e instanceof Error ? e.message : null);
      return;
    }

    setCompany(companyData);
    setAresSource(source);

    if (inputName) {
      setNameMatch(compareNames(inputName, companyData.name));
    }

    setSavedFlag(await dbIsSaved(companyData.ico));

    try {
      const cachedCoords = await getCachedGeocoding(companyData.address);
      if (cachedCoords) {
        setCoords(cachedCoords);
        setGeocodingSource("cache");
      } else {
        const c = await geocodeAddress(companyData.address);
        setCoords(c);
        setGeocodingSource("API");
        await setCachedGeocoding(companyData.address, c);
      }
    } catch (e) {
      setGeocodingError(
        e instanceof Error ? e.message : t("pageGeocodingError")
      );
    }

    setStatus("found");
  }, [t]);

  const openSaved = useCallback(
    (ico: string) => {
      const s = saved.find((x) => x.ico === ico);
      if (!s) return;
      void verify(s.ico, "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [saved, verify]
  );

  const handleSave = useCallback(async () => {
    if (!company || !aresSource) return;
    await saveCompany(company, coords, aresSource);
    setSavedFlag(true);
    await refreshSaved();
  }, [company, aresSource, coords, refreshSaved]);

  const handleRemoveFromDetail = useCallback(async () => {
    if (!company) return;
    await deleteSavedCompany(company.ico);
    setSavedFlag(false);
    await refreshSaved();
  }, [company, refreshSaved]);

  const handleClose = useCallback(() => {
    setStatus("idle");
    setCompany(null);
  }, []);

  const handleRemoveFromList = useCallback(
    async (ico: string) => {
      await deleteSavedCompany(ico);
      if (company?.ico === ico) setSavedFlag(false);
      await refreshSaved();
    },
    [company, refreshSaved]
  );

  return (
    <>
      <TopBar />
      <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
        <HeroIllustration />

        <CompanyForm onSubmit={verify} loading={status === "loading"} />

        {status !== "idle" && (
          <div>
            {status === "loading" && (
              <VerificationBadge kind="loading" text={t("statusLoading")} />
            )}
            {status === "found" && (
              <VerificationBadge kind="found" text={t("statusFound")} />
            )}
            {status === "not_found" && (
              <div className="space-y-2">
                <VerificationBadge kind="not_found" text={t("statusNotFound")} />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("pageNotFoundMessage")}
                </p>
              </div>
            )}
            {status === "error" && (
              <div className="space-y-2">
                <VerificationBadge kind="error" text={t("statusError")} />
                <p className="text-sm text-rose-700 dark:text-rose-400">
                  {errorDetail ?? t("pageGenericErrorMessage")}
                </p>
              </div>
            )}
          </div>
        )}

        {company && status === "found" && aresSource && (
          <CompanyDetail
            company={company}
            aresSource={aresSource}
            coords={coords}
            geocodingSource={geocodingSource}
            geocodingError={geocodingError}
            nameMatch={nameMatch}
            isSaved={savedFlag}
            onSave={handleSave}
            onRemove={handleRemoveFromDetail}
            onClose={handleClose}
          />
        )}

        <SavedCompanies
          companies={saved}
          onOpen={openSaved}
          onRemove={handleRemoveFromList}
        />

        <footer className="pt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          FirmaCzech od Adama &amp; Clauda · {t("footerData")}{" "}
          <a
            href="https://ares.gov.cz"
            target="_blank"
            rel="noopener"
            className="underline hover:text-slate-600 dark:hover:text-slate-300"
          >
            ARES
          </a>{" "}
          · {t("footerMap")}{" "}
          <a
            href="https://mapy.com"
            target="_blank"
            rel="noopener"
            className="underline hover:text-slate-600 dark:hover:text-slate-300"
          >
            Mapy.com
          </a>
        </footer>
      </main>
    </>
  );
}
