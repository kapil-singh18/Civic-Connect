import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LocateFixed, Send } from 'lucide-react';
import api from '../../services/api.js';
import { categories, priorities } from '../../utils/constants.js';

export default function ReportIssue() {
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: {
      priority: 'Medium',
      latitude: 23.2599,
      longitude: 77.4126,
      address: 'Bhopal, Madhya Pradesh'
    }
  });

  function useCurrentLocation() {
    navigator.geolocation?.getCurrentPosition((position) => {
      setValue('latitude', position.coords.latitude);
      setValue('longitude', position.coords.longitude);
      setMessage('GPS location captured.');
    });
  }

  async function onSubmit(values) {
    const payload = {
      title: values.title,
      description: values.description,
      category: values.category,
      priority: values.priority,
      imageUrl: values.imageUrl,
      location: {
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
        address: values.address
      }
    };
    const { data } = await api.post('/issues', payload);
    navigate(`/citizen/issues/${data._id}`);
  }

  return (
    <section className="section-band narrow">
      <div className="section-header">
        <div>
          <p className="eyebrow">Citizen Report</p>
          <h2>Report New Issue</h2>
        </div>
      </div>
      <form className="grid-form" onSubmit={handleSubmit(onSubmit)}>
        <label>Issue Title<input {...register('title', { required: true })} /></label>
        <label>Category<select {...register('category', { required: true })}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="full-span">Description<textarea rows="5" {...register('description', { required: true })} /></label>
        <label>Priority<select {...register('priority')}>{priorities.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Image URL<input {...register('imageUrl')} onChange={(event) => setPreview(event.target.value)} placeholder="https://..." /></label>
        <label>Latitude<input type="number" step="any" {...register('latitude', { required: true })} /></label>
        <label>Longitude<input type="number" step="any" {...register('longitude', { required: true })} /></label>
        <label className="full-span">Address<input {...register('address', { required: true })} /></label>
        {preview && <img className="image-preview" src={preview} alt="Issue preview" />}
        {message && <p className="form-success">{message}</p>}
        <div className="form-actions full-span">
          <button className="secondary-button" type="button" onClick={useCurrentLocation}><LocateFixed size={17} /> GPS Location</button>
          <button className="primary-button" type="submit" disabled={isSubmitting}><Send size={17} /> Submit Report</button>
        </div>
      </form>
    </section>
  );
}
