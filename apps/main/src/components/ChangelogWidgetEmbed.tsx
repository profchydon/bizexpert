import {
  CHANGELOG_IFRAME_SRC,
  changelogIframeClassName,
} from "./changelogWidgetEmbedStyles";

type Props = {
  className?: string;
};

export function ChangelogWidgetEmbed({ className }: Readonly<Props>) {
  return (
    <iframe
      title="Changelog"
      src={CHANGELOG_IFRAME_SRC}
      className={changelogIframeClassName(className)}
    />
  );
}
