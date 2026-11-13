import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function UntitledIcon({
  children,
  color = "currentColor",
  size = 24,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function Hourglass02(props: IconProps) {
  return (
    <UntitledIcon {...props}>
      <path d="M18.163 2H5.837A.837.837 0 0 0 5 2.837a10.05 10.05 0 0 0 2.943 7.106l1.22 1.22c.12.12.181.181.224.24a1 1 0 0 1 0 1.195 2.508 2.508 0 0 1-.224.24l-1.22 1.219A10.05 10.05 0 0 0 5 21.163c0 .462.375.837.837.837h12.326a.837.837 0 0 0 .837-.837 10.05 10.05 0 0 0-2.943-7.106l-1.22-1.22c-.12-.12-.181-.181-.224-.24a1 1 0 0 1 0-1.195c.043-.058.103-.118.224-.24l1.22-1.219A10.05 10.05 0 0 0 19 2.837.837.837 0 0 0 18.163 2Z" />
    </UntitledIcon>
  );
}

export function Star01(props: IconProps) {
  return (
    <UntitledIcon {...props}>
      <path d="M11.283 3.453c.23-.467.345-.7.502-.775a.5.5 0 0 1 .43 0c.157.075.272.308.502.775l2.187 4.43c.068.138.102.207.152.26a.502.502 0 0 0 .155.114c.067.03.143.042.295.064l4.891.715c.515.075.773.113.892.238a.5.5 0 0 1 .133.41c-.023.172-.21.353-.582.716l-3.54 3.446c-.11.108-.165.162-.2.226a.5.5 0 0 0-.06.183c-.009.072.004.148.03.3l.835 4.867c.088.514.132.77.05.922a.5.5 0 0 1-.349.253c-.17.032-.4-.09-.862-.332l-4.373-2.3c-.136-.07-.204-.107-.276-.12a.498.498 0 0 0-.192 0c-.072.013-.14.05-.276.12l-4.373 2.3c-.461.243-.692.364-.862.332a.5.5 0 0 1-.348-.253c-.083-.152-.039-.409.05-.922l.834-4.867c.026-.152.039-.228.03-.3a.5.5 0 0 0-.06-.184c-.035-.063-.09-.117-.2-.225L3.16 10.4c-.373-.363-.56-.544-.582-.716a.5.5 0 0 1 .132-.41c.12-.125.377-.163.892-.238l4.891-.715c.152-.022.228-.034.295-.064a.5.5 0 0 0 .155-.113c.05-.054.084-.123.152-.26l2.187-4.43Z" />
    </UntitledIcon>
  );
}

export function CheckCircle(props: IconProps) {
  return (
    <UntitledIcon {...props}>
      <path d="m7.5 12 3 3 6-6m5.5 3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" />
    </UntitledIcon>
  );
}

export function XClose(props: IconProps) {
  return (
    <UntitledIcon {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </UntitledIcon>
  );
}

export function GitBranch02(props: IconProps) {
  return (
    <UntitledIcon {...props}>
      <path d="M6 3v12m0 0a3 3 0 1 0 3 3m-3-3a3 3 0 0 1 3 3m9-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0a9 9 0 0 1-9 9" />
    </UntitledIcon>
  );
}

export function Hourglass03(props: IconProps) {
  return (
    <UntitledIcon {...props}>
      <path d="M9 18.5h6M6.6 2h10.8c.56 0 .84 0 1.054.109a1 1 0 0 1 .437.437C19 2.76 19 3.04 19 3.6v2.075c0 .489 0 .733-.055.963-.05.205-.13.4-.24.579-.123.201-.296.374-.642.72L15.13 10.87c-.396.396-.594.594-.668.822a1 1 0 0 0 0 .618c.074.228.272.426.668.822l2.932 2.932c.346.346.519.519.642.72.11.18.19.374.24.578.055.23.055.475.055.965V20.4c0 .56 0 .84-.109 1.054a1 1 0 0 1-.437.437C18.24 22 17.96 22 17.4 22H6.6c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C5 21.24 5 20.96 5 20.4v-2.074c0-.49 0-.734.055-.965.05-.204.13-.399.24-.578.123-.201.296-.374.642-.72L8.87 13.13c.396-.396.594-.594.668-.822a1 1 0 0 0 0-.618c-.074-.228-.272-.426-.668-.822L5.937 7.937c-.346-.346-.519-.519-.642-.72a2 2 0 0 1-.24-.579C5 6.408 5 6.164 5 5.675V3.6c0-.56 0-.84.109-1.054a1 1 0 0 1 .437-.437C5.76 2 6.04 2 6.6 2Z" />
    </UntitledIcon>
  );
}

export function RefreshCw03(props: IconProps) {
  return (
    <UntitledIcon {...props}>
      <path d="M14 22s.85-.121 4.364-3.636A9 9 0 0 0 14 3.224M14 22h6m-6 0v-6M10 2s-.85.122-4.364 3.636A9 9 0 0 0 10 20.776M10 2H4m6 0v6" />
    </UntitledIcon>
  );
}

export function XCircle(props: IconProps) {
  return (
    <UntitledIcon {...props}>
      <path d="m15 9-6 6m0-6 6 6m7-3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" />
    </UntitledIcon>
  );
}

export function SlashCircle01(props: IconProps) {
  return (
    <UntitledIcon {...props}>
      <path d="m4.93 4.93 14.14 14.14M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" />
    </UntitledIcon>
  );
}

export function Repeat04(props: IconProps) {
  return (
    <UntitledIcon {...props}>
      <path d="M12 20.5a8.5 8.5 0 0 0 5-15.375M13 22.4l-2-2 2-2M12 3.5a8.5 8.5 0 0 0-5 15.375M11 5.6l2-2-2-2" />
    </UntitledIcon>
  );
}
