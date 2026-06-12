import { X } from 'lucide-react';

export default function UserDetailModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-card compact" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">{user.role === 'admin' ? 'Municipal Admin' : 'Citizen'}</p>
            <h2>{user.name}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} title="Close"><X size={19} /></button>
        </div>
        <div className="details-grid single">
          <div><strong>Email</strong><span>{user.email || 'Not available'}</span></div>
          <div><strong>Phone</strong><span>{user.phone || 'Not available'}</span></div>
          <div><strong>City</strong><span>{user.city || 'Bhopal'}</span></div>
          <div><strong>Area</strong><span>{user.area || 'Not provided'}</span></div>
          {user.role === 'citizen' && <div><strong>Reports Submitted</strong><span>{user.reportsSubmitted ?? 0}</span></div>}
          {user.role === 'citizen' && <div><strong>Contribution Points</strong><span>{user.points ?? 0}</span></div>}
        </div>
      </section>
    </div>
  );
}
