import { useState } from "react";
import AppRouter from "./router/AppRouter";
function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* <Navbar /> */}
        <main className="flex-grow">
          <AppRouter />
        </main>
        {/* <Footer /> */}
      </div>
    </>
  );
}

export default App;
