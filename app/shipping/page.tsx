import { PolicyPage } from "@/components/layout/PolicyPage";

export default function ShippingPage() {
  return (
    <PolicyPage
      eyebrow="Help"
      title="Shipping"
      description="Where we deliver, how fast, and what it costs."
      sections={[
        {
          title: "Delivery Times",
          body: "Orders placed before 14:00 ship the same business day. Standard delivery takes 3–5 business days within the US; express delivery arrives in 1–2 business days. International orders arrive within 7–14 business days.",
        },
        {
          title: "Shipping Rates",
          body: "Standard shipping is $8, and free on all orders over $150. Express shipping is a flat $20. International rates are calculated at checkout based on destination and weight.",
        },
        {
          title: "Order Tracking",
          body: "The moment your order ships you receive a tracking link by email. You can also find it any time under your account, alongside the full order history.",
        },
        {
          title: "Packaging",
          body: "Every order ships in recycled, plastic-free packaging. Garments are folded, wrapped in tissue, and sealed — ready to be gifted as-is.",
        },
      ]}
    />
  );
}
