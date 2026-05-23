import { Euro } from "lucide-react";
import { FormEvent, useState } from "react";
import { SectionTitle } from "../components/SectionTitle";
import { useCurrency } from "../contexts/CurrencyContext";

export function AdminCurrenciesPage() {
  const { options, upsertCurrency } = useCurrency();
  const [code, setCode] = useState("GBP");
  const [label, setLabel] = useState("British pound");
  const [flag, setFlag] = useState("GB");
  const [rate, setRate] = useState(170);

  function submit(event: FormEvent) {
    event.preventDefault();
    upsertCurrency({ code, label, flag, rate });
  }

  return (
    <section className="page-shell">
      <SectionTitle eyebrow="Admin" title="Currencies and exchange rates" action={`${options.length} active`} />
      <div className="admin-layout">
        <form className="material-panel admin-form" onSubmit={submit}>
          <h2>
            <Euro size={20} /> Create custom currency
          </h2>
          <label>Code<input value={code} onChange={(event) => setCode(event.target.value)} /></label>
          <label>Label<input value={label} onChange={(event) => setLabel(event.target.value)} /></label>
          <label>World flag code<input value={flag} onChange={(event) => setFlag(event.target.value)} /></label>
          <label>1 currency unit in DZD<input type="number" min={1} value={rate} onChange={(event) => setRate(Number(event.target.value))} /></label>
          <button className="primary">Save currency</button>
        </form>
        <article className="material-panel">
          <h2>Exchange table</h2>
          <div className="admin-table">
            {options.map((option) => (
              <div className="admin-row currency-row" key={option.code}>
                <span className="pill">{option.flag}</span>
                <strong>{option.code}</strong>
                <span>{option.label}</span>
                <b>{option.rate} DZD</b>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
