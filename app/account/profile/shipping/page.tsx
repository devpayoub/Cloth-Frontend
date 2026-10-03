"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Edit2,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "@/store/auth";
import {
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  type MedusaAddress,
} from "@/api/auth";
import { cn } from "@/utils";

const COUNTRIES = [
  { code: "us", name: "United States" },
  { code: "ca", name: "Canada" },
  { code: "gb", name: "United Kingdom" },
  { code: "fr", name: "France" },
  { code: "de", name: "Germany" },
  { code: "it", name: "Italy" },
  { code: "es", name: "Spain" },
  { code: "nl", name: "Netherlands" },
  { code: "au", name: "Australia" },
  { code: "jp", name: "Japan" },
  { code: "ma", name: "Morocco" },
  { code: "ae", name: "United Arab Emirates" },
];

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest text-neutral-500">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function inputCls(extra?: string) {
  return cn(
    "w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black",
    extra
  );
}

export default function ShippingAddressesPage() {
  const { state } = useAuth();
  const [addresses, setAddresses] = useState<MedusaAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [countryCode, setCountryCode] = useState("us");
  const [phone, setPhone] = useState("");
  const [isDefaultShipping, setIsDefaultShipping] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (state.status !== "authenticated") return;
    try {
      setLoading(true);
      const list = await listAddresses(state.token);
      setAddresses(list);
    } catch (err: unknown) {
      console.error("Failed to load addresses:", err);
    } finally {
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  function resetForm() {
    setFirstName("");
    setLastName("");
    setCompany("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setProvince("");
    setPostalCode("");
    setCountryCode("us");
    setPhone("");
    setIsDefaultShipping(false);
    setEditingId(null);
    setError(null);
  }

  function openCreate() {
    resetForm();
    if (state.status === "authenticated") {
      setFirstName(state.customer.first_name ?? "");
      setLastName(state.customer.last_name ?? "");
      setPhone(state.customer.phone ?? "");
    }
    setFormOpen(true);
  }

  function openEdit(addr: MedusaAddress) {
    setError(null);
    setEditingId(addr.id);
    setFirstName(addr.first_name ?? "");
    setLastName(addr.last_name ?? "");
    setCompany(addr.company ?? "");
    setAddress1(addr.address_1 ?? "");
    setAddress2(addr.address_2 ?? "");
    setCity(addr.city ?? "");
    setProvince(addr.province ?? "");
    setPostalCode(addr.postal_code ?? "");
    setCountryCode(addr.country_code ? addr.country_code.toLowerCase() : "us");
    setPhone(addr.phone ?? "");
    setIsDefaultShipping(Boolean(addr.is_default_shipping));
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (state.status !== "authenticated") return;

    if (!address1.trim()) {
      setError("Street address is required.");
      return;
    }
    if (!city.trim()) {
      setError("City is required.");
      return;
    }
    if (!postalCode.trim()) {
      setError("Postal code is required.");
      return;
    }
    if (!phone.trim()) {
      setError("Phone number is required for delivery.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      first_name: firstName.trim() || null,
      last_name: lastName.trim() || null,
      company: company.trim() || null,
      address_1: address1.trim(),
      address_2: address2.trim() || null,
      city: city.trim(),
      province: province.trim() || null,
      postal_code: postalCode.trim(),
      country_code: countryCode.toLowerCase(),
      phone: phone.trim(),
      is_default_shipping: isDefaultShipping,
    };

    try {
      if (editingId) {
        await updateAddress(state.token, editingId, payload);
        setSuccess("Address updated successfully.");
      } else {
        await addAddress(state.token, payload);
        setSuccess("Address added successfully.");
      }
      resetForm();
      setFormOpen(false);
      await fetchAddresses();
      setTimeout(() => setSuccess(null), 3500);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to save shipping address."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(addressId: string) {
    if (state.status !== "authenticated") return;
    if (!window.confirm("Are you sure you want to remove this address?")) return;

    setDeletingId(addressId);
    setError(null);
    try {
      await deleteAddress(state.token, addressId);
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      setSuccess("Address removed.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to remove address."
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (state.status !== "authenticated") return null;

  return (
    <div className="space-y-6">
      {/* Header with action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h2 className="font-display text-2xl tracking-wide">
            Shipping Addresses
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Manage your delivery destinations and phone numbers for streamlined checkout.
          </p>
        </div>
        {!formOpen && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 border border-black bg-black px-5 py-2.5 text-xs uppercase tracking-widest text-white transition-colors hover:bg-neutral-800 shrink-0"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            <span>Add Address</span>
          </motion.button>
        )}
      </div>

      {/* Global alert feedback */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-3 text-xs tracking-wide"
          >
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add / Edit Form Modal/Drawer */}
      <AnimatePresence>
        {formOpen && (
          <motion.section
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
              <h3 className="font-display text-xl tracking-wide">
                {editingId ? "Edit Address" : "Add New Shipping Address"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                className="text-neutral-400 hover:text-black transition-colors"
                aria-label="Close form"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First name">
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    autoComplete="given-name"
                    className={inputCls()}
                  />
                </Field>
                <Field label="Last name">
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    autoComplete="family-name"
                    className={inputCls()}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company (Optional)">
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name"
                    autoComplete="organization"
                    className={inputCls()}
                  />
                </Field>
                <Field label="Phone number" required>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      autoComplete="tel"
                      className={inputCls("pl-10")}
                    />
                    <Phone
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
                      strokeWidth={1.5}
                    />
                  </div>
                </Field>
              </div>

              <Field label="Street address" required>
                <input
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  placeholder="House number and street name"
                  autoComplete="address-line1"
                  className={inputCls()}
                />
              </Field>

              <Field label="Apartment, suite, unit (Optional)">
                <input
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  autoComplete="address-line2"
                  className={inputCls()}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="City" required>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    autoComplete="address-level2"
                    className={inputCls()}
                  />
                </Field>
                <Field label="State / Province">
                  <input
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="State or Region"
                    autoComplete="address-level1"
                    className={inputCls()}
                  />
                </Field>
                <Field label="Postal code" required>
                  <input
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal code"
                    autoComplete="postal-code"
                    className={inputCls()}
                  />
                </Field>
              </div>

              <Field label="Country" required>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className={inputCls("bg-white cursor-pointer")}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code.toUpperCase()})
                    </option>
                  ))}
                </select>
              </Field>

              <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-neutral-700 pt-1">
                <input
                  type="checkbox"
                  checked={isDefaultShipping}
                  onChange={(e) => setIsDefaultShipping(e.target.checked)}
                  className="h-4 w-4 rounded-none border-neutral-300 text-black focus:ring-0 cursor-pointer"
                />
                <span>Set as default shipping address</span>
              </label>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-600"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3 pt-3">
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  disabled={saving}
                  className="flex items-center gap-2 border border-black bg-black px-7 py-3 text-xs uppercase tracking-widest text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {editingId ? "Update Address" : "Save Address"}
                </motion.button>
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    resetForm();
                  }}
                  className="border border-neutral-300 bg-white px-6 py-3 text-xs uppercase tracking-widest text-neutral-700 transition-colors hover:border-black hover:text-black"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
        </div>
      ) : addresses.length === 0 && !formOpen ? (
        /* Empty state */
        <div className="border border-dashed border-neutral-300 p-12 text-center flex flex-col items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 mb-4">
            <MapPin className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <h3 className="font-display text-xl tracking-wide mb-1">
            No shipping addresses saved
          </h3>
          <p className="text-sm text-neutral-500 max-w-sm mb-6">
            Add your primary shipping destination and phone number to expedite future orders.
          </p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={openCreate}
            className="inline-flex items-center gap-2 border border-black bg-black px-6 py-3 text-xs uppercase tracking-widest text-white transition-colors hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            <span>Add your first address</span>
          </motion.button>
        </div>
      ) : (
        /* Address cards grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const isDeleting = deletingId === addr.id;
            return (
              <motion.div
                key={addr.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "relative border p-6 flex flex-col justify-between transition-all",
                  addr.is_default_shipping
                    ? "border-black bg-white shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-400"
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm text-black">
                        {addr.first_name || addr.last_name
                          ? `${addr.first_name ?? ""} ${addr.last_name ?? ""}`.trim()
                          : "Recipient"}
                      </p>
                      {addr.is_default_shipping && (
                        <span className="bg-black text-white text-[10px] uppercase tracking-wider px-2 py-0.5 font-medium">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(addr)}
                        className="text-neutral-400 hover:text-black p-1 transition-colors"
                        aria-label="Edit address"
                        title="Edit address"
                      >
                        <Edit2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete(addr.id)}
                        className="text-neutral-400 hover:text-red-600 p-1 transition-colors disabled:opacity-50"
                        aria-label="Delete address"
                        title="Delete address"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>

                  {addr.company && (
                    <p className="text-xs text-neutral-500 mb-1">{addr.company}</p>
                  )}

                  <div className="text-sm text-neutral-600 space-y-0.5">
                    <p>{addr.address_1}</p>
                    {addr.address_2 && <p>{addr.address_2}</p>}
                    <p>
                      {addr.city}
                      {addr.province ? `, ${addr.province}` : ""}{" "}
                      {addr.postal_code}
                    </p>
                    <p className="uppercase text-xs tracking-wider text-neutral-400 pt-1">
                      {addr.country_code}
                    </p>
                  </div>
                </div>

                {/* Phone contact section */}
                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-700">
                  <Phone className="h-3.5 w-3.5 text-neutral-400 shrink-0" strokeWidth={1.5} />
                  {addr.phone ? (
                    <span>{addr.phone}</span>
                  ) : (
                    <span className="text-neutral-400 italic">No phone attached</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
