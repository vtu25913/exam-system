import React from 'react';
export default function Spinner({ text = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary mb-2" role="status" />
      <small className="text-muted">{text}</small>
    </div>
  );
}
