import "./globals.css";

export const metadata = {
  title: "Kitch — Personal Meal Planning & Grocery Agent",
  description: "Generate custom macro-balanced weekly meal plans, track individual profile calories via camera plate logs, and automate grocery list checkouts via Blinkit MCP.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

