import React from "react";
import { Checkmark24Filled } from "@fluentui/react-icons";
 
const SubmitSuccessScreen = ({ onClose }) => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      gap: 24,
      padding: 48,
      height: "100%",
      width: "100%",
      boxSizing: "border-box",
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      background: "#16a34a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
    },
    title: {
      fontSize: 24,
      fontWeight: 400,
      color: "#111827",
      margin: 0,
    },
    message: {
      fontSize: 14,
      color: "#616161",
      textAlign: "left",
      lineHeight: 1.6,
      maxWidth: 450,
    },
    buttonWrapper: {
      display: "flex",
      justifyContent: "flex-end",
      width: "100%",
      marginTop: 8,
    },
    button: {
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
<div style={styles.iconContainer}>
<Checkmark24Filled style={{ width: 32, height: 32 }} />
</div>
 
      <h2 style={styles.title}>Thank you!</h2>
 
      <p style={styles.message}>
        Your Child and Adolescent Needs and Strengths (CANS) assessment form has been submitted.
</p>
 
      <div style={styles.buttonWrapper}>
<button style={styles.button} onClick={onClose}>
          Return to the Dashboard
</button>
</div>
</div>
  );
};
 
export default SubmitSuccessScreen;