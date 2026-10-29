type SectionHeadingProps = {
  number: string;
  title: string;
  id: string;
  className?: string;
};

export function SectionHeading({ number, title, id, className = "" }: SectionHeadingProps) {
  return (
    <div className={`section-heading ${className}`}>
      <span className="section-number" aria-hidden="true">{number}.</span>
      <h2 id={id}>
        {title}
        <svg className="section-underline" viewBox="0 0 210 13" fill="none" aria-hidden="true">
          <path d="M3 10C57 1 124 1 207 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </h2>
    </div>
  );
}
