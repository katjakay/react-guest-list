import { useEffect, useState } from 'react';

export function GuestListForm() {
  const baseUrl = 'http://localhost:4000';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all guests (FETCH)
  async function fetchGuests() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuests(allGuests);
    setIsLoading(false);
  }
  useEffect(() => {
    fetchGuests().catch(() => console.log('Fetching failed!'));
  }, []);

  // Add a new guest (POST)
  async function addNewGuest(event) {
    event.preventDefault();
    console.log('A');
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    console.log('B');
    const createdGuest = await response.json();
    console.log(createdGuest);
    setGuests([...guests], createdGuest);
    fetchGuests().catch(() => console.log('Adding guest failed!'));
    setFirstName('');
    setLastName('');
  }

  // Delete a guest (DELETE)
  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    const newGuestList = guests.filter((i) => {
      return i.id !== deletedGuest.id;
    });
    setGuests(newGuestList);
    fetchGuests().catch(() => console.log('Deleting guest failed!'));
  }

  // Change guest attendance
  async function changeAttendanceStatus(id, value) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !value }),
    });
    const updatedGuest = await response.json();
    const updatedGuestList = guests.filter((i) => {
      return i.id !== updatedGuest.id;
    });
    setGuests([...guests], updatedGuestList);
    fetchGuests().catch(() => console.log('Status update failed!'));
  }

  return (
    <div>
      <h1>Guest List</h1>
      <div>
        <div>
          <div>
            <form onSubmit={addNewGuest}>
              <label htmlFor="first name">
                First name
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.currentTarget.value)}
                  disabled={isLoading}
                />
              </label>
              <br />
              <label htmlFor="last name">
                Last name
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.currentTarget.value)}
                  disabled={isLoading}
                />
              </label>
              <br />
              <div>
                <button onClick={addNewGuest} disabled={isLoading}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {isLoading && <h1>Loading...</h1>}
        {!isLoading && guests.length === 0 ? (
          <div>New guests, add here:</div>
        ) : (
          <div>
            <h2>Overview guest list</h2>
            <div>
              {guests.map((guest) => {
                return (
                  <div key={guest.id} data-test-id="guest">
                    <div>
                      {guest.firstName} {guest.lastName}
                    </div>
                    <label>
                      <input
                        aria-label={`${guest.firstName} ${guest.lastName} attending status `}
                        type="checkbox"
                        checked={guest.attending}
                        onChange={() => {
                          changeAttendanceStatus(
                            guest.id,
                            guest.attending,
                          ).catch((error) => console.log(error));
                        }}
                      />
                      {guest.attending === true ? 'attending' : 'not attending'}
                    </label>
                    <button
                      aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                      onClick={() => {
                        deleteGuest(guest.id).catch((error) =>
                          console.log(error),
                        );
                      }}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
