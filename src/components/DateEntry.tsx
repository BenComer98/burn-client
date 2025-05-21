import React, { useState } from 'react';

export interface DateEntryProps {
    selectDate: (date: Date) => void;
};

const DateEntry = (props: DateEntryProps) => {
  const [date, setDate] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    props.selectDate(new Date(date));
  };

  const handleChangeDate = (event: React.FormEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    if (event.currentTarget.value)
        setDate(event.currentTarget.value);
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Enter a Date</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            value={date}
            onChange={handleChangeDate}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Submit</button>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: 'white',
    cursor: 'pointer',
  },
};

export default DateEntry;
