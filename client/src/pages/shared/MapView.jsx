import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useOutletContext } from 'react-router-dom';
import Badge from '../../components/Badge.jsx';
import api from '../../services/api.js';
import { priorityClass } from '../../utils/constants.js';

const bhopalCenter = [23.2599, 77.4126];

function markerIcon(issue) {
  const color = issue.status === 'Resolved' ? '#2E7D32' : issue.priority === 'High' || issue.priority === 'Critical' ? '#F44336' : issue.status === 'In Progress' ? '#FF9800' : '#607D8B';
  return L.divIcon({
    className: 'issue-marker',
    html: `<span style="background:${color}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
}

export default function MapView() {
  const { openIssue } = useOutletContext();
  const issues = useQuery({ queryKey: ['map-issues'], queryFn: async () => (await api.get('/issues')).data });
  const rows = issues.data || [];
  const center = rows[0] ? [rows[0].location.latitude, rows[0].location.longitude] : bhopalCenter;

  return (
    <section className="map-page">
      <div className="section-header map-header">
        <div>
          <p className="eyebrow">Live City Map</p>
          <h2>Issue Map Monitoring</h2>
        </div>
        <div className="map-legend">
          <span><i className="red" />High</span><span><i className="orange" />In Progress</span><span><i className="green" />Resolved</span><span><i className="gray" />Pending</span>
        </div>
      </div>
      <MapContainer className="map-canvas" center={center} zoom={12} scrollWheelZoom>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {rows.map((issue) => (
          <Marker key={issue._id} position={[issue.location.latitude, issue.location.longitude]} icon={markerIcon(issue)}>
            <Popup>
              <div className="map-popup">
                <h3>{issue.title}</h3>
                <p>{issue.category}</p>
                <Badge className={priorityClass(issue.priority)}>{issue.priority}</Badge>
                <p>{issue.status}</p>
                <small>{new Date(issue.createdAt).toLocaleDateString()}</small>
                <button type="button" onClick={() => openIssue(issue._id)}>View Details</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
}
