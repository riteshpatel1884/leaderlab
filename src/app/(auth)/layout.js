export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        backgroundColor: "#111827",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {children}
    </div>
  );
}
