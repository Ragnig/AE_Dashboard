/* -------------------- STYLES -------------------- */
const styles = {
  container: { 
    display: "flex",
    width: 1920,
    flexDirection: "column",
    alignItems: "center",
    gap: 24,
    background: "#F5F5F5",
    margin: "0 auto", 
    padding: 12, 
    fontFamily: "Segoe UI", 
    boxSizing: "border-box" 
  },
  header: {
    width: 1200,
    color: "#616161",
    padding: "14px 12px",
    borderRadius: 8,
    fontWeight: 350,
    fontSize: 32,
    marginBottom: 12,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  overviewCard: { 
    width: 1200,
    background: "#ffffff",
    borderRadius: 4,
    border: "1px solid #D1D1D1",
    boxShadow: "0 1px 6px rgba(16,24,40,0.06)",
    padding: 24,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
 
  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: 12,
    alignItems: "start",
    minHeight: 64,
  },
 
  overviewLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
    display: "inline-block",
    minWidth: 120,
  },
  overviewValue: {
    fontSize: 13,
    color: "#111827",
    fontWeight: 600,
    display: "inline-block",
    marginLeft: 8,
  },
  overviewLink: {
    color: "#465485",
    textDecoration: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
 
  overviewDateInput: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    background: "#fff",
    fontSize: 13,
    marginLeft: 8,
  },
 
  memberRoleInput: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    fontSize: 13,
    marginLeft: 8,
    width: "60%",
  },
 
  panel: {
    display: "flex",
    width: 1200,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 24,
    background: "#ffffff",
    borderRadius: 4,
    border: "1px solid #D1D1D1",
    boxShadow: "0 1px 6px rgba(16,24,40,0.06)",
    boxSizing: "border-box",
  },
 
  input: { width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db", boxSizing: "border-box" },
 
  // left nav (unchanged)
  leftNav: {
    display: "flex",
    width: 240,
    height: 462,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 0,
    background: "transparent",
    padding: 0,
    borderRadius: 0,
    boxShadow: "none",
    overflow: "auto",
    borderRight: "none",
    boxSizing: "border-box",
  },
 
  sectionListTitle: {
    fontSize: 16,
    color: "#111827",
    padding: "16px 0 8px 0",
    marginBottom: 0,
    fontWeight: 600,
  },
 
  leftBtn: (active) => ({
    display: "flex",
    width: "100%",
    textAlign: "left",
    fontFamily: "Segoe UI",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "8px 0 8px 12px",
    paddingRight: 12,
    borderRadius: 0,
    border: "none",
    borderRight: active ? "4px solid #636F9E" : "none",
    background: active ? "#E8EAF6" : "transparent",
    color: active ? "#111827" : "#374151",
    fontWeight: 400,
    marginBottom: 0,
    cursor: "pointer",
    boxSizing: "border-box",
  }),
 
  leftBtnText: {
    display: "block",
    whiteSpace: "normal",
    wordBreak: "break-word",
    lineHeight: 1.25,
    fontSize: 14,
  },
 
  pageHeight: 1040,
 
  // RIGHT PANEL: padding left/right set to 24px so content sits 24px from container edges
  rightCard: (pageHeight) => ({
    display: "flex",
    width: 884,
    height: 802,
    minHeight: 802,
    maxHeight: 802,
    padding: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
    borderRadius: "0 0 4px 4px",
    background: "#fff",
    boxSizing: "border-box",
    fontFamily: "Segoe UI",
    overflow: "auto",
  }),
 
  badgeRail: {
    display: "flex",
    gap: 0,
    padding: "6px 4px",
    marginBottom: 8,
    alignItems: "center",
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
    overflowX: "visible",
  },
 
  badge: (active, saved, incomplete = false) => {
    const base = {
      width: 32,
      height: 32,
      minWidth: 32,
      borderRadius: 16,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "2px solid",
      cursor: "pointer",
      flex: "0 0 auto",
      fontSize: 12,
      boxSizing: "border-box",
      margin: 0,
      transition: "all 0.2s ease",
      position: "relative",
      fontFamily: "Segoe UI",
      fontWeight: 600,
    };
    if (active) return { ...base, background: "#5b6a9a", color: "#fff", borderColor: "#5b6a9a" };
    if (incomplete) return { ...base, background: "#fef2f2", color: "#dc2626", borderColor: "#fca5a5" }; // Red for incomplete
    if (saved) return { ...base, background: "#e8f4ea", color: "#166534", borderColor: "#86efac" };
    return { ...base, background: "#f3f4f6", color: "#374151", borderColor: "#e5e7eb" };
  },
 
  connector: {
    flex: "0 0 16px",
    width: 16,
    height: 1,
    background: "#d1d5db",
    alignSelf: "center",
    borderRadius: 0,
    margin: 0,
    boxSizing: "border-box",
  },
 
  // QUESTION CARD wrapper (use this to create the bordered container for question and options)
  questionCard: {
    borderRadius: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    border: "1px solid #D1D1D1",
    background: "#fff",
    overflow: "hidden",
    marginBottom: 12,
    boxSizing: "border-box",
  },
 
  // Header bar of the question container; left/right padding matches rightCard (24px)
  qHeader: {
    background: "#636F9E",
    color: "#fff",
    padding: "12px 24px",
    fontWeight: 400,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    fontFamily: "Segoe UI",
    fontSize: 20,
    lineHeight: "26px",
    display: "flex",
    alignItems: "center",
  },
 
  // qInner padding is set to 24px so option boxes sit 24px away from container edges
  qInner: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    boxSizing: "border-box",
    background: "#fff",
  },
 
  // Option row is a box (as in figma)
  optionRow: (checked) => ({
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: 12,
    borderRadius: 6,
    border: "1px solid",
    borderColor: checked ? "#c7d2fe" : "#e5e7eb",
    background: checked ? "#eef2ff" : "#fff",
    cursor: "pointer",
    marginBottom: 0,
    width: "100%",
    boxSizing: "border-box",
    minHeight: 52,
  }),
 
  // Plain numeric label (no box) like "0" "1" "2"
  optionNumber: (hasNumber, checked) => ({
    width: 28,
    minWidth: 28,
    textAlign: "right",
    color: checked ? "#111827" : "#374151",
    fontWeight: 700,
    fontSize: 14,
    lineHeight: "20px",
    alignSelf: "center",
    marginRight: 8,
  }),
 
  visibleRadio: {
    width: 18,
    height: 18,
    marginTop: 0,
    marginRight: 8,
    cursor: "pointer",
    accentColor: "#636F9E",
    alignSelf: "center",
  },
 
  optionBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    color: "#111827",
    fontSize: 13,
  },
 
  describeArea: { width: "100%", minHeight: 130, maxHeight: 320, padding: 12, borderRadius: 6, border: "1px solid #d1d5db", boxSizing: "border-box", resize: "vertical", fontFamily: "Segoe UI" },
 
  // footer area removed from outer panel - we'll render Save/Submit inside the questionCard
  pageFooter: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: -14, flexShrink: 0 },
  pageSaveRow: { display: "flex", justifyContent: "center", gap: 12, alignItems: "center", flex: "0 0 auto" },
  bottomNav: { display: "flex", justifyContent: "flex-end", gap: 8, alignItems: "center", width: "100%" },
  btn: { padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer" },
  btnPrimary: { padding: "10px 14px", borderRadius: 8, border: "1px solid #636F9E", background: "#636F9E", color: "#fff", cursor: "pointer" },
  disabledBtn: { opacity: 0.5, cursor: "not-allowed" },
 
  sectionBadge: (completed, incomplete = false) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    borderRadius: 10,
    background: completed ? "#16a34a" : incomplete ? "#dc2626" : "transparent", // Red for incomplete
    color: completed ? "#fff" : incomplete ? "#fff" : "#9ca3af",
    border: completed || incomplete ? "none" : "1px solid transparent",
    fontSize: 12,
    fontWeight: 700,
    marginRight: 8,
    flex: "0 0 auto",
  }),
 
  // Confirmation modal styles
  confirmOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  confirmBox: {
    width: 420,
    maxWidth: "90%",
    background: "#fff",
    borderRadius: 8,
    padding: 20,
    boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
    boxSizing: "border-box",
  },
  confirmButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },
};
 
 
export default styles;