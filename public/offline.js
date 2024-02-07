var OfflinePage = function OfflinePage() {
  return React.createElement(
    "div",
    {
      style: {
        maxHeight: "100vh",
        display: "grid",
        placeItems: "center",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        },
      },
      React.createElement("h4", null, "لطفا دسترسی اینترنت خود را چک کنید")
    )
  );
};

export default OfflinePage;
