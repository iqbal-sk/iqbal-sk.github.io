import React, { useEffect, useMemo, useState } from "react";

const GQL_ENDPOINT = "https://api.github.com/graphql";

function getISODate(d) {
  return d.toISOString();
}

function useContributionCalendar({ username, token, days = 30 }) {
  const [state, setState] = useState({ loading: true, error: null, data: null });
  useEffect(() => {
    let cancelled = false;
    async function run() {
      setState({ loading: true, error: null, data: null });
      if (!username) {
        setState({ loading: false, error: "Missing username", data: null });
        return;
      }
      if (!token) {
        setState({ loading: false, error: "Missing token", data: null });
        return;
      }
      try {
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - (days || 30));
        const query = `
          query($login: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $login) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                  weeks { contributionDays { date color contributionCount } }
                }
                totalCommitContributions
                totalIssueContributions
                totalPullRequestContributions
                totalPullRequestReviewContributions
              }
            }
          }
        `;
        const res = await fetch(GQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify({
            query,
            variables: { login: username, from: getISODate(from), to: getISODate(to) },
          }),
        });
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const json = await res.json();
        const cc = json?.data?.user?.contributionsCollection;
        if (!cancelled) setState({ loading: false, error: null, data: cc });
      } catch (e) {
        if (!cancelled) setState({ loading: false, error: e.message, data: null });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [username, token]);
  return state;
}

function useRecentEvents({ username, token, perPage = 6 }) {
  const [state, setState] = useState({ loading: true, error: null, events: [] });
  useEffect(() => {
    let cancelled = false;
    async function run() {
      setState({ loading: true, error: null, events: [] });
      if (!username) {
        setState({ loading: false, error: "Missing username", events: [] });
        return;
      }
      if (!token) {
        setState({ loading: false, error: "Missing token", events: [] });
        return;
      }
      try {
        const res = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/events?per_page=${perPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const json = await res.json();
        if (!cancelled) setState({ loading: false, error: null, events: json });
      } catch (e) {
        if (!cancelled) setState({ loading: false, error: e.message, events: [] });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [username, token, perPage]);
  return state;
}

function formatEvent(e) {
  const repo = e?.repo?.name;
  const when = new Date(e?.created_at).toLocaleDateString();
  switch (e?.type) {
    case "PushEvent":
      return { text: `Pushed commits to ${repo}`, when };
    case "PullRequestEvent": {
      const action = e?.payload?.action || "updated";
      return { text: `${action[0].toUpperCase() + action.slice(1)} a PR in ${repo}` , when};
    }
    case "IssuesEvent": {
      const action = e?.payload?.action || "updated";
      return { text: `${action[0].toUpperCase() + action.slice(1)} an issue in ${repo}`, when };
    }
    case "CreateEvent":
      return { text: `Created ${e?.payload?.ref_type} in ${repo}`, when };
    case "PullRequestReviewEvent":
      return { text: `Reviewed a PR in ${repo}`, when };
    default:
      return { text: `${e?.type?.replace(/Event$/, "")} in ${repo}`, when };
  }
}

export default function GitHubActivity({ username, days = 30, showTotals = true, showEvents = true, mini = false, className = "" }) {
  const user = username || import.meta.env.VITE_GITHUB_USERNAME || "iqbal-sk";
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  // Fetch contribution calendar limited to the last `days` days
  const { loading: l1, error: err1, data } = useContributionCalendar({ username: user, token, days });
  // Fetch recent events and filter client-side to `days`
  const { loading: l2, error: err2, events } = useRecentEvents({ username: user, token, perPage: 100 });

  const weeks = data?.contributionCalendar?.weeks || [];
  const totals = useMemo(() => {
    if (!data) return null;
    const c = data;
    return [
      { label: "Commits", value: c.totalCommitContributions },
      { label: "PRs", value: c.totalPullRequestContributions },
      { label: "Reviews", value: c.totalPullRequestReviewContributions },
      { label: "Issues", value: c.totalIssueContributions },
    ];
  }, [data]);

  // Filter events by last `days` window
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - days);
  const recentEvents = (events || []).filter((e) => {
    const t = new Date(e?.created_at);
    return t >= cutoff;
  }).slice(0, 8);

  const rootClass = mini ? className : `mb-10 ${className}`;
  return (
    <section className={rootClass}>
      {!mini && (
        <>
          <h3 className="text-xl font-semibold mb-1 text-[#33373f]">GitHub Activity</h3>
          <p className="text-sm text-gray-500 mb-4">Last {days} days</p>
        </>
      )}

      {/* Summary */}
      {showTotals && !mini && (
        <div className="mb-4 flex flex-wrap gap-3">
          {(l1 || !totals) ? (
            [1,2,3,4].map((i) => (
              <div key={i} className="animate-pulse h-8 w-24 rounded bg-gray-200" />
            ))
          ) : (
            totals.map((t) => (
              <div key={t.label} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 bg-white/70">
                <span className="font-semibold mr-1">{t.value}</span> {t.label}
              </div>
            ))
          )}
        </div>
      )}

      {/* Contribution calendar */}
      <div className={`${mini ? 'hidden md:block' : 'mb-6'}`}>
        {l1 ? (
          <div className="h-24 w-full animate-pulse rounded-2xl bg-gray-100" />
        ) : err1 ? (
          <p className="text-sm text-gray-500">Couldn’t load contribution calendar.</p>
        ) : (
          <div className="overflow-x-auto">
            <div
              className="inline-grid p-2 rounded-2xl border border-white/60 bg-white/55 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_1px_2px_rgba(15,23,42,0.03),0_12px_40px_-12px_rgba(15,23,42,0.18)] supports-[backdrop-filter]:backdrop-blur-2xl"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, ${mini ? 7 : 10}px)`,
                gap: mini ? 1 : 3,
              }}
            >
              {weeks.flatMap((w, wi) =>
                w.contributionDays.map((d, di) => (
                  <div
                    key={`${wi}-${di}`}
                    title={`${d.date}: ${d.contributionCount} contributions`}
                    className={mini ? 'w-[7px] h-[7px] rounded-[1px]' : 'w-[10px] h-[10px] rounded-[2px]'}
                    style={{ background: d.color || "#e5e7eb" }}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile-only summary chips when mini */}
      {mini && (
        <div className="md:hidden mb-2">
          {(l1 || !totals) ? (
            <div className="flex gap-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="animate-pulse h-6 w-20 rounded bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {totals.map((t) => (
                <span key={t.label} className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-700 bg-white/70">
                  <span className="font-semibold mr-1">{t.value}</span>{t.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent events */}
      {showEvents && !mini && (
        <div>
          <h4 className="text-md font-semibold mb-2 text-gray-700">Recent Activity</h4>
          {l2 ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse h-6 w-full rounded bg-gray-100" />
              ))}
            </div>
          ) : err2 ? (
            <p className="text-sm text-gray-500">Couldn’t load recent activity.</p>
          ) : (
            <ul className="space-y-1">
              {recentEvents.map((e, i) => {
                const f = formatEvent(e);
                const repoUrl = e?.repo?.name ? `https://github.com/${e.repo.name}` : undefined;
                return (
                  <li key={i} className="text-sm text-gray-700 flex items-center justify-between">
                    <span>{f.text}</span>
                    {repoUrl && (
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline ml-3 shrink-0"
                      >
                        View
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
