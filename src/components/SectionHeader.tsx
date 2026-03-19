export default function SectionHeader({
  num,
  label,
}: {
  num: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-5 mb-10">
      <span className="text-base text-[#b14a32] font-medium font-playfair">
        {num}
      </span>
      <div className="flex-1 border-t border-[#e2ddd6]" />
      <span className="text-xs tracking-[0.18em] uppercase text-[#7a7470]">
        {label}
      </span>
    </div>
  );
}
