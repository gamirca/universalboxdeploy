import React, { useState, ChangeEvent, FormEvent } from 'react';

interface Item {
  id: number;
  value: string;
}

const NameForm = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewItem(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setItems([...items, { id: Math.random(), value: newItem }]);
    setNewItem('');
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Item:
          <input type="text" value={newItem} onChange={handleChange} />
        </label>
        <input type="submit" value="Adicionar" />
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.value}
            <button onClick={() => handleDelete(item.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NameForm;