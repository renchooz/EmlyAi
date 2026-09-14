const ITEMS = [
  "184k applications sent",
  "18 minutes saved each",
  "3.2× more replies",
  "40 seconds per send",
];

function Row({ ariaHidden }) {
  return (
    <div className="flex items-center gap-11" aria-hidden={ariaHidden}>
      {ITEMS.map((item) => (
        <div key={item} className="flex items-center gap-11">
          <span
            className="text-[26px] font-light"
            style={{ fontFamily: "var(--el-font-display)", letterSpacing: "-0.03em" }}
          >
            {item}
          </span>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--el-grey-300)" }} />
        </div>
      ))}
    </div>
  );
}

export function StatsMarquee() {
  return (
    <section
      className="overflow-hidden py-8"
      style={{ background: "var(--el-white)", borderTop: "1px solid var(--el-border)", borderBottom: "1px solid var(--el-border)" }}
    >
      <div className="flex w-max items-center gap-11" style={{ animation: "el-track 32s linear infinite" }}>
        <Row />
        <Row ariaHidden="true" />
      </div>
    </section>
  );
}
