import { useEffect } from "react";

const OAuth2Callback = () => {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      fetch('/api/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      .then(res => res.json())
      .then(data => {
        console.log("Access token:", data.access_token);
        // Redirect or store token if needed
      });
    }
  }, []);

  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-semibold">Connecting your Google Account...</h2>
    </div>
  );
};

export default OAuth2Callback;