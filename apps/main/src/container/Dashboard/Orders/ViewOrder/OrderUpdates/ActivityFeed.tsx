import { FeedItem } from "./FeedItem";
import { FeedAvatar } from "./FeedAvatar";

function ActivityFeed({ items }: Readonly<{ items: FeedItem[] }>) {
  return (
    <div className="flex flex-col py-2">
      {items.map((item, idx) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <FeedAvatar
              initials={item.initials}
              type={item.type}
              imageUrl={item.imageUrl}
            />
            {!item.isLast && idx < items.length - 1 && (
              <div
                className="w-0.5 flex-1 bg-[#e9eaeb]"
                style={{ minHeight: 24 }}
              />
            )}
          </div>

          <div className="flex-1 pb-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[#414651]">
                  {item.title}
                </p>
                {item.showUnreadDot && (
                  <span className="size-2 rounded-full bg-[#17b26a]" />
                )}
              </div>
            </div>
            <p className="text-xs text-[#535862]">{item.time}</p>

            {(item.description || item.action) && (
              <p className="mt-1 text-sm text-[#535862]">
                {item.description || item.action}
                {item.highlight && (
                  <span className="font-medium text-[#0948b5]">
                    {" "}
                    {item.highlight}
                  </span>
                )}
                {item.description2 && ` ${item.description2}`}
              </p>
            )}

            {item.message && (
              <div className="mt-2 rounded-tr-lg rounded-b-lg border border-[#e9eaeb] px-3 py-2 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]">
                <p className="text-sm text-[#535862]">{item.message}</p>
              </div>
            )}

            {item.attachment && (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#e9eaeb] px-3 py-2">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e7f0ff]">
                  <span className="text-xs font-bold text-[#0948b5]">
                    {(item.attachment.extension || "ZIP").toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#344054]">
                    {item.attachment.name}
                  </p>
                  <p className="text-xs text-[#717680]">
                    {item.attachment.size}
                  </p>
                </div>
              </div>
            )}

            {item.badge && (
              <span
                className={`mt-2 inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${item.badge.style}`}
              >
                {item.badge.label}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export { ActivityFeed };
