import { useEffect } from 'react';
import { feedback } from '../lib/feedback';

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    feedback.warn();
  }, []);

  function handleConfirm() {
    feedback.error();
    onConfirm();
  }

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="modal-box" role="alertdialog" aria-modal="true" aria-labelledby="confirm-modal-title">
        <span className="modal-box-icon" aria-hidden="true">
          <i className="ti ti-alert-triangle" />
        </span>
        <h3 id="confirm-modal-title">{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="modal-btn-cancel" onClick={onCancel}>{cancelLabel}</button>
          <button className="modal-btn-confirm" onClick={handleConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
