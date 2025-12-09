import { useState, useEffect } from 'react';
import './EditorPopup.css';

interface EditorPopupProps<T> {
  open: boolean;
  onClose: () => void;
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  title: string;
  tableType: "menu" | "inventory" | "employees";
}

const editableFields: Record<string, string[]> = {
  menu: ["name", "category", "price", "image"],
  inventory: ["name", "quantity"],
  employees: ["name", "username", "permissions"]
};

export function EditorPopup<T extends { id: number; name: string }>(
  { open, onClose, data, setData, title, tableType }: EditorPopupProps<T>
) {
  const [searchTerm, setSearchTerm] = useState('');
  const selected = data.find(
    (item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [field, setField] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    setField('');
    setValue('');
  }, [searchTerm]);

  // ---------------------
  // SAVE / UPDATE LOGIC
  // ---------------------
  const handleSave = async () => {
    if (!selected || !field) return;

    const updatedValue = isNaN(Number(value)) ? value : Number(value);
    const updated = { ...selected, [field]: updatedValue } as T;

    try {
      if (tableType === "inventory") {
        const res = await fetch(`http://localhost:3000/api/inventory/update-quantity`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selected.id, quantity: updatedValue })
        });
        if (!res.ok) throw new Error("Update failed");
      } else if (tableType === "employees") {
        if (field === "permissions") {
          const res = await fetch(
            `http://localhost:3000/api/employees/promote-employee?id=${selected.id}`,
            { method: "PATCH" }
          );
          if (!res.ok) throw new Error("Promotion failed");
        } else {
          console.log("Only permissions are supported for employees.");
        }
      } else if (tableType === "menu") {
        const res = await await fetch(`http://localhost:3000/api/update-menu-item/${selected.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
          }
        );

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Menu update failed");
      }

      setData(prev => prev.map(item => (item.id === selected.id ? updated : item)));
    } catch (error) {
      console.error("Update failed:", error);
    }

    setValue('');
  };

  // Add new item
  const handleAdd = async () => {
    try {
      if (tableType === "inventory") {
        const res = await fetch("http://localhost:3000/api/inventory/add-item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "New Item", quantity: 1 })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        const newItem = {
          id: json.id,
          name: "New Item",
          quantity: 1
        } as unknown as T;
        setData(prev => [...prev, newItem]);
      } else if (tableType === "employees") {
        const res = await fetch("http://localhost:3000/api/employees/add-employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "New Employee", permissions: 0 })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        const newEmployee = {
          id: json.employee.id,
          name: "New Employee",
          username: json.employee.username,
          permissions: 0
        } as unknown as T;
        setData(prev => [...prev, newEmployee]);
      } else if (tableType === "menu") {
        const res = await fetch("http://localhost:3000/api/menu/add-item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "New Menu Item",
            category: "Uncategorized",
            price: 0,
            image: ""
          })
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message);

        const newItem = {
          id: json.id,
          name: "New Menu Item",
          category: "Uncategorized",
          price: 0,
          image: ""
        } as unknown as T;

        setData(prev => [...prev, newItem]);
      }
    } catch (err) {
      console.error("Add failed:", err);
    }

    setSearchTerm('');
  };

  // Delete item
  const handleDelete = async () => {
    if (!selected) return;

    try {
      if (tableType === "inventory") {
        await fetch(`http://localhost:3000/api/inventory/delete-item?id=${selected.id}`, {
          method: "DELETE"
        });
      } else if (tableType === "employees") {
        await fetch(`http://localhost:3000/api/employees/delete-employee?id=${selected.id}`, {
          method: "DELETE"
        });
      } else if (tableType === "menu") {
        await fetch(`http://localhost:3000/api/menu/delete-item/${selected.id}`, {
          method: "DELETE"
        });
      }
      setData(prev => prev.filter(item => item.id !== selected.id));
    } catch (err) {
      console.error("Delete failed:", err);
    }

    setSearchTerm('');
  };

  // UI RENDER
  if (!open) return null;

  return (
    <div className="popup-backdrop">
      <div className="popup">
        <div className="popup-header">
          <button className="close-btn" onClick={onClose}>X</button>
          <h2>{title}</h2>
          <button className="add-btn" onClick={handleAdd}>Add</button>
        </div>

        <input
          className="search-input"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {selected && (
          <table className="popup-table">
            <thead>
              <tr>
                {Object.keys(selected).map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(selected).map((val, i) => (
                  <td key={`${selected.id}-${i}`}>{val as string | number}</td>
                ))}
              </tr>
            </tbody>
          </table>
        )}

        <div className="edit-row">
          <select value={field} onChange={(e) => setField(e.target.value)}>
            <option value="">Select field</option>
            {selected && editableFields[tableType].map(k => <option key={k} value={k}>{k}</option>)}
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