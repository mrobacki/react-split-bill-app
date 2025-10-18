import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [toggleForm, setToggleForm] = useState({
    addFriend: false,
    splitBill: false,
  });

  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleToggleForm(form, friend = null) {
    if (form !== "splitBill") {
      setToggleForm((f) => ({ ...f, [form]: !f[form] }));
    }

    const isOpen = toggleForm.splitBill;

    if (!isOpen) {
      setSelectedFriend(friend);
      setToggleForm((f) => ({ ...f, splitBill: true }));
      return;
    }

    if (selectedFriend && friend && selectedFriend.id !== friend.id) {
      setSelectedFriend(friend);
      setToggleForm((f) => ({ ...f, splitBill: true }));
      return;
    }

    setSelectedFriend(null);
    setToggleForm((f) => ({ ...f, splitBill: false }));
  }

  const [friends, setFriends] = useState(initialFriends);
  function addFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setToggleForm((f) => ({ ...f, addFriend: false }));
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          handleToggleForm={handleToggleForm}
          selectedFriend={selectedFriend}
          toggleForm={toggleForm}
        />
        {toggleForm.addFriend && <FormAddFriend onAddFriend={addFriend} />}
        <Button onClick={() => handleToggleForm("addFriend")}>
          {!toggleForm.addFriend ? "Add friend" : "Close"}
        </Button>
      </div>
      {toggleForm.splitBill && selectedFriend && (
        <FormSplitBill selectedFriend={selectedFriend} />
      )}
    </div>
  );
}

function FriendsList({
  friends,
  handleToggleForm,
  selectedFriend,
  toggleForm,
}) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          handleToggleForm={handleToggleForm}
          selectedFriend={selectedFriend}
          isSplitOpen={toggleForm.splitBill}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleToggleForm, selectedFriend, isSplitOpen }) {
  const isActive = isSplitOpen && selectedFriend?.id === friend.id;
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      <p
        className={
          friend.balance < 0 ? "red" : "" || friend.balance > 0 ? "green" : ""
        }
      >
        {friend.balance < 0 && (
          <>
            You owe {friend.name} {Math.abs(friend.balance)}€
          </>
        )}
        {friend.balance > 0 && (
          <>
            {friend.name} ownes you {Math.abs(friend.balance)}€
          </>
        )}
        {friend.balance === 0 && <>You and {friend.name} are even</>}
      </p>
      <Button onClick={() => handleToggleForm("splitBill", friend)}>
        {isActive ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [value, setValue] = useState({
    name: "",
    image: "https://i.pravatar.cc/48",
  });

  function handleValue(e) {
    const { name, value } = e.target;
    setValue((v) => ({ ...v, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!value.name || !value.image) return;

    const newFriend = {
      id: crypto.randomUUID(),
      name: value.name,
      image: value.image,
      balance: 0,
    };

    onAddFriend(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input
        type="text"
        name="name"
        value={value.name}
        onChange={handleValue}
        placeholder="Name"
      />
      <label>🌄 Image URL</label>
      <input
        type="text"
        name="image"
        value={value.image}
        onChange={handleValue}
        placeholder="Image URL"
      />

      <Button type="submit">Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend }) {
  return (
    <form className="form-split-bill">
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input type="text" />
      <label>🧍 Your expense</label>
      <input type="text" />
      <label>👫 {selectedFriend.name} expense</label>
      <span>XX</span>
      <label>🤑 Who is paying the bill</label>
      <select>
        <option>You</option>
        <option>{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
