import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import ContactForm from './ContactForm/ContactForm';
import ContactList from './ContactList/ContactList';
import Filter from './Filter/Filter';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const getBeginLocalContacts = () => {
  return JSON.parse(window.localStorage.getItem('phonebookContacts')) ?? [];
};

export default function App() {
  const [contacts, setContacts] = useState(getBeginLocalContacts);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    window.localStorage.setItem('phonebookContacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = (name, number) => {
    if (contacts.find(contact => contact.name === name)) {
      Notify.warning(`${name} is already in contacts`);
      return;
    }

    const newContact = {
      id: nanoid(),
      name,
      number,
    };

    setContacts([newContact, ...contacts]);
  };

  const handleDeleteContactById = contactId => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  const handleChangeFilter = event => {
    setFilter(event.currentTarget.value);
  };

  const filterContacts = contacts.filter(({ name }) =>
    name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 40,
        color: '#010101',
        flexDirection: 'column',
      }}
    >
      <h1>Phonebook</h1>
      <ContactForm onSubmit={handleAddContact} />
      <h2>Contacts</h2>
      <Filter value={filter} onChange={handleChangeFilter} />
      <ContactList
        contacts={filter === '' ? contacts : filterContacts}
        onDeleteContactById={handleDeleteContactById}
      />
    </div>
  );
}
