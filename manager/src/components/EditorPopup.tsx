import { useState, useEffect } from 'react';
import './EditorPopup.css'; // optional, for styling similar to ManagerLayout.css

interface EditorPopupProps<T> {
  open: boolean;
  onClose: () => void;
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  title: string;
}

export function EditorPopup<T extends { id: number; name: string }>(
  { open, onClose, data, setData, title }: EditorPopupProps<T>
) {
  const [searchTerm, setSearchTerm] = useState('');
  const selected = data.find(
    (item) => item.name.toLowerCase() === searchTerm.toLowerCase()
  );

  const [field, setField] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    // reset fields when searchTerm changes
    setField('');
    setValue('');
  }, [searchTerm]);

  const handleSave = () => {
    if (!selected || !field) return;

    setData((prev) =>
      prev.map((item) =>
        item.id === selected.id
          ? { ...item, [field]: isNaN(Number(value)) ? value : Number(value) }
          : item
      )
    );
    setValue('');
  };

  const handleAdd = () => {
    const nextId =
      data.length > 0
        ? Math.max(...data.map((d) => d.id)) + 1
        : 1;
    const template = data[0];
    const newItem = {} as T;
    (Object.keys(template) as (keyof T)[]).forEach((key) => {
      if (key === "id") {
        newItem[key] = nextId as T[keyof T];
      } else {
        const oldValue = template[key];
        const defaultValue =
          typeof oldValue === "number" ? 0 : "";
        newItem[key] = defaultValue as T[keyof T];
      }
    });
    setData((prev) => [...prev, newItem]);
    setSearchTerm('');
  };

  const handleDelete = () => {
    if (!selected) return;
    setData((prev) => prev.filter((item) => item.id !== selected.id));
    setSearchTerm('');
  };

  if (!open) return null;

  return (
    <div className="popup-backdrop">
      <div className="popup">
        <div className="popup-header">
          <button className="close-btn" onClick={onClose}>X</button>
          <h2>{title}</h2>
          <button className="add-btn" onClick={handleAdd}>Add</button>
        </div>

        {/* Search */}
        <input
          className="search-input"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Selected Table */}
        {selected && (
          <table className="popup-table">
            <thead>
              <tr>{Object.keys(selected).map((key) => <th key={key}>{key}</th>)}</tr>
            </thead>
            <tbody>
              <tr>{Object.values(selected).map((val, i) => <td key={i}>{val as string | number}</td>)}</tr>
            </tbody>
          </table>
        )}

        {/* Edit row */}
        <div className="edit-row">
          <select value={field} onChange={(e) => setField(e.target.value)}>
            <option value="">Select field</option>
            {selected &&
              Object.keys(selected)
                .filter((k) => k !== 'id')
                .map((k) => <option value={k} key={k}>{k}</option>)}
          </select>
          <input
            placeholder="New value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}