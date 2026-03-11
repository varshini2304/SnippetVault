import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-[var(--bg-secondary)] lg:flex lg:flex-col">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E\")",
            }}
          />
          <div className="relative z-10 flex h-full flex-col justify-between px-12 py-12">
            <div>
              <div className="font-display text-4xl font-bold text-[var(--text-primary)]">SnippetVault</div>
              <p className="mt-3 max-w-md text-base text-[var(--text-secondary)]">
                Save, share, and showcase your code.
              </p>
            </div>

            <div className="relative mt-12 flex flex-1 items-center">
              <div className="grid w-full gap-6">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/80 p-4 shadow-[0_0_30px_rgba(0,0,0,0.25)]"
                    style={{
                      transform: `rotate(${idx === 0 ? -4 : idx === 1 ? 0 : 4}deg)`,
                      animation: `float 3s ease-in-out ${idx * 0.4}s infinite`,
                    }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                        typescript
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)]">2 mins ago</span>
                    </div>
                    <div className="rounded-lg bg-[var(--syntax-bg)] p-3 font-code text-xs text-[var(--text-secondary)]">
                      <p>export const debounce = (fn, d = 300) =&gt; &#123;</p>
                      <p className="opacity-80">  let t;</p>
                      <p className="opacity-80">  return (...args) =&gt; &#123;</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="h-8 w-8 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)]"
                  />
                ))}
              </div>
              <span>Trusted by 10,000+ developers</span>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  )
}
