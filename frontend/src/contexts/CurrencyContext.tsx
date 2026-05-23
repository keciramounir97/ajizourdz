import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Currency, CurrencyOption } from "../types/domain";

const storageKey = "ajizor-currency";
const optionsStorageKey = "ajizor-currency-options";
const defaultOptions: CurrencyOption[] = [
  { code: "DZD", label: "Algerian dinar", flag: "🇩🇿", rate: 1 },
  { code: "EUR", label: "Euro", flag: "🇪🇺", rate: 147 },
  { code: "USD", label: "US dollar", flag: "🇺🇸", rate: 135 },
];

const CurrencyContext = createContext<{
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: Record<Currency, number>;
  options: CurrencyOption[];
  setRate: (currency: Currency, value: number) => void;
  upsertCurrency: (option: CurrencyOption) => void;
  format: (amountDzd: number) => string;
} | null>(null);

function getInitialCurrency(): Currency {
  const stored = localStorage.getItem(storageKey) as Currency | null;
  return stored || "DZD";
}

function getInitialOptions(): CurrencyOption[] {
  try {
    const stored = JSON.parse(localStorage.getItem(optionsStorageKey) ?? "");
    return Array.isArray(stored) && stored.length ? stored : defaultOptions;
  } catch {
    return defaultOptions;
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(getInitialCurrency);
  const [options, setOptions] = useState<CurrencyOption[]>(getInitialOptions);
  const rates = useMemo(
    () =>
      Object.fromEntries(options.map((option) => [option.code, option.rate])),
    [options],
  );

  useEffect(() => {
    localStorage.setItem(storageKey, currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(optionsStorageKey, JSON.stringify(options));
  }, [options]);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      rates,
      options,
      setRate: (code: Currency, value: number) =>
        setOptions((current) =>
          current.map((option) =>
            option.code === code
              ? {
                  ...option,
                  rate: code === "DZD" ? 1 : Math.max(value || 1, 1),
                }
              : option,
          ),
        ),
      upsertCurrency: (option: CurrencyOption) =>
        setOptions((current) => {
          const normalized = {
            ...option,
            code: option.code.trim().toUpperCase(),
            rate:
              option.code.trim().toUpperCase() === "DZD"
                ? 1
                : Math.max(option.rate || 1, 1),
          };
          return current.some((item) => item.code === normalized.code)
            ? current.map((item) =>
                item.code === normalized.code ? normalized : item,
              )
            : [...current, normalized];
        }),
      format: (amountDzd: number) => {
        const rate = rates[currency] || 1;
        const converted = amountDzd / rate;
        const option = options.find((item) => item.code === currency);
        try {
          return new Intl.NumberFormat("fr-DZ", {
            style: "currency",
            currency,
            maximumFractionDigits: currency === "DZD" ? 0 : 2,
          }).format(converted);
        } catch {
          return `${option?.flag ?? ""} ${converted.toFixed(2)} ${currency}`.trim();
        }
      },
    }),
    [currency, options, rates],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("CurrencyContext missing");
  return context;
}
