/**
 * BirthdayCoupons.tsx — Interactive Birthday VIP Passes & Vouchers
 * Thoughtful, fun, and tangible passes she can unlock and redeem.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import Confetti from "../ui/Confetti";
import { config } from "../../config/content";

export default function BirthdayCoupons() {
  const [redeemed, setRedeemed] = useState<Record<string, boolean>>({});
  const [activeConfetti, setActiveConfetti] = useState(false);

  const handleRedeem = (id: string) => {
    setRedeemed((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    if (!redeemed[id]) {
      setActiveConfetti(true);
      setTimeout(() => setActiveConfetti(false), 1500);
    }
  };

  return (
    <section
      id="coupons"
      className="py-20 md:py-28 px-6 bg-[#FAF7F2] relative overflow-hidden"
    >
      <Confetti active={activeConfetti} count={25} originX={50} originY={50} />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-200/60 mb-3">
            VIP Birthday Perks 🎟️
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-800">
            Exclusive Birthday Passes
          </h2>
          <p className="font-sans text-stone-600 text-sm md:text-base max-w-md mx-auto mt-2">
            Non-expiring vouchers redeemable whenever you choose. Tap to unlock your voucher code.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.coupons.map((coupon, index) => {
            const isClaimed = !!redeemed[coupon.id];

            return (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-6 transition-all duration-300 border ${
                  isClaimed
                    ? "bg-amber-50/90 border-amber-300/80 shadow-md ring-2 ring-amber-300/40"
                    : "bg-white/80 border-stone-200 shadow-sm hover:shadow-md hover:border-amber-200"
                }`}
              >
                {/* Top header with icon and tag */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100/70 border border-amber-200/50 flex items-center justify-center text-2xl shadow-xs">
                    {coupon.icon}
                  </div>
                  <span
                    className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md font-semibold ${
                      isClaimed
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {isClaimed ? "✓ CLAIMED" : "UNCLAIMED"}
                  </span>
                </div>

                {/* Voucher title & desc */}
                <h3 className="font-serif text-lg font-bold text-stone-800 mb-2">
                  {coupon.title}
                </h3>
                <p className="font-sans text-stone-600 text-sm leading-relaxed mb-6">
                  {coupon.description}
                </p>

                {/* Voucher Ticket Footer */}
                <div className="pt-4 border-t border-dashed border-stone-200 flex items-center justify-between">
                  <div className="font-mono text-xs text-stone-400 tracking-wider">
                    {coupon.code}
                  </div>

                  <button
                    onClick={() => handleRedeem(coupon.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
                      isClaimed
                        ? "bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300"
                        : "bg-stone-900 text-amber-50 border-stone-900 hover:bg-amber-800 hover:border-amber-800 shadow-xs"
                    }`}
                  >
                    {isClaimed ? "Mark as Pending" : "Claim Pass"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
