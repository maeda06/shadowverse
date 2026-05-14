import { Calendar, ExternalLink, Trophy, Sword } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EVENTS } from "@/lib/mock-data";
import type { Event } from "@/lib/types";

const EVENT_TYPE_LABELS: Record<Event["type"], string> = {
  grand_prix: "グランプリ",
  cup: "カップ戦",
  season: "シーズン",
  community: "コミュニティ",
  official: "公式大会",
};

const EVENT_TYPE_COLORS: Record<Event["type"], string> = {
  grand_prix: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  cup: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  season: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  community: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  official: "bg-red-500/20 text-red-400 border-red-500/30",
};

function EventCard({ event }: { event: Event }) {
  return (
    <Card className={`bg-card/50 overflow-hidden ${event.status === "ended" ? "opacity-60" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  event.status === "ongoing"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : event.status === "upcoming"
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                }`}
              >
                {event.status === "ongoing" ? "● 開催中" : event.status === "upcoming" ? "○ 予定" : "終了"}
              </span>
              <Badge variant="outline" className={`text-xs px-2 py-0 ${EVENT_TYPE_COLORS[event.type]}`}>
                {EVENT_TYPE_LABELS[event.type]}
              </Badge>
              {event.format && (
                <Badge variant="outline" className="text-xs px-2 py-0">
                  {event.format}
                </Badge>
              )}
            </div>

            <h3 className="font-semibold text-base mb-1">{event.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {event.startDate} 〜 {event.endDate}
              </span>
              {event.prizePool && (
                <span className="flex items-center gap-1">
                  <Trophy size={12} />
                  {event.prizePool}
                </span>
              )}
            </div>
          </div>

          {event.officialUrl && (
            <a
              href={event.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              公式 <ExternalLink size={12} />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function EventsPage() {
  const ongoing = EVENTS.filter((e) => e.status === "ongoing");
  const upcoming = EVENTS.filter((e) => e.status === "upcoming");
  const ended = EVENTS.filter((e) => e.status === "ended");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Calendar className="text-amber-400" size={22} /> イベント情報
        </h1>
        <p className="text-sm text-muted-foreground">公式イベント・コミュニティ大会の開催情報をまとめています</p>
      </div>

      {ongoing.length > 0 && (
        <section>
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            開催中のイベント
          </h2>
          <div className="space-y-3">
            {ongoing.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Sword size={16} className="text-blue-400" />
            予定されているイベント
          </h2>
          <div className="space-y-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {ended.length > 0 && (
        <section>
          <h2 className="text-base font-semibold mb-3 text-muted-foreground">終了したイベント</h2>
          <div className="space-y-3">
            {ended.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
