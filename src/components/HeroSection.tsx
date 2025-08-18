// src/components/HeroSection.tsx
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="
        relative
        w-full max-w-6xl mx-auto
        grid grid-cols-1 md:grid-cols-2 items-center gap-8
        pt-12 pb-12 px-6
        mt-6 md:mt-10
        overflow-visible
      "
    >
      {/* ─────────────────────────────────────────────── Vector9 curve */}
      <Image
        src="/Vector 9.svg"
        alt=""
        width={600}
        height={400}
        className="absolute -top-23 -left-83 h-auto pointer-events-none z-0"
      />

      {/* ───────────────────────────────────────── Ellipse2 blur */}
      <Image
        src="/ellipse2.svg"
        alt=""
        width={419}
        height={419}
        className="absolute top-[231px] left-[151px] opacity-20 filter blur-[100px] -z-10"
      />

      {/* ─────────────────────────────────── LEFT COLUMN */}
      <div className="relative z-10 flex flex-col gap-6">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0AC909] leading-tight">
          Know Your Credit. <br />
          Empower Your Future.
        </h1>
        <p className="text-gray-500 max-w-md">
          Get instant insights into your credit score. Track, improve, and take
          control of your financial health.
        </p>

        <Link
          href="/survey"
          className="
            text-white py-4 px-20 rounded-full font-medium w-max
            bg-[radial-gradient(circle_at_center,_#62FF46,_#0AC909,_#2BB32A)]
            bg-[length:200%] bg-right
            transition-[background-position] duration-1000 ease-in-out
            hover:bg-left
            cursor-pointer
          "
        >
          Check My Score Now →
        </Link>
      </div>

      {/* ─────────────────────────────────── RIGHT COLUMN */}
      <div className="relative w-full flex justify-center md:justify-end overflow-visible">
        {/* shape đằng sau card */}
        <Image
          src="/shape-11.svg"
          alt=""
          width={520}
          height={520}
          className="absolute transform right-[60rem] md:right-[11rem] top-[8%] md:top-[60%] translate-y-[-45%] -z-10"
        />
        {/* credit card */}
        <Image
          src="/credit-card.svg"
          alt="Credit Card"
          width={600}
          height={384}
          className="absolute right-[0.7rem] top-1/2 -translate-y-[35%] rotate-6 z-20"
        />
      </div>

      <div className="h-[200px] w-full"></div>
    </section>
  );
}
