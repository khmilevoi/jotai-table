import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  </StrictMode>,
);
