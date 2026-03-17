export default function Footer() {
  return (
    <footer
      className="px-6 py-8"
      style={{ borderTop: '1px solid hsl(var(--border))' }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p
          className="text-sm"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: 'hsl(var(--muted))',
          }}
        >
          JOT · The notes app that deletes your notes.
        </p>
        <div className="flex gap-6">
          {['Privacy', 'Terms', 'Twitter'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm transition-colors hover:text-white"
              style={{ color: 'hsl(var(--muted))' }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
