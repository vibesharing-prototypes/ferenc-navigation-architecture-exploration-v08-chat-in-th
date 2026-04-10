import "./globals.css";

export const metadata = {
  title: "Navigation architecture exploration V08 - Chat in the middle panel",
  description: "Prototype deployed via VibeSharing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://vibesharing.app/vs-sdk.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
