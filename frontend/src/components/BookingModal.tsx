import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../contexts/CurrencyContext";
import { useLocale } from "../contexts/LocaleContext";
import { useAppStore } from "../stores/appStore";
import { Facility } from "../types/domain";

export function BookingModal({
  facility,
  onClose,
}: {
  facility: Facility;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { addBooking } = useAppStore();
  const { format } = useCurrency();
  const { t } = useLocale();
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("2026-06-20");
  const [guestName, setGuestName] = useState("Ajizour traveler");

  function submit(event: FormEvent) {
    event.preventDefault();
    addBooking({
      facilityId: facility.id,
      guests,
      date,
      status: "pending",
      total: facility.price * guests,
      guestName,
      providerNote: t("booking.providerNote"),
    });
    navigate("/reservations");
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="booking-modal" onSubmit={submit}>
        <button className="modal-close" type="button" onClick={onClose}>
          <X size={20} />
        </button>
        <h2>{t("booking.title")}</h2>
        <p>{facility.name}</p>
        <label>
          {t("booking.guestName")}
          <input value={guestName} onChange={(event) => setGuestName(event.target.value)} />
        </label>
        <label>
          {t("search.date")}
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <label>
          {t("search.guests")}
          <input
            min={1}
            type="number"
            value={guests}
            onChange={(event) => setGuests(Number(event.target.value))}
          />
        </label>
        <div className="total-row">
          <span>{t("booking.total")}</span>
          <strong>{format(facility.price * guests)}</strong>
        </div>
        <button className="primary">{t("booking.confirm")}</button>
      </form>
    </div>
  );
}
