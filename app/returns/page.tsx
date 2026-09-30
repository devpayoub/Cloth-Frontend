import { PolicyPage } from "@/components/layout/PolicyPage";

export default function ReturnsPage() {
  return (
    <PolicyPage
      eyebrow="Help"
      title="Returns"
      description="Changed your mind? Return anything within 30 days."
      sections={[
        {
          title: "30-Day Returns",
          body: "You have 30 days from delivery to return any unworn piece with its original tags. Returns are free within the US — print the prepaid label from your account and drop the parcel at any carrier point.",
        },
        {
          title: "Exchanges",
          body: "Need a different size? Choose exchange when starting your return and we ship the replacement the day your parcel is scanned, so you're not waiting twice.",
        },
        {
          title: "Refunds",
          body: "Refunds are issued to the original payment method within 5 business days of the return arriving at our studio. Original shipping costs are refunded only when the item was faulty.",
        },
        {
          title: "Faulty Items",
          body: "Something arrived damaged or isn't as described? Contact us with a photo and your order number — we'll arrange a collection and send a replacement or a full refund, your choice.",
        },
      ]}
    />
  );
}
