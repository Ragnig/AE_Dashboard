import React from "react";

const ReviewScreen = ({ onBack, onSubmit, isSaving }) => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      padding: 48,
      height: "100%",
      width: "100%",
      textAlign: "left",
      boxSizing: "border-box",
    },
    title: {
      fontSize: 24,
      fontWeight: 400,
      color: "#111827",
      marginBottom: 24,
    },
    message: {
      fontSize: 14,
      color: "#616161",
      lineHeight: 1.6,
      marginBottom: 32,
    },
    buttonGroup: {
      display: "flex",
      gap: 12,
      justifyContent: "flex-end",
      width: "100%",
    },
    buttonSecondary: {
      padding: "10px 24px",
      borderRadius: 4,
      border: "1px solid #D1D1D1",
      background: "#fff",
      color: "#111827",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "Segoe UI",
    },
    buttonPrimary: {
      padding: "10px 24px",
      borderRadius: 4,
      border: "none",
      background: "#636F9E",
      color: "#fff",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "Segoe UI",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>One last step...</h1>
      
      <p style={styles.message}>
        You've completed filling in the form.
        <br /><br />
        If you are comfortable with your entries, please click the "Submit" button to<br />
        complete the process.
      </p>

      <div style={styles.buttonGroup}>
        <button style={styles.buttonSecondary} onClick={onBack} disabled={isSaving}>
          Review or update your entries
        </button>
        <button style={styles.buttonPrimary} onClick={onSubmit} disabled={isSaving}>
          {isSaving ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default ReviewScreen;
