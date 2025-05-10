import React from "react";
import styles from "./ContactBox.module.css";

const ContactBox = ({ title, emails = [], phoneNumbers = [], logo }) => {
  return (
    <div className={styles.message}>
      <div className={styles.logo}>
        <i className={logo}></i>
      </div>
      <h4>{title}</h4>
      <span>
        {emails.length > 0 &&
          emails.map((email, index) => (
            <React.Fragment key={index}>
              <a href={`mailto:${email}`}>{email}</a>
              {index < emails.length - 1 && <br />}
            </React.Fragment>
          ))}

        {phoneNumbers.length > 0 &&
          phoneNumbers.map((phone, index) => (
            <React.Fragment key={index}>
              <a href={`tel:${phone}`}>{phone}</a>
              {index < phoneNumbers.length - 1 && <br />}
            </React.Fragment>
          ))}
      </span>
    </div>
  );
};

export default ContactBox;
